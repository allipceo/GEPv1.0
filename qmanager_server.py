#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QManager 독립 서버
포트 5001에서 실행되는 QManager 전용 서버
"""

from flask import Flask, send_from_directory, jsonify, request
import json
import os
from datetime import datetime

app = Flask(__name__)

# 데이터 파일 경로
MASTER_QUESTIONS_FILE = 'static/data/gep_master_v1.0.json'
GENERATED_QUESTIONS_FILE = 'static/data/gep_generated_questions.json'
QMANAGER_QUESTIONS_FILE = 'static/data/qmanager_questions.json'

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
def qmanager_home():
    """QManager 메인 페이지"""
    return send_from_directory('static/qmanager', 'index.html')

@app.route('/qmanager/<path:filename>')
def qmanager_static(filename):
    """QManager 정적 파일 서빙"""
    return send_from_directory('static/qmanager', filename)

@app.route('/qmanager/css/<path:filename>')
def qmanager_css(filename):
    """QManager CSS 파일 서빙"""
    return send_from_directory('static/qmanager/css', filename)

@app.route('/qmanager/js/<path:filename>')
def qmanager_js(filename):
    """QManager JavaScript 파일 서빙"""
    return send_from_directory('static/qmanager/js', filename)

@app.route('/api/qmanager/master-questions')
def get_master_questions():
    """기출문제 데이터 API"""
    try:
        data = load_json_data(MASTER_QUESTIONS_FILE)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/qmanager/generated-questions')
def get_generated_questions():
    """기존 진위형 문제 데이터 API"""
    try:
        data = load_json_data(GENERATED_QUESTIONS_FILE)
        if not data:
            return jsonify({
                "metadata": {
                    "version": "QManager Questions V1.0",
                    "created_date": datetime.now().strftime("%Y-%m-%d"),
                    "description": "QManager로 관리되는 진위형 문제 데이터베이스",
                    "total_questions": 0,
                    "last_update": datetime.now().isoformat()
                },
                "questions": []
            })
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/qmanager/save-questions', methods=['POST'])
def save_qmanager_questions():
    """QManager 진위형 문제 저장 API"""
    try:
        data = request.json
        
        # 기존 데이터 로드
        existing_data = load_json_data(QMANAGER_QUESTIONS_FILE)
        if not existing_data:
            # 파일이 없으면 기본 구조 생성
            existing_data = {
                "metadata": {
                    "version": "QManager Questions V1.0",
                    "created_date": datetime.now().strftime("%Y-%m-%d"),
                    "description": "QManager로 관리되는 진위형 문제 데이터베이스",
                    "total_questions": 0,
                    "last_update": datetime.now().isoformat()
                },
                "questions": []
            }
        
        # 새로운 데이터로 업데이트
        existing_data.update(data)
        
        # 파일에 저장
        if save_json_data(QMANAGER_QUESTIONS_FILE, existing_data):
            return jsonify({
                "success": True,
                "message": f"QManager 진위형 문제가 성공적으로 저장되었습니다.",
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

@app.route('/api/qmanager/qmanager-questions')
def get_qmanager_questions():
    """QManager 진위형 문제 조회 API"""
    try:
        data = load_json_data(QMANAGER_QUESTIONS_FILE)
        if not data:
            return jsonify({
                "metadata": {
                    "version": "QManager Questions V1.0",
                    "created_date": datetime.now().strftime("%Y-%m-%d"),
                    "description": "QManager로 관리되는 진위형 문제 데이터베이스",
                    "total_questions": 0,
                    "last_update": datetime.now().isoformat()
                },
                "questions": []
            })
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/qmanager/upload-questions', methods=['POST'])
def upload_qmanager_questions():
    """QManager 진위형 문제 업로드 API - 자동 JSON 파일 업데이트"""
    try:
        # 현재 QManager 데이터 로드
        qmanager_data = load_json_data(QMANAGER_QUESTIONS_FILE)
        
        if not qmanager_data:
            return jsonify({
                "success": False,
                "error": "업로드할 QManager 데이터가 없습니다."
            }), 400
        
        # 현재 날짜로 파일명 생성
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = f"qmanager_questions_{timestamp}.json"
        
        # 파일 저장
        if save_json_data(filename, qmanager_data):
            return jsonify({
                "success": True,
                "message": f"QManager 데이터가 성공적으로 업로드되었습니다.",
                "filename": filename,
                "total_questions": qmanager_data.get('metadata', {}).get('total_questions', 0),
                "upload_time": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "success": False,
                "error": "파일 업로드 실패"
            }), 500
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 QManager 독립 서버 시작...")
    print("📍 접속 URL: http://localhost:5001")
    print("📁 주요 페이지:")
    print("   - / : QManager 메인 페이지")
    print("📁 API 엔드포인트:")
    print("   - /api/qmanager/master-questions : 기출문제 데이터")
    print("   - /api/qmanager/generated-questions : 기존 진위형 문제")
    print("   - /api/qmanager/save-questions : QManager 진위형 문제 저장")
    print("   - /api/qmanager/qmanager-questions : QManager 진위형 문제 조회")
    print("   - /api/qmanager/upload-questions : QManager 진위형 문제 업로드")
    app.run(debug=True, host='0.0.0.0', port=5001)
