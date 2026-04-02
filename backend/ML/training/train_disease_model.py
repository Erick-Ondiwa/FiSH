import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# -------------------------
# 1. Paths (ROBUST)
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "..", "data", "fish_disease_dataset.csv")
DATA_PATH = os.path.normpath(DATA_PATH)

MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
MODEL_DIR = os.path.normpath(MODEL_DIR)
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "fish_disease_model.pkl")

# -------------------------
# 2. Load Data
# -------------------------
df = pd.read_csv(DATA_PATH)

# -------------------------
# 3. Features / Target
# -------------------------
X = df.drop("disease", axis=1)
y = df["disease"]

# -------------------------
# 4. Column Groups
# -------------------------
categorical_features = ["species", "age_group", "water_source"]

numeric_features = [
    "temperature",
    "ph",
    "oxygen",
    "stocking_density",
    "death_rate",
    "recent_deaths"
]

# Symptoms = all remaining binary columns
symptom_features = [
    col for col in X.columns
    if col not in categorical_features + numeric_features
]

# -------------------------
# 5. Preprocessing
# -------------------------
numeric_transformer = Pipeline([
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline([
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features),
    ("symptoms", "passthrough", symptom_features)
])

# -------------------------
# 6. Model
# -------------------------
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    random_state=42,
    class_weight="balanced"
)

# -------------------------
# 7. Full Pipeline
# -------------------------
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# -------------------------
# 8. Train/Test Split
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------
# 9. Train
# -------------------------
pipeline.fit(X_train, y_train)

# -------------------------
# 10. Evaluate
# -------------------------
preds = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, preds)

print(f"\nAccuracy: {accuracy:.4f}")
print("\nClassification Report:\n")
print(classification_report(y_test, preds))

# -------------------------
# 11. Save Model
# -------------------------
joblib.dump(pipeline, MODEL_PATH)

print(f"\nModel saved at: {MODEL_PATH}")