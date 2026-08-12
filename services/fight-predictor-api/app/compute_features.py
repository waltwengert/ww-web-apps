import pandas as pd
from datetime import date

def compute_features(f):
    # Convert dates
    birth_red = pd.to_datetime(f["birth_date"])
    birth_blue = pd.to_datetime(f["birth_date_blue"])
    fight_date = pd.to_datetime(f.get("fight_date", date.today()))

    # Age
    age_red = (fight_date - birth_red).days
    age_blue = (fight_date - birth_blue).days

    # Win ratio
    win_ratio_red = f["total_wins"] / (f["total_wins"] + f["total_losses"])
    win_ratio_blue = f["total_wins_blue"] / (f["total_wins_blue"] + f["total_losses_blue"])

    # Strike accuracy normalized
    sa_red = f["strike_accuracy"] / 100
    sa_blue = f["strike_accuracy_blue"] / 100

    # Takedown accuracy normalized
    td_acc_red = f["td_accuracy"] / 100
    td_acc_blue = f["td_accuracy_blue"] / 100

    # Takedown defense normalized
    td_def_red = f["td_defence"] / 100
    td_def_blue = f["td_defence_blue"] / 100

    return {
        "height_diff": f["height_cm"] - f["height_cm_blue"],
        "reach_diff": f["reach_cm"] - f["reach_cm_blue"],
        "age_diff_days": age_red - age_blue,
        "experience_diff": (f["total_wins"] + f["total_losses"]) -
                           (f["total_wins_blue"] + f["total_losses_blue"]),
        "win_ratio_diff": win_ratio_red - win_ratio_blue,
        "striking_threat_diff": (f["strikes_landed_per_minute"] * sa_red) -
                                (f["strikes_landed_per_minute_blue"] * sa_blue),
        "striking_defense_diff": (-f["strikes_absorbed_per_minute"]) -
                                 (-f["strikes_absorbed_per_minute_blue"]),
        "td_threat_diff": (f["takedown_average"] * td_acc_red) -
                          (f["takedown_average_blue"] * td_acc_blue),
        "td_defense_diff": td_def_red - td_def_blue,
        "submission_threat_diff": f["submission_average"] - f["submission_average_blue"],
        "ufc_win_streak_diff": f["current_ufc_win_streak"] - f["current_ufc_win_streak_blue"]
    }