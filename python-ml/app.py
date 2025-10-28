from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from collections import defaultdict

app = Flask(__name__)
CORS(app)

@app.route('/predict/note-format', methods=['POST'])
def predict_note_format():
    data = request.json
    format_scores = defaultdict(list)
    
    # Calculate avg score per format
    for entry in data.get('quizScores', []):
        format_scores[entry['format']].append(entry['score'])
    
    avg_scores = {
        fmt: np.mean(scores) 
        for fmt, scores in format_scores.items()
    }
    
    if not avg_scores:
        return jsonify({'recommendedFormat': 'text', 'confidence': 0.5})
    
    best_format = max(avg_scores, key=avg_scores.get)
    confidence = avg_scores[best_format] / 100
    
    return jsonify({
        'recommendedFormat': best_format,
        'confidence': confidence,
        'scores': avg_scores
    })

@app.route('/predict/attention-zones', methods=['POST'])
def predict_attention_zones():
    data = request.json
    quiz_errors = data.get('quizErrors', [])
    
    # Map errors to note sections
    section_errors = defaultdict(int)
    for error in quiz_errors:
        section = error.get('section', 0)
        section_errors[section] += 1
    
    # Return sections with >2 errors
    weak_sections = [
        section for section, count in section_errors.items()
        if count >= 2
    ]
    
    return jsonify({
        'weakSections': weak_sections,
        'errorCounts': dict(section_errors)
    })

@app.route('/predict/optimal-time', methods=['POST'])
def predict_optimal_time():
    data = request.json
    sessions = data.get('sessionHistory', [])
    
    hour_performance = defaultdict(lambda: {'scores': [], 'completions': 0})
    
    for session in sessions:
        hour = session.get('hour')
        if session.get('completed'):
            hour_performance[hour]['completions'] += 1
            if 'score' in session:
                hour_performance[hour]['scores'].append(session['score'])
    
    # Calculate productivity score
    hour_scores = {}
    for hour, data in hour_performance.items():
        completion_rate = data['completions'] / len([s for s in sessions if s.get('hour') == hour])
        avg_score = np.mean(data['scores']) if data['scores'] else 75
        hour_scores[hour] = (completion_rate * 0.6 + avg_score/100 * 0.4)
    
    # Get top 3 hours
    top_hours = sorted(hour_scores.keys(), key=lambda h: hour_scores[h], reverse=True)[:3]
    
    return jsonify({
        'topHours': top_hours,
        'productivity': [hour_scores[h] for h in top_hours],
        'allScores': hour_scores
    })

@app.route('/predict/quiz-difficulty', methods=['POST'])
def predict_quiz_difficulty():
    data = request.json
    recent_scores = data.get('recentScores', [])[-10:]
    
    if not recent_scores:
        return jsonify({'difficulty': 'medium', 'adjustment': 0})
    
    avg = np.mean(recent_scores)
    
    if avg > 85:
        return jsonify({'difficulty': 'hard', 'adjustment': 1})
    elif avg < 60:
        return jsonify({'difficulty': 'easy', 'adjustment': -1})
    else:
        return jsonify({'difficulty': 'medium', 'adjustment': 0})

@app.route('/predict/flashcard-interval', methods=['POST'])
def predict_flashcard_interval():
    data = request.json
    difficulty = data.get('difficulty', 3)
    success_rate = data.get('successRate', 0.5)
    
    # Base intervals (in milliseconds)
    intervals = {
        1: 3600000,      # 1 hour
        2: 21600000,     # 6 hours
        3: 86400000,     # 1 day
        4: 259200000,    # 3 days
        5: 604800000     # 7 days
    }
    
    base_interval = intervals.get(difficulty, 86400000)
    
    # Adjust based on success rate
    if success_rate > 0.8:
        base_interval *= 1.5
    elif success_rate < 0.5:
        base_interval *= 0.7
    
    return jsonify({
        'nextReviewMs': int(base_interval),
        'difficulty': difficulty
    })

if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)

