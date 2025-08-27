from flask import Flask, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

# 정적 파일 서빙
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# 진위형 문제 저장 API
@app.route('/api/save-questions', methods=['POST'])
def save_questions():
    try:
        data = request.json
        
        # gep_generated_questions.json 파일 경로
        file_path = '../static/data/gep_generated_questions.json'
        
        # 기존 데이터 로드
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        else:
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
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            "success": True,
            "message": f"{len(data.get('questions', []))}개 진위형 문제가 성공적으로 저장되었습니다.",
            "total_questions": data.get('metadata', {}).get('total_questions', 0)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# 저장된 문제 조회 API
@app.route('/api/get-questions')
def get_questions():
    try:
        file_path = '../static/data/gep_generated_questions.json'
        
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
        else:
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
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 QGENERATOR 서버 시작...")
    print("📍 접속 URL: http://localhost:5000")
    print("📁 API 엔드포인트:")
    print("   - GET  /api/get-questions : 저장된 문제 조회")
    print("   - POST /api/save-questions : 문제 저장")
    app.run(host='0.0.0.0', port=5000, debug=True)
