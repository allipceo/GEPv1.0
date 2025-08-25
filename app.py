from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

# 데이터 파일 경로
QUESTIONS_FILE = 'static/data/questions.json'
USER_DB_FILE = 'static/data/user_db.json'
EVENT_LOG_FILE = 'static/data/event_log.json'
STATISTICS_FILE = 'static/data/statistics.json'

def load_json_data(filename):
    """JSON 파일 로드"""
    try:
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return {}

def save_json_data(filename, data):
    """JSON 파일 저장"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filename}: {e}")
        return False

@app.route('/')
def index():
    """메인 페이지"""
    return render_template('pages/index.html')

@app.route('/register')
def register():
    """사용자 등록 페이지"""
    return render_template('pages/register.html')

@app.route('/learning')
def learning():
    """학습 페이지"""
    return render_template('pages/learning.html')

@app.route('/statistics')
def statistics():
    """통계 페이지"""
    return render_template('pages/statistics.html')

@app.route('/api/questions')
def get_questions():
    """문제 데이터 API"""
    questions = load_json_data(QUESTIONS_FILE)
    return jsonify(questions)

@app.route('/api/user/<phone_number>')
def get_user(phone_number):
    """사용자 정보 조회"""
    user_db = load_json_data(USER_DB_FILE)
    user = user_db.get(phone_number, {})
    return jsonify(user)

@app.route('/api/user/register', methods=['POST'])
def register_user():
    """사용자 등록"""
    data = request.get_json()
    phone_number = data.get('phone_number')
    
    if not phone_number:
        return jsonify({'error': '전화번호가 필요합니다'}), 400
    
    user_db = load_json_data(USER_DB_FILE)
    
    # 새 사용자 생성
    user_db[phone_number] = {
        'phone_number': phone_number,
        'registration_date': datetime.now().isoformat(),
        'subscription_level': 'free',  # 기본값: 무료
        'last_login': datetime.now().isoformat()
    }
    
    if save_json_data(USER_DB_FILE, user_db):
        return jsonify({'success': True, 'user': user_db[phone_number]})
    else:
        return jsonify({'error': '사용자 등록 실패'}), 500

@app.route('/api/statistics/<phone_number>')
def get_user_statistics(phone_number):
    """사용자 통계 조회"""
    statistics = load_json_data(STATISTICS_FILE)
    user_stats = statistics.get(phone_number, {})
    return jsonify(user_stats)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
