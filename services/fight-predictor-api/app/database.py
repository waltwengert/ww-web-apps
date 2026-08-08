import csv
import sqlite3
from pathlib import Path
from typing import Any, Dict, Iterable, Optional

REPO_ROOT = Path(__file__).resolve().parents[3]
SERVICE_ROOT = REPO_ROOT / 'services' / 'fight-predictor-api'
DB_PATH = SERVICE_ROOT / 'fight_predictor.db'
SCHEMA_PATH = SERVICE_ROOT / 'schema.sql'

FIGHTER_FIELDS = [
    'fighter_id',
    'name',
    'birth_date',
    'height_cm',
    'reach_cm',
    'total_wins',
    'ko_wins',
    'submission_wins',
    'decision_wins',
    'total_losses',
    'ko_losses',
    'submission_losses',
    'decision_losses',
    'td_accuracy',
    'td_defence',
    'strike_accuracy',
    'strike_defence',
    'current_ufc_win_streak',
    'last_seen_fight',
    'record_scope',
    'stats_last_updated'
]

FIGHTER_SOURCE_FIELDS = FIGHTER_FIELDS

FIGHT_FIELDS = [
    'fight_id',
    'card_id',
    'fight_weight_class',
    'weight_class_pounds',
    'fight_gender',
    'fight_date',
    'red_fighter_id',
    'blue_fighter_id',
    'is_main_event',
    'is_title_fight',
    'winner_id',
    'result_method',
    'result_method_type',
    'result_round'
]

FIGHT_SOURCE_FIELDS = [
    'fight_id',
    'card_id',
    'fight_weight_class',
    'weight_class_pounds',
    'fight_gender',
    'fight_date',
    'red_fighter_id',
    'blue_fighter_id',
    'is_main_event',
    'is_title_fight',
    'result_winner_id',
    'result_method',
    'result_method_type',
    'result_round'
]


def connect_db(path: Optional[Path] = None) -> sqlite3.Connection:
    connection = sqlite3.connect(str(path or DB_PATH))
    connection.row_factory = sqlite3.Row
    return connection


def init_db(connection: sqlite3.Connection) -> None:
    schema_sql = SCHEMA_PATH.read_text(encoding='utf-8')
    connection.executescript(schema_sql)
    connection.commit()


def fetch_all(connection: sqlite3.Connection, query: str, args: Iterable[Any] = ()) -> list[Dict[str, Any]]:
    cursor = connection.execute(query, tuple(args))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def get_fighters(connection: sqlite3.Connection) -> list[Dict[str, Any]]:
    return fetch_all(connection, 'SELECT * FROM fighters ORDER BY name')


def get_fights(connection: sqlite3.Connection) -> list[Dict[str, Any]]:
    return fetch_all(connection, 'SELECT * FROM fights ORDER BY fight_id')


def get_fighter(connection: sqlite3.Connection, fighter_id: int) -> Optional[Dict[str, Any]]:
    cursor = connection.execute('SELECT * FROM fighters WHERE fighter_id = ?', (fighter_id,))
    row = cursor.fetchone()
    return dict(row) if row else None


def create_fighter(connection: sqlite3.Connection, fighter: Dict[str, Any]) -> Dict[str, Any]:
    columns = [k for k in FIGHTER_FIELDS if k in fighter and fighter[k] is not None]
    values = [fighter[k] for k in columns]
    placeholders = ','.join(['?'] * len(columns))
    connection.execute(
        f'INSERT INTO fighters ({','.join(columns)}) VALUES ({placeholders})',
        tuple(values)
    )
    connection.commit()
    return get_fighter(connection, connection.execute('SELECT last_insert_rowid()').fetchone()[0])


def create_fight(connection: sqlite3.Connection, fight: Dict[str, Any]) -> Dict[str, Any]:
    columns = [k for k in FIGHT_FIELDS if k in fight and fight[k] is not None]
    values = [fight[k] for k in columns]
    placeholders = ','.join(['?'] * len(columns))
    connection.execute(
        f'INSERT INTO fights ({','.join(columns)}) VALUES ({placeholders})',
        tuple(values)
    )
    connection.commit()
    cursor = connection.execute('SELECT last_insert_rowid()')
    fight_id = cursor.fetchone()[0]
    return fetch_all(connection, 'SELECT * FROM fights WHERE fight_id = ?', (fight_id,))[0]


def load_csv_data(
    connection: sqlite3.Connection,
    csv_path: Path,
    columns: list[str],
    table: str,
    source_columns: Optional[list[str]] = None,
) -> None:
    with csv_path.open(newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        if reader.fieldnames is None:
            raise ValueError('CSV file is missing a header row')

        writer = connection.cursor()
        values_placeholder = ','.join('?' for _ in columns)
        insert_sql = f'INSERT OR REPLACE INTO {table} ({','.join(columns)}) VALUES ({values_placeholder})'

        source_columns = source_columns or columns
        batch = []
        for row in reader:
            batch.append(tuple(row.get(source_column, None) for source_column in source_columns))

        writer.executemany(insert_sql, batch)
    connection.commit()


def get_or_create_card(connection: sqlite3.Connection, name: str, event_date: Optional[str] = None) -> int:
    existing = connection.execute('SELECT card_id FROM cards WHERE name = ?', (name,)).fetchone()
    if existing is not None:
        return existing[0]

    cursor = connection.execute(
        'INSERT INTO cards (name, event_date) VALUES (?, ?)',
        (name, event_date),
    )
    connection.commit()
    return cursor.lastrowid


def load_cards_csv(connection: sqlite3.Connection, csv_path: Optional[Path]) -> None:
    if csv_path is None or not csv_path.exists():
        return

    load_csv_data(
        connection,
        csv_path,
        ['card_id', 'name', 'event_date', 'location'],
        'cards',
        ['card_id', 'name', 'event_date', 'location'],
    )


def load_fights_with_cards(connection: sqlite3.Connection, csv_path: Path) -> None:
    with csv_path.open(newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        if reader.fieldnames is None:
            raise ValueError('CSV file is missing a header row')

        batch = []
        card_lookup: dict[str, int] = {}
        for row in reader:
            card_id_value = (row.get('card_id') or '').strip()
            if card_id_value:
                card_id = int(card_id_value)
            else:
                card_name = (row.get('fight_card') or '').strip()
                if not card_name:
                    card_name = (row.get('fight_date') or '').strip()
                if not card_name:
                    card_name = 'Unknown card'

                event_date = (row.get('fight_date') or '').strip() or None
                card_id = card_lookup.get(card_name)
                if card_id is None:
                    card_id = get_or_create_card(connection, card_name, event_date)
                    card_lookup[card_name] = card_id

            batch.append((
                row.get('fight_id'),
                card_id,
                row.get('fight_weight_class'),
                row.get('weight_class_pounds') or None,
                row.get('fight_gender'),
                row.get('fight_date'),
                row.get('red_fighter_id'),
                row.get('blue_fighter_id'),
                1 if row.get('is_main_event') == '1' else 0,
                1 if row.get('is_title_fight') == '1' else 0,
                row.get('result_winner_id') or None,
                row.get('result_method'),
                row.get('result_method_type'),
                row.get('result_round'),
            ))

        if batch:
            connection.executemany(
                """
                INSERT OR REPLACE INTO fights (
                    fight_id,
                    card_id,
                    fight_weight_class,
                    weight_class_pounds,
                    fight_gender,
                    fight_date,
                    red_fighter_id,
                    blue_fighter_id,
                    is_main_event,
                    is_title_fight,
                    winner_id,
                    result_method,
                    result_method_type,
                    result_round
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                batch,
            )
    connection.commit()


def update_last_seen_fights(connection: sqlite3.Connection) -> None:
    fighters = fetch_all(connection, 'SELECT fighter_id FROM fighters')

    for fighter in fighters:
        fighter_id = fighter['fighter_id']
        latest_fight = connection.execute(
            """
            SELECT fight_date
            FROM fights
            WHERE fight_date IS NOT NULL
              AND fight_date != ''
              AND (red_fighter_id = ? OR blue_fighter_id = ?)
            ORDER BY fight_date DESC
            LIMIT 1
            """,
            (fighter_id, fighter_id),
        ).fetchone()

        if latest_fight is not None and latest_fight[0] is not None:
            connection.execute(
                'UPDATE fighters SET last_seen_fight = ? WHERE fighter_id = ?',
                (latest_fight[0], fighter_id),
            )

    connection.commit()


def import_data(db_path: Path, fighters_csv: Path, fights_csv: Path, cards_csv: Path) -> Path:
    if db_path.exists():
        db_path.unlink()

    connection = connect_db(db_path)
    init_db(connection)
    load_csv_data(connection, fighters_csv, FIGHTER_FIELDS, 'fighters', FIGHTER_SOURCE_FIELDS)
    load_cards_csv(connection, cards_csv)
    load_fights_with_cards(connection, fights_csv)
    update_last_seen_fights(connection)
    connection.close()
    return db_path
