from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from collections import defaultdict
import requests
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file for local development (Render uses Environment Variables directly)
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client (server-side only - API key never exposed to browser!)
openai_client = None
if os.environ.get('OPENAI_API_KEY'):
    openai_client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    print("✅ OpenAI client initialized")
else:
    print("⚠️  OPENAI_API_KEY not found in environment variables")

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

@app.route('/ai/analyze-notes', methods=['POST'])
def analyze_notes():
    """Securely proxy OpenAI note analysis requests"""
    if not openai_client:
        return jsonify({'ok': False, 'error': 'OpenAI API key not configured on server'}), 500
    
    try:
        print("[AI] Analyzing notes...")
        data = request.json
        notes = data.get('notes', [])
        subject = data.get('subject', 'General')
        prompt_template = data.get('promptTemplate', '')
        
        if not notes:
            return jsonify({'ok': False, 'error': 'No notes provided'}), 400
        
        # Build content from notes
        content = '\n\n'.join([note.get('content', '') for note in notes])
        
        # Build the prompt
        prompt = prompt_template.replace('{subject}', subject).replace('{content}', content)
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that analyzes notes and creates structured, coherent summaries. Focus on identifying key concepts, connections, and gaps in knowledge."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )
        
        result = response.choices[0].message.content
        print(f"[AI] Analysis complete, {len(result)} characters")
        
        return jsonify({
            'ok': True,
            'result': result
        })
        
    except Exception as e:
        print(f"[AI] Error analyzing notes: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'ok': False, 'error': f'Failed to analyze notes: {str(e)}'}), 500

@app.route('/ai/chat', methods=['POST'])
def ai_chat():
    """Securely proxy OpenAI chat requests"""
    if not openai_client:
        return jsonify({'ok': False, 'error': 'OpenAI API key not configured on server'}), 500
    
    try:
        print("[AI] Processing chat message...")
        data = request.json
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({'ok': False, 'error': 'No messages provided'}), 400
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        print(f"[AI] Chat response: {len(result)} characters")
        
        return jsonify({
            'ok': True,
            'message': result
        })
        
    except Exception as e:
        print(f"[AI] Error in chat: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'ok': False, 'error': f'Chat failed: {str(e)}'}), 500

@app.route('/ai/analyze-image', methods=['POST'])
def analyze_image():
    """Securely proxy OpenAI image analysis requests"""
    if not openai_client:
        return jsonify({'ok': False, 'error': 'OpenAI API key not configured on server'}), 500
    
    try:
        print("[AI] Analyzing image...")
        data = request.json
        image_url = data.get('imageUrl')
        prompt_text = data.get('promptText', 'Please extract and transcribe all text from this image of notes. Format it clearly and maintain the structure. If there are diagrams or equations, describe them or convert them to markdown/LaTeX format.')
        
        if not image_url:
            return jsonify({'ok': False, 'error': 'No image URL provided'}), 400
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }],
            max_tokens=1500
        )
        
        result = response.choices[0].message.content
        print(f"[AI] Image analysis complete: {len(result)} characters")
        
        return jsonify({
            'ok': True,
            'text': result
        })
        
    except Exception as e:
        print(f"[AI] Error analyzing image: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'ok': False, 'error': f'Image analysis failed: {str(e)}'}), 500

@app.route('/ai/generate-outline', methods=['POST'])
def generate_outline():
    """Generate hierarchical outline from notes"""
    if not openai_client:
        return jsonify({'ok': False, 'error': 'OpenAI API key not configured on server'}), 500
    
    try:
        print("[AI] Generating outline...")
        data = request.json
        notes = data.get('notes', [])
        subject = data.get('subject', 'General')
        
        if not notes:
            return jsonify({'ok': False, 'error': 'No notes provided'}), 400
        
        content = '\n\n'.join([note.get('content', '') for note in notes])
        prompt = f"Create a hierarchical outline for the following {subject} notes:\n\n{content}\n\nFormat as a structured markdown outline with main topics and subtopics."
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        result = response.choices[0].message.content
        print(f"[AI] Outline generated: {len(result)} characters")
        
        return jsonify({
            'ok': True,
            'outline': result
        })
        
    except Exception as e:
        print(f"[AI] Error generating outline: {str(e)}")
        return jsonify({'ok': False, 'error': f'Outline generation failed: {str(e)}'}), 500

@app.route('/ai/find-connections', methods=['POST'])
def find_connections():
    """Find connections between concepts in notes"""
    if not openai_client:
        return jsonify({'ok': False, 'error': 'OpenAI API key not configured on server'}), 500
    
    try:
        print("[AI] Finding connections...")
        data = request.json
        notes = data.get('notes', [])
        
        if not notes:
            return jsonify({'ok': False, 'error': 'No notes provided'}), 400
        
        content = '\n\n'.join([note.get('content', '') for note in notes])
        prompt = f"Analyze these notes and identify key connections between concepts:\n\n{content}\n\nReturn a list of connections, one per line, explaining how different concepts relate to each other."
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        result = response.choices[0].message.content
        connections = [line.strip() for line in result.split('\n') if line.strip()]
        print(f"[AI] Found {len(connections)} connections")
        
        return jsonify({
            'ok': True,
            'connections': connections
        })
        
    except Exception as e:
        print(f"[AI] Error finding connections: {str(e)}")
        return jsonify({'ok': False, 'error': f'Connection analysis failed: {str(e)}'}), 500

@app.route('/ai/generate-flashcards', methods=['POST'])
def generate_flashcards():
    """Generate flashcards from note content"""
    if not openai_client:
        return jsonify({'ok': False, 'error': 'OpenAI API key not configured on server'}), 500
    
    try:
        print("[AI] Generating flashcards...")
        data = request.json
        content = data.get('content', '')
        
        if not content:
            return jsonify({'ok': False, 'error': 'No content provided'}), 400
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a flashcard generator. Extract 10-15 key concepts from the provided notes and create flashcard pairs.

Format each flashcard EXACTLY as:
Q: [question or term]
A: [answer or definition]
EXAMPLE: [optional example]

---

Ensure each flashcard is clear, concise, and tests one concept."""
                },
                {
                    "role": "user",
                    "content": f"Create flashcards from these notes:\n\n{content}"
                }
            ],
            temperature=0.3
        )
        
        result = response.choices[0].message.content
        print(f"[AI] Flashcards generated: {len(result)} characters")
        
        return jsonify({
            'ok': True,
            'flashcards': result
        })
        
    except Exception as e:
        print(f"[AI] Error generating flashcards: {str(e)}")
        return jsonify({'ok': False, 'error': f'Flashcard generation failed: {str(e)}'}), 500

@app.route('/canvas/proxy', methods=['POST'])
def canvas_proxy():
    """Proxy Canvas API requests to avoid CORS issues"""
    try:
        print("[Canvas Proxy] Received request")
        data = request.json
        canvas_url = data.get('canvasUrl')
        access_token = data.get('accessToken')
        endpoint = data.get('endpoint')
        
        print(f"[Canvas Proxy] Canvas URL: {canvas_url}")
        print(f"[Canvas Proxy] Endpoint: {endpoint}")
        
        if not canvas_url or not access_token or not endpoint:
            print("[Canvas Proxy] ERROR: Missing required parameters")
            return jsonify({'error': 'Missing required parameters', 'ok': False}), 400
        
        # Ensure URL has proper format
        if not canvas_url.startswith('http://') and not canvas_url.startswith('https://'):
            canvas_url = f'https://{canvas_url}'
        canvas_url = canvas_url.rstrip('/')
        
        # Build full URL
        full_url = f'{canvas_url}{endpoint}'
        print(f"[Canvas Proxy] Full URL: {full_url}")
        
        # Make request to Canvas
        headers = {
            'Authorization': f'Bearer {access_token[:10]}...', # Log partial token for debugging
            'Accept': 'application/json'
        }
        
        print(f"[Canvas Proxy] Making request to Canvas...")
        response = requests.get(
            full_url, 
            headers={'Authorization': f'Bearer {access_token}', 'Accept': 'application/json'},
            timeout=30
        )
        
        print(f"[Canvas Proxy] Canvas responded with status: {response.status_code}")
        
        # Return Canvas response
        result = {
            'data': response.json() if response.ok else None,
            'status': response.status_code,
            'ok': response.ok,
            'error': None if response.ok else response.text
        }
        
        if not response.ok:
            print(f"[Canvas Proxy] ERROR: Canvas returned {response.status_code}: {response.text[:200]}")
        else:
            print(f"[Canvas Proxy] SUCCESS: Data received from Canvas")
        
        return jsonify(result), 200
        
    except requests.exceptions.Timeout:
        print("[Canvas Proxy] ERROR: Request timed out")
        return jsonify({'error': 'Request to Canvas timed out', 'ok': False}), 504
    except requests.exceptions.RequestException as e:
        print(f"[Canvas Proxy] ERROR: Network error: {str(e)}")
        return jsonify({'error': f'Network error: {str(e)}', 'ok': False}), 500
    except Exception as e:
        print(f"[Canvas Proxy] ERROR: Server error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}', 'ok': False}), 500

if __name__ == '__main__':
    # For local development
    # Using port 5001 because macOS Control Center uses port 5000
    print("="*60)
    print("🚀 Flask Backend Server Starting...")
    print("   Canvas Proxy: http://localhost:5001/canvas/proxy")
    print("   AI Endpoints:")
    print("     - /ai/analyze-notes")
    print("     - /ai/chat")
    print("     - /ai/analyze-image")
    print("     - /ai/generate-outline")
    print("     - /ai/find-connections")
    print("     - /ai/generate-flashcards")
    print("="*60)
    app.run(debug=True, host='0.0.0.0', port=5001)

