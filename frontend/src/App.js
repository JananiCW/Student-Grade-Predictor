import { useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [form, setForm] = useState({
    study_hours: "",
    attendance: "",
    assignments: "",
    prev_grade: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predict = async () => {
    if (!form.study_hours || !form.attendance || !form.assignments || !form.prev_grade) {
      setError("Please fill in all fields!");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_hours: parseFloat(form.study_hours),
          attendance: parseFloat(form.attendance),
          assignments: parseFloat(form.assignments),
          prev_grade: parseFloat(form.prev_grade),
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to connect to server!");
    }
    setLoading(false);
  };

  const reset = () => {
    setForm({ study_hours: "", attendance: "", assignments: "", prev_grade: "" });
    setResult(null);
    setError("");
  };

  const getGradeColor = (letter) => {
    if (letter === "A+" || letter === "A") return "grade-green";
    if (letter === "B") return "grade-blue";
    if (letter === "C") return "grade-yellow";
    if (letter === "D") return "grade-orange";
    return "grade-red";
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🎓UniGrade</h1>
          <p>Student Grade Predictor</p>
        </div>
      </header>

      <div className="container">
      
        {/* Form */}
        <div className="card">
          <h2>Enter Student Details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Daily Study Hours</label>
              <input
                type="number"
                min="0" max="24" step="0.5"
                placeholder="e.g. 6"
                value={form.study_hours}
                onChange={e => setForm({ ...form, study_hours: e.target.value })}
              />
              <span className="hint">Hours per day (0-24)</span>
            </div>

            <div className="form-group">
              <label>Attendance (%)</label>
              <input
                type="number"
                min="0" max="100"
                placeholder="e.g. 85"
                value={form.attendance}
                onChange={e => setForm({ ...form, attendance: e.target.value })}
              />
              <span className="hint">Percentage (0-100)</span>
            </div>

            <div className="form-group">
              <label>Assignments Score (%)</label>
              <input
                type="number"
                min="0" max="100"
                placeholder="e.g. 78"
                value={form.assignments}
                onChange={e => setForm({ ...form, assignments: e.target.value })}
              />
              <span className="hint">Percentage (0-100)</span>
            </div>

            <div className="form-group">
              <label>Previous Grade (%)</label>
              <input
                type="number"
                min="0" max="100"
                placeholder="e.g. 72"
                value={form.prev_grade}
                onChange={e => setForm({ ...form, prev_grade: e.target.value })}
              />
              <span className="hint">Last semester grade (0-100)</span>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <button className="reset-btn" onClick={reset}>Reset</button>
            <button className="predict-btn" onClick={predict} disabled={loading}>
              {loading ? "Analyzing..." : "Predict Grade"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="result-card">
            <h2>Prediction Result</h2>

            <div className="result-main">
              <div className={`grade-circle ${getGradeColor(result.grade_letter)}`}>
                <span className="grade-letter">{result.grade_letter}</span>
                <span className="grade-score">{result.predicted_grade}%</span>
              </div>
              <p className="result-message">{result.message}</p>
            </div>

            <div className="result-details">
              <h3>Input Summary</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span>Study Hours</span>
                  <strong>{result.inputs.study_hours} hrs/day</strong>
                </div>
                <div className="detail-item">
                  <span>Attendance</span>
                  <strong>{result.inputs.attendance}%</strong>
                </div>
                <div className="detail-item">
                  <span>Assignments</span>
                  <strong>{result.inputs.assignments}%</strong>
                </div>
                <div className="detail-item">
                  <span>Previous Grade</span>
                  <strong>{result.inputs.prev_grade}%</strong>
                </div>
              </div>
            </div>

            <button className="reset-btn" onClick={reset}>Predict Again</button>
          </div>
        )}

        {/* Grade Scale */}
        <div className="card">
          <h2>Grade Scale</h2>
          <div className="grade-scale">
            <div className="scale-item green"><span>A+</span><p>90-100%</p><p>Excellent</p></div>
            <div className="scale-item blue"><span>A</span><p>80-89%</p><p>Great</p></div>
            <div className="scale-item teal"><span>B</span><p>70-79%</p><p>Good</p></div>
            <div className="scale-item yellow"><span>C</span><p>60-69%</p><p>Average</p></div>
            <div className="scale-item orange"><span>D</span><p>50-59%</p><p>Below Avg</p></div>
            <div className="scale-item red"><span>F</span><p>0-49%</p><p>Failing</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;