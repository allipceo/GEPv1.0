from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

# 데이터 파일 경로
QUESTIONS_FILE = 'static/data/questions.json'
USER_DB_FILE = 'static/data/user_db.json'
EVENT_LOG_FILE = 'static/data/event_log.json'
STATISTICS_FILE = 'static/data/statistics.json'
GENERATED_QUESTIONS_FILE = 'static/data/gep_generated_questions.json'

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

# QGENERATOR 라우트 추가
@app.route('/qgenerator')
def qgenerator():
    """QGENERATOR 페이지"""
    return send_from_directory('qgenerator', 'index.html')

@app.route('/qgenerator/<path:filename>')
def qgenerator_static(filename):
    """QGENERATOR 정적 파일 서빙"""
    return send_from_directory('qgenerator', filename)

@app.route('/qgenerator/js/<path:filename>')
def qgenerator_js(filename):
    """QGENERATOR JavaScript 파일 서빙"""
    return send_from_directory('qgenerator/js', filename)

@app.route('/static/data/<path:filename>')
def static_data(filename):
    """정적 데이터 파일 서빙"""
    return send_from_directory('static/data', filename)



# QGENERATOR API 엔드포인트
@app.route('/api/save-questions', methods=['POST'])
def save_questions():
    """진위형 문제 저장 API"""
    try:
        data = request.json
        
        # 기존 데이터 로드
        existing_data = load_json_data(GENERATED_QUESTIONS_FILE)
        if not existing_data:
            # 파일이 없으면 기본 구조 생성
            existing_data = {
                "metadata": {
                    "version": "GEP Generated Questions V1.0",
                    "created_date": datetime.now().strftime("%Y-%m-%d"),
                    "description": "기출문제 기반으로 생성된 진위형 문제 데이터베이스",
                    "total_questions": 0,
                    "last_update": datetime.now().isoformat(),
                    "qcode_prefix": "B",
                    "parent_reference": True
                },
                "questions": []
            }
        
        # 새로운 데이터로 업데이트
        existing_data.update(data)
        
        # 파일에 저장
        if save_json_data(GENERATED_QUESTIONS_FILE, existing_data):
            return jsonify({
                "success": True,
                "message": f"{len(data.get('questions', []))}개 진위형 문제가 성공적으로 저장되었습니다.",
                "total_questions": data.get('metadata', {}).get('total_questions', 0)
            })
        else:
            return jsonify({
                "success": False,
                "error": "파일 저장 실패"
            }), 500
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/get-questions')
def get_generated_questions():
    """저장된 진위형 문제 조회 API"""
    try:
        data = load_json_data(GENERATED_QUESTIONS_FILE)
        if not data:
            return jsonify({
                "metadata": {
                    "version": "GEP Generated Questions V1.0",
                    "created_date": datetime.now().strftime("%Y-%m-%d"),
                    "description": "기출문제 기반으로 생성된 진위형 문제 데이터베이스",
                    "total_questions": 0,
                    "last_update": datetime.now().isoformat(),
                    "qcode_prefix": "B",
                    "parent_reference": True
                },
                "questions": []
            })
        return jsonify(data)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

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
    print("🚀 GEP 서버 시작...")
    print("📍 접속 URL: http://localhost:5000")
    print("📁 주요 페이지:")
    print("   - / : 메인 페이지")
    print("   - /learning : 학습 페이지")
    print("   - /statistics : 통계 페이지")
    print("   - /qgenerator : QGENERATOR (진위형 문제 생성)")
    print("📁 API 엔드포인트:")
    print("   - /api/save-questions : 진위형 문제 저장")
    print("   - /api/get-questions : 진위형 문제 조회")
    app.run(debug=True, host='0.0.0.0', port=5000)
