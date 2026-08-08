import sys
from pathlib import Path

if __package__ in {None, ''}:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from app.database import connect_db, import_data
else:
    from .database import connect_db, import_data


def main() -> None:
    db_path = import_data()
    with connect_db(db_path) as connection:
        fighter_count = connection.execute('SELECT COUNT(*) FROM fighters').fetchone()[0]
        fight_count = connection.execute('SELECT COUNT(*) FROM fights').fetchone()[0]

    print(f'Database ready at {db_path}')
    print(f'Imported {fighter_count} fighters and {fight_count} fights')


if __name__ == '__main__':
    main()
