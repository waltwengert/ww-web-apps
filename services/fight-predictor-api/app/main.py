import sys
from pathlib import Path

import uvicorn

if __package__ in {None, ''}:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from app.database import connect_db, import_data
else:
    from .database import connect_db, import_data


def main() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    data_dir = repo_root / 'data'
    service_root = Path(__file__).resolve().parents[1]

    db_path = import_data(
        db_path=service_root / 'fight_predictor.db',
        fighters_csv=data_dir / 'fighters.csv',
        fights_csv=data_dir / 'fights.csv',
        cards_csv=data_dir / 'cards.csv',
    )
    with connect_db(db_path) as connection:
        fighter_count = connection.execute('SELECT COUNT(*) FROM fighters').fetchone()[0]
        fight_count = connection.execute('SELECT COUNT(*) FROM fights').fetchone()[0]

    print(f'Database ready at {db_path}')
    print(f'Imported {fighter_count} fighters and {fight_count} fights')
    print('Starting Fight Predictor API on http://127.0.0.1:8000')
    uvicorn.run('app.api:app', host='127.0.0.1', port=8000, reload=False)


if __name__ == '__main__':
    main()
