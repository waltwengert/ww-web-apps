from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import connect_db, get_fighter, get_fighters, get_fights

app = FastAPI(title='Fight Predictor API')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


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
def predict(fighter_payload: Dict[str, Any]) -> Dict[str, Any]:
    connection = get_connection()
    try:
        red_fighter_id = fighter_payload.get('red_fighter_id')
        blue_fighter_id = fighter_payload.get('blue_fighter_id')
        if not red_fighter_id or not blue_fighter_id:
            raise HTTPException(status_code=400, detail='Both fighter IDs are required')

        red = get_fighter(connection, int(red_fighter_id))
        blue = get_fighter(connection, int(blue_fighter_id))
        if red is None or blue is None:
            raise HTTPException(status_code=404, detail='One or both fighters not found')

        red_total = (red.get('total_wins') or 0) + (red.get('total_losses') or 0)
        blue_total = (blue.get('total_wins') or 0) + (blue.get('total_losses') or 0)

        if red_total == 0 or blue_total == 0:
            red_prob, blue_prob = 0.5, 0.5
        else:
            red_prob = (red.get('total_wins') or 0) / red_total
            blue_prob = (blue.get('total_wins') or 0) / blue_total

        if red_prob > blue_prob:
            favorite = 'red'
        elif blue_prob > red_prob:
            favorite = 'blue'
        else:
            favorite = 'draw'

        return {'red_win_probability': red_prob, 'blue_win_probability': blue_prob, 'favorite': favorite}
    finally:
        connection.close()
