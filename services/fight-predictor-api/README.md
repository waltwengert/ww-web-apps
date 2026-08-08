# Fight Predictor API

Local backend service for the MMA fight predictor using SQLite.

## Database schema

The current database design is intentionally small and focused on three core tables:

- `fighters` stores the fighter profile and the latest collected summary stats
- `cards` stores the event or fight card metadata
- `fights` stores the individual bout record and links it to a card plus the two fighters involved

```mermaid
erDiagram
    fighters ||--o{ fights : "red_fighter_id"
    fighters ||--o{ fights : "blue_fighter_id"
    fighters ||--o{ fights : "winner_id"
    cards ||--o{ fights : "card_id"

    fighters {
        integer fighter_id PK
        text name
        date birth_date
        integer height_cm
        integer reach_cm
        integer total_wins
        integer ko_wins
        integer submission_wins
        integer decision_wins
        integer total_losses
        integer ko_losses
        integer submission_losses
        integer decision_losses
        real td_accuracy
        real td_defence
        real strike_accuracy
        real strike_defence
        integer current_ufc_win_streak
        date last_seen_fight
        text record_scope
        date stats_last_updated
    }

    cards {
        integer card_id PK
        text name
        text event_date
        text location
    }

    fights {
        integer fight_id PK
        integer card_id FK
        text fight_weight_class
        text fight_gender
        integer fight_rounds
        text fight_date
        integer red_fighter_id FK
        integer blue_fighter_id FK
        integer winner_id FK
        text result_method
        text result_round
    }
```

## Notes on the design

- `fighters` is the authoritative record for each fighter and holds the latest collected stat snapshot.
- `cards` represents a fight night or event and can contain many fights.
- `fights` does not duplicate fighter stats. It only stores the fighter IDs and the result metadata needed for analysis.
- The fighter summary values are stored as snapshot data and are intended to be refreshed over time. The `record_scope` and `stats_last_updated` fields make that explicit.
- The import workflow creates cards dynamically from the imported fight data so the schema stays normalized without requiring a separate manual card entry step.

## Local setup

No additional runtime packages are required yet. The current focus is the database import and schema.

```bash
cd /home/waltf/Code/ww-web-apps/services/fight-predictor-api
python3 app/main.py
```

This will create or refresh the SQLite database and print the number of imported fighters and fights.

## What is in scope right now

- SQLite schema in [schema.sql](schema.sql)
- database bootstrap/import logic in [app/database.py](app/database.py)
- a minimal local entrypoint in [app/main.py](app/main.py)

## What is intentionally deferred

- a full HTTP API layer
- request/response models
- deployment concerns

Those can be introduced later once the database schema is stable.
