CREATE TABLE IF NOT EXISTS fighters (
    fighter_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- fighter's full name
    birth_date DATE, -- fighter's date of birth, if known
    height_cm INTEGER, -- height in centimeters, if known
    reach_cm INTEGER, -- reach in centimeters, if known
    total_wins INTEGER, -- total career wins from the most recent stats snapshot
    ko_wins INTEGER, -- knockout wins from the most recent stats snapshot
    submission_wins INTEGER, -- submission wins from the most recent stats snapshot
    decision_wins INTEGER, -- decision wins from the most recent stats snapshot
    total_losses INTEGER, -- total career losses from the most recent stats snapshot
    ko_losses INTEGER, -- knockout losses from the most recent stats snapshot
    submission_losses INTEGER, -- submission losses from the most recent stats snapshot
    decision_losses INTEGER, -- decision losses from the most recent stats snapshot
    td_accuracy REAL, -- takedown accuracy percentage, if known
    td_defence REAL, -- takedown defense percentage, if known
    strike_accuracy REAL, -- striking accuracy percentage, if known
    strike_defence REAL, -- striking defense percentage, if known
    current_ufc_win_streak INTEGER, -- current win streak in UFC competition, if known
    last_seen_fight DATE, -- date of the most recently known fight for this fighter
    record_scope TEXT NOT NULL DEFAULT 'career', -- scope of the summary stats in this row
    stats_last_updated DATE -- when the summary stats in this row were last refreshed
);

CREATE TABLE IF NOT EXISTS cards (
    card_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- display name of the fight card
    event_date TEXT, -- date of the event, if known
    location TEXT -- location of the event, if known
);

CREATE TABLE IF NOT EXISTS fights (
    fight_id INTEGER PRIMARY KEY,
    card_id INTEGER NOT NULL, -- parent card this fight belongs to
    fight_weight_class TEXT, -- weight class for the bout
    fight_gender TEXT, -- gender of the bout
    fight_rounds INTEGER, -- number of scheduled rounds
    fight_date TEXT, -- date of the bout, if known
    red_fighter_id INTEGER NOT NULL, -- fighter ID for the red corner
    blue_fighter_id INTEGER NOT NULL, -- fighter ID for the blue corner
    winner_id INTEGER, -- fighter ID of the winner, if known
    result_method TEXT, -- method of victory, if known
    result_round TEXT, -- round the bout ended, if known
    FOREIGN KEY(card_id) REFERENCES cards(card_id),
    FOREIGN KEY(red_fighter_id) REFERENCES fighters(fighter_id),
    FOREIGN KEY(blue_fighter_id) REFERENCES fighters(fighter_id),
    FOREIGN KEY(winner_id) REFERENCES fighters(fighter_id)
);
