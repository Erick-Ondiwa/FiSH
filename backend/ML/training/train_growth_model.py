import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build correct path
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "fish_growth_prediction.csv")

# Normalize path
DATA_PATH = os.path.normpath(DATA_PATH)

df = pd.read_csv(DATA_PATH)

print("Loaded from:", DATA_PATH)

# -------------------------
# 2. Features / Target
# -------------------------
X = df.drop("target_weight", axis=1)
y = df["target_weight"]

# -------------------------
# 3. Column groups 
# -------------------------
categorical_features = ["Species"]

numeric_features = [
    "temperature",
    "oxygen",
    "ph",
    "density",
    "feeding_rate",
    "initial_weight",
    "days"
]
# -------------------------
# 4. Preprocessing
# -------------------------
numeric_transformer = Pipeline(steps=[
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)

# -------------------------
# 5. Model
# -------------------------
model = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

# -------------------------
# 6. Full Pipeline
# -------------------------
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", model)
])

# -------------------------
# 7. Train/Test Split
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------
# 8. Train
# -------------------------
pipeline.fit(X_train, y_train)

# -------------------------
# 9. Evaluate
# -------------------------
preds = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print(f"MAE: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")

# -------------------------
# 10. Save Model
# -------------------------
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
MODEL_DIR = os.path.normpath(MODEL_DIR)

os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "fish_growth_model.pkl")
joblib.dump(pipeline, MODEL_PATH)

print(f"Model saved at: {MODEL_PATH}")

