import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

def train_model():
    print("📊 Loading dataset...")
    df = pd.read_csv("student_data.csv")

    print(f"✅ Dataset loaded! {len(df)} students found")
    print(df.head())

    # ── Features and Target ──
    # Features = inputs we give the model
    X = df[["study_hours", "attendance", "assignments", "prev_grade"]]
    # Target = what we want to predict
    y = df["final_grade"]

    # ── Split data into training and testing ──
    # 80% for training, 20% for testing
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"\n📚 Training with {len(X_train)} students...")
    print(f"🧪 Testing with {len(X_test)} students...")

    # ── Train the ML Model ──
    # Random Forest = many decision trees working together
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # ── Test the Model ──
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print(f"\n🎯 Model Performance:")
    print(f"   Mean Absolute Error: {mae:.2f} (lower is better)")
    print(f"   R2 Score: {r2:.2f} (1.0 is perfect)")

    # ── Save the trained model ──
    with open("grade_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("\n✅ Model saved as grade_model.pkl!")
    return model

if __name__ == "__main__":
    train_model()