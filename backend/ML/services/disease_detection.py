import os
import joblib
import pandas as pd

from .recommendation_engine import get_recommendations

# -----------------------------
# 1. Model Path (Robust)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "fish_disease_model.pkl")
MODEL_PATH = os.path.normpath(MODEL_PATH)

# Load model once (efficient)
model = joblib.load(MODEL_PATH)

# -----------------------------
# 2. Symptoms List (MUST match training)
# -----------------------------
SYMPTOMS = [
    "loss_of_appetite",
    "lethargy",
    "erratic_swimming",
    "isolation",
    "surface_swimming",
    "gasping_for_air",
    "skin_lesions",
    "ulcers",
    "fin_rot",
    "scale_loss",
    "body_swelling",
    "discoloration",
    "eye_cloudiness",
    "excess_mucus",
    "gill_discoloration",
    "rapid_gill_movement",
    "white_spots",
    "fungal_growth",
    "bloody_patches"
]

# -----------------------------
# 3. Expected Base Fields
# -----------------------------
BASE_FIELDS = [
    "species",
    "age_group",
    "temperature",
    "ph",
    "oxygen",
    "stocking_density",
    "water_source",
    "recent_deaths",
    "death_rate"
]

# -----------------------------
# 4. Core Prediction Function
# -----------------------------
def predict_disease(data: dict):
    """
    Input:
        data (dict) → incoming API payload

    Output:
        dict → prediction + confidence + recommendations
    """

    # Copy to avoid mutating original request
    data = data.copy()

    # -----------------------------
    # Extract symptoms
    # -----------------------------
    symptoms_input = data.pop("symptoms", [])

    # -----------------------------
    # Validate symptoms
    # -----------------------------
    invalid = [s for s in symptoms_input if s not in SYMPTOMS]
    if invalid:
        raise ValueError(f"Invalid symptoms: {invalid}")

    # -----------------------------
    # Convert symptoms → binary
    # -----------------------------
    for symptom in SYMPTOMS:
        data[symptom] = 1 if symptom in symptoms_input else 0

    # -----------------------------
    # Ensure required fields exist
    # -----------------------------
    for field in BASE_FIELDS:
        if field not in data:
            raise ValueError(f"Missing field: {field}")

    # -----------------------------
    # Convert to DataFrame
    # -----------------------------
    df = pd.DataFrame([data])

    # -----------------------------
    # Predict disease
    # -----------------------------
    prediction = model.predict(df)[0]

    # -----------------------------
    # Confidence score
    # -----------------------------
    try:
        probabilities = model.predict_proba(df)[0]
        confidence = float(max(probabilities))
    except Exception:
        confidence = None

    # -----------------------------
    # Get recommendations
    # -----------------------------
    recommendation_data = get_recommendations(
        prediction,
        species=data.get("species")
    )

    # -----------------------------
    # Final structured response
    # -----------------------------
    return {
        "predicted_disease": prediction,
        "confidence": round(confidence, 3) if confidence else None,
        "severity": recommendation_data["severity"],
        "priority_actions": recommendation_data["priority_actions"],
        "recommendations": recommendation_data["recommendations"],
        "prevention": recommendation_data["prevention"],
    }