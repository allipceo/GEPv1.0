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
GEP_MASTER_FILE = 'static/data/gep_master_v1.0.json'  # 3단계용 마스터 데이터

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

# 3단계 과목별 기출문제 풀기 기능 라우트
@app.route('/subject-learning')
def subject_learning():
    """과목별 기출문제 풀기 페이지"""
    return render_template('pages/subject-learning.html')

@app.route('/api/questions')
def get_questions():
    """문제 데이터 API"""
    questions = load_json_data(QUESTIONS_FILE)
    return jsonify(questions)

# 3단계용 API 라우트들
@app.route('/api/gep-master-data')
def get_gep_master_data():
    """GEP 마스터 데이터 API (3단계용)"""
    try:
        master_data = load_json_data(GEP_MASTER_FILE)
        return jsonify(master_data)
    except Exception as e:
        print(f"Error loading GEP master data: {e}")
        return jsonify({'error': '데이터 로드 실패'}), 500

@app.route('/api/subjects')
def get_subjects():
    """과목 목록 API"""
    subjects = [
        "보험업법", "상법", "회계재무", "자동차보험", "특종보험", 
        "보증보험", "연금저축", "화재보험", "해상보험", "항공우주", 
        "재보험"
    ]
    return jsonify({'subjects': subjects})

@app.route('/api/subject/<subject>/questions')
def get_subject_questions(subject):
    """과목별 문제 조회 API"""
    try:
        master_data = load_json_data(GEP_MASTER_FILE)
        questions = master_data.get('questions', [])
        
        # 과목별 필터링 (QUESTION 필드 절대 노터치 원칙 준수)
        filtered_questions = [
            q for q in questions 
            if q.get('LAYER2') == subject and q.get('QTYPE') == 'A'
        ]
        
        return jsonify({
            'subject': subject,
            'questions': filtered_questions,
            'count': len(filtered_questions)
        })
    except Exception as e:
        print(f"Error filtering questions for {subject}: {e}")
        return jsonify({'error': '문제 필터링 실패'}), 500

@app.route('/api/subject/<subject>/stats')
def get_subject_stats(subject):
    """과목별 통계 API"""
    try:
        master_data = load_json_data(GEP_MASTER_FILE)
        questions = master_data.get('questions', [])
        
        # 과목별 문제 필터링
        subject_questions = [
            q for q in questions 
            if q.get('LAYER2') == subject and q.get('QTYPE') == 'A'
        ]
        
        # 통계 계산
        rounds = list(set(q.get('EROUND', '') for q in subject_questions))
        rounds.sort(key=lambda x: float(x) if x else 0)
        
        layer1_breakdown = {}
        for q in subject_questions:
            layer1 = q.get('LAYER1', '')
            layer1_breakdown[layer1] = layer1_breakdown.get(layer1, 0) + 1
        
        stats = {
            'subject': subject,
            'totalQuestions': len(subject_questions),
            'rounds': rounds,
            'layer1Breakdown': layer1_breakdown
        }
        
        return jsonify(stats)
    except Exception as e:
        print(f"Error calculating stats for {subject}: {e}")
        return jsonify({'error': '통계 계산 실패'}), 500

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
