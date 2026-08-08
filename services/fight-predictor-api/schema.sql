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
    strikes_landed_per_minute REAL, -- significant strikes landed per minute, if known
    strikes_absorbed_per_minute REAL, -- significant strikes absorbed per minute, if known
    takedown_average REAL, -- takedowns landed per 15 minutes, if known
    submission_average REAL, -- submission attempts per 15 minutes, if known
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

CREATE TABLE IF NOT EXISTS weight_classes (
    weight_class_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- weight class name (e.g., "Welterweight")
    max_pounds INTEGER NOT NULL, -- weight limit in pounds
    gender TEXT NOT NULL DEFAULT 'M' -- 'M' for male, 'F' for female, 'U' for unisex
);

CREATE TABLE IF NOT EXISTS fights (
    fight_id INTEGER PRIMARY KEY,
    card_id INTEGER NOT NULL, -- parent card this fight belongs to
    weight_class_id INTEGER, -- foreign key to standard weight class, NULL for catch weights
    fight_weight_class TEXT, -- display name including catch weights (e.g. "Catchweight (157.5 lb)")
    weight_class_pounds INTEGER, -- numeric weight limit in pounds (denormalized for query convenience)
    fight_gender TEXT, -- gender of the bout
    fight_date TEXT, -- date of the bout, denormalized from card for query convenience
    red_fighter_id INTEGER NOT NULL, -- fighter ID for the red corner
    blue_fighter_id INTEGER NOT NULL, -- fighter ID for the blue corner
    is_main_event INTEGER NOT NULL DEFAULT 0, -- boolean: is this the main event fight?
    is_title_fight INTEGER NOT NULL DEFAULT 0, -- boolean: is this a title/championship fight?
    winner_id INTEGER, -- fighter ID of the winner, if known
    result_method TEXT, -- full method of victory (e.g., "TKO (punches), "Decision (unanimous) (30–27, 30–27, 30–27)")
    result_method_type TEXT, -- normalized method type: TKO, KO, Submission, or Decision
    result_round TEXT, -- round the bout ended, if known
    FOREIGN KEY(card_id) REFERENCES cards(card_id),
    FOREIGN KEY(weight_class_id) REFERENCES weight_classes(weight_class_id),
    FOREIGN KEY(red_fighter_id) REFERENCES fighters(fighter_id),
    FOREIGN KEY(blue_fighter_id) REFERENCES fighters(fighter_id),
    FOREIGN KEY(winner_id) REFERENCES fighters(fighter_id)
);
