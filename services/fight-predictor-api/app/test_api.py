import sys
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.api import app
from app.database import connect_db, import_data, predict_matchup


class PredictorApiTests(unittest.TestCase):
    def test_predict_matchup_returns_probabilities(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / 'test_fight_predictor.db'
            import_data(
                db_path=db_path,
                fighters_csv=Path('data/fighters.csv'),
                fights_csv=Path('data/fights.csv'),
            )
            connection = connect_db(db_path)
            result = predict_matchup(connection, 1, 2)
            connection.close()

            self.assertIn('red_win_probability', result)
            self.assertIn('blue_win_probability', result)
            self.assertIn('favorite', result)
            self.assertGreaterEqual(result['red_win_probability'], 0)
            self.assertLessEqual(result['red_win_probability'], 1)

    def test_cards_endpoint_returns_json_rows(self) -> None:
        with TestClient(app) as client:
            response = client.get('/cards')

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIsInstance(payload, list)
        self.assertTrue(any(isinstance(item, dict) for item in payload))


if __name__ == '__main__':
    unittest.main()
