import joblib
import os
import pandas as pd

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "../models/fish_growth_model.pkl"
)

model = joblib.load(MODEL_PATH)

def predict_growth(data: dict):
    # Convert input to DataFrame
    df = pd.DataFrame([data])

    prediction = model.predict(df)

    return float(prediction[0])