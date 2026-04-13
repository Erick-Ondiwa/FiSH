def get_feeding_strategy(species, age_group):
    species = species.lower()
    age_group = age_group.lower()

    # -------------------------
    # TILAPIA
    # -------------------------
    if species == "tilapia":
        if age_group == "fingerlings":
            return {"meals_per_day": 4, "interval": 4}
        elif age_group == "juvenile":
            return {"meals_per_day": 3, "interval": 6}
        elif age_group == "adult":
            return {"meals_per_day": 2, "interval": 8}

    # -------------------------
    # CATFISH
    # -------------------------
    elif species == "catfish":
        if age_group == "fingerlings":
            return {"meals_per_day": 4, "interval": 4}
        elif age_group == "juvenile":
            return {"meals_per_day": 3, "interval": 6}
        elif age_group == "adult":
            return {"meals_per_day": 2, "interval": 8}

    # -------------------------
    # TROUT
    # -------------------------
    elif species == "trout":
        if age_group == "fingerlings":
            return {"meals_per_day": 5, "interval": 3}
        elif age_group == "juvenile":
            return {"meals_per_day": 3, "interval": 6}
        elif age_group == "adult":
            return {"meals_per_day": 2, "interval": 10}

    # -------------------------
    # NILE PERCH
    # -------------------------
    elif species == "nile_perch":
        if age_group == "fingerlings":
            return {"meals_per_day": 4, "interval": 5}
        elif age_group == "juvenile":
            return {"meals_per_day": 2, "interval": 8}
        elif age_group == "adult":
            return {"meals_per_day": 1, "interval": 24}

    return {"meals_per_day": 2, "interval": 8}