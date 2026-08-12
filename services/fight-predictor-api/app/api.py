from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

from app.database import connect_db, get_fighter, get_fighters, get_fights
from app.compute_features import compute_features

app = FastAPI(title='Fight Predictor API')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# Load model and feature list once at startup
model = joblib.load("winner_model.pkl")
model_features = joblib.load("winner_model_features.pkl")


def get_connection() -> Any:
    return connect_db()


@app.get('/fighters')
def list_fighters() -> List[Dict[str, Any]]:
    connection = get_connection()
    try:
        return get_fighters(connection)
    finally:
        connection.close()


@app.get('/fighters/{fighter_id}')
def read_fighter(fighter_id: int) -> Dict[str, Any]:
    connection = get_connection()
    try:
        fighter = get_fighter(connection, fighter_id)
        if fighter is None:
            raise HTTPException(status_code=404, detail='fighter not found')
        return fighter
    finally:
        connection.close()


@app.get('/cards')
def list_cards() -> List[Dict[str, Any]]:
    connection = get_connection()
    try:
        rows = connection.execute('SELECT * FROM cards ORDER BY event_date, name').fetchall()
        return [dict(row) for row in rows]
    finally:
        connection.close()


@app.get('/fights')
def list_fights() -> List[Dict[str, Any]]:
    connection = get_connection()
    try:
        rows = get_fights(connection)
        return [dict(row) for row in rows]
    finally:
        connection.close()


@app.post('/predict')
def predict(prediction_payload: Dict[str, Any]) -> Dict[str, Any]:
    connection = get_connection()
    try:
        red_fighter_id = prediction_payload.get('red_fighter_id')
        blue_fighter_id = prediction_payload.get('blue_fighter_id')
        if not red_fighter_id or not blue_fighter_id:
            raise HTTPException(status_code=400, detail='Both fighter IDs are required')

        # Get fighter data from the database
        red_fighter = get_fighter(connection, int(red_fighter_id))
        blue_fighter = get_fighter(connection, int(blue_fighter_id))
        if red_fighter is None or blue_fighter is None:
            raise HTTPException(status_code=404, detail='One or both fighters not found')

        # Get data ready to input into the model
        # 1. Computer numeric features
        numeric_features = compute_features({
            **red_fighter,
            **{f"{k}_blue": v for k, v in blue_fighter.items()}
        })
        # 2. Build categorical one-hot features
        categorical_onehot = {
            f"fight_gender_{prediction_payload['fight_gender']}": 1,
            f"is_main_event_{prediction_payload['is_main_event']}": 1,
            f"is_title_fight_{prediction_payload['is_title_fight']}": 1
        }
        # 3. Create a dataframe with the features
        row = {**numeric_features, **categorical_onehot}
        features_df = pd.DataFrame([row], columns=model_features).fillna(0)

        # Make prediction
        prediction = model.predict_proba(features_df)[0][1]

        return {
            'red_win_probability': float(prediction),
            'blue_win_probability': float(1 - prediction),
            'favorite': red_fighter['name'] if prediction > 0.5 else blue_fighter['name']
        }
    finally:
        connection.close()
