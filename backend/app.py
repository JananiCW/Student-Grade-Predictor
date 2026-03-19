from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained model
print("🤖 Loading ML model...")
with open("grade_model.pkl", "rb") as f:
    model = pickle.load(f)
print("✅ Model loaded!")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Get inputs from request
        study_hours  = float(data["study_hours"])
        attendance   = float(data["attendance"])
        assignments  = float(data["assignments"])
        prev_grade   = float(data["prev_grade"])

        # Validate inputs
        if not (0 <= attendance <= 100):
            return jsonify({"error": "Attendance must be between 0 and 100"}), 400
        if not (0 <= assignments <= 100):
            return jsonify({"error": "Assignments must be between 0 and 100"}), 400
        if not (0 <= prev_grade <= 100):
            return jsonify({"error": "Previous grade must be between 0 and 100"}), 400
        if not (0 <= study_hours <= 24):
            return jsonify({"error": "Study hours must be between 0 and 24"}), 400

        # Make prediction
        features = np.array([[study_hours, attendance, assignments, prev_grade]])
        prediction = model.predict(features)[0]

        # Cap between 0 and 100
        prediction = max(0, min(100, round(prediction, 1)))

        # Grade letter
        if prediction >= 90:
            grade_letter = "A+"
            message = "Excellent! Outstanding performance!"
        elif prediction >= 80:
            grade_letter = "A"
            message = "Great job! Keep it up!"
        elif prediction >= 70:
            grade_letter = "B"
            message = "Good performance!"
        elif prediction >= 60:
            grade_letter = "C"
            message = "Average. Try to study more!"
        elif prediction >= 50:
            grade_letter = "D"
            message = "Below average. Need improvement!"
        else:
            grade_letter = "F"
            message = "Failing. Please seek help!"

        return jsonify({
            "predicted_grade": prediction,
            "grade_letter": grade_letter,
            "message": message,
            "inputs": {
                "study_hours": study_hours,
                "attendance": attendance,
                "assignments": assignments,
                "prev_grade": prev_grade
            }
        })

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "✅ UniGrade API is running!"})

if __name__ == "__main__":
    print("🚀 UniGrade server running on http://localhost:5000")
    app.run(debug=True, port=5000, host="0.0.0.0")