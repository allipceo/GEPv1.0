#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QManager 데이터 마이그레이션 스크립트
기존 gep_generated_questions.json을 QManager 8개 고정 슬롯 구조로 변환
"""

import json
import os
from datetime import datetime
from collections import defaultdict

# 파일 경로
GENERATED_QUESTIONS_FILE = 'static/data/gep_generated_questions.json'
QMANAGER_QUESTIONS_FILE = 'static/data/qmanager_questions.json'
MASTER_QUESTIONS_FILE = 'static/data/gep_master_v1.0.json'

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

def create_empty_slots():
    """8개 빈 슬롯 생성"""
    slots = {}
    for i in range(1, 9):
        slot_name = f"B{i}"
        slots[slot_name] = {
            "question": "",
            "answer": "",
            "exists": False,
            "created_date": None,
            "modified_date": None
        }
    return slots

def migrate_generated_questions():
    """기존 진위형 문제를 QManager 구조로 마이그레이션"""
    print("🔄 QManager 데이터 마이그레이션 시작...")
    
    # 기존 데이터 로드
    generated_data = load_json_data(GENERATED_QUESTIONS_FILE)
    master_data = load_json_data(MASTER_QUESTIONS_FILE)
    
    if not generated_data or 'questions' not in generated_data:
        print("❌ 기존 진위형 문제 데이터가 없습니다.")
        return False
    
    # 기존 문제들을 기출문제별로 그룹화
    questions_by_source = defaultdict(list)
    
    for question in generated_data['questions']:
        source_qcode = question.get('SOURCE_QCODE')
        if source_qcode:
            questions_by_source[source_qcode].append(question)
    
    print(f"📊 총 {len(generated_data['questions'])}개 진위형 문제 발견")
    print(f"📊 {len(questions_by_source)}개 기출문제에 진위형 문제 존재")
    
    # QManager 구조로 변환
    qmanager_data = {
        "metadata": {
            "version": "QManager Questions V1.0",
            "created_date": datetime.now().strftime("%Y-%m-%d"),
            "description": "QManager로 관리되는 진위형 문제 데이터베이스",
            "total_questions": 0,
            "last_update": datetime.now().isoformat(),
            "migrated_from": "gep_generated_questions.json",
            "migration_date": datetime.now().isoformat()
        },
        "questions": {}
    }
    
    total_migrated = 0
    
    # 각 기출문제별로 8개 슬롯 구조 생성
    for source_qcode, questions in questions_by_source.items():
        # 8개 빈 슬롯 생성
        slots = create_empty_slots()
        
        # 기존 진위형 문제들을 슬롯에 배치
        for i, question in enumerate(questions[:8], 1):  # 최대 8개까지만
            slot_name = f"B{i}"
            
            # 기존 데이터를 새 구조로 변환
            slots[slot_name] = {
                "question": question.get('QUESTION', ''),
                "answer": question.get('ANSWER', ''),
                "exists": True,
                "created_date": question.get('CREATED_DATE', datetime.now().isoformat()),
                "modified_date": question.get('MODIFIED_DATE', datetime.now().isoformat()),
                "original_qcode": question.get('QCODE', ''),
                "parent_info": question.get('PARENT_INFO', '')
            }
            total_migrated += 1
        
        # 기출문제 정보 추가
        master_question = None
        if master_data and 'questions' in master_data:
            master_question = next((q for q in master_data['questions'] if q.get('QCODE') == source_qcode), None)
        
        qmanager_data["questions"][source_qcode] = {
            "source_qcode": source_qcode,
            "slots": slots,
            "metadata": {
                "total_slots": 8,
                "filled_slots": len(questions[:8]),
                "last_updated": datetime.now().isoformat(),
                "master_question": master_question.get('QUESTION', '') if master_question else '',
                "master_answer": master_question.get('ANSWER', '') if master_question else '',
                "master_round": master_question.get('EROUND', '') if master_question else '',
                "master_layer": master_question.get('LAYER1', '') if master_question else ''
            }
        }
    
    # 전체 문제 수 업데이트
    qmanager_data["metadata"]["total_questions"] = total_migrated
    
    # 파일 저장
    if save_json_data(QMANAGER_QUESTIONS_FILE, qmanager_data):
        print(f"✅ 마이그레이션 완료!")
        print(f"📊 총 {total_migrated}개 진위형 문제 마이그레이션")
        print(f"📁 저장 위치: {QMANAGER_QUESTIONS_FILE}")
        return True
    else:
        print("❌ 마이그레이션 실패")
        return False

def validate_migration():
    """마이그레이션 결과 검증"""
    print("🔍 마이그레이션 결과 검증...")
    
    qmanager_data = load_json_data(QMANAGER_QUESTIONS_FILE)
    if not qmanager_data:
        print("❌ QManager 데이터 파일이 없습니다.")
        return False
    
    total_questions = 0
    total_slots = 0
    filled_slots = 0
    
    for source_qcode, question_data in qmanager_data.get("questions", {}).items():
        slots = question_data.get("slots", {})
        total_slots += 8
        
        for slot_name, slot_data in slots.items():
            if slot_data.get("exists", False):
                filled_slots += 1
                total_questions += 1
    
    print(f"📊 검증 결과:")
    print(f"   - 총 기출문제: {len(qmanager_data.get('questions', {}))}개")
    print(f"   - 총 슬롯: {total_slots}개")
    print(f"   - 채워진 슬롯: {filled_slots}개")
    print(f"   - 총 진위형 문제: {total_questions}개")
    
    return True

def create_sample_data():
    """샘플 데이터 생성 (테스트용)"""
    print("🧪 샘플 데이터 생성...")
    
    sample_data = {
        "metadata": {
            "version": "QManager Questions V1.0",
            "created_date": datetime.now().strftime("%Y-%m-%d"),
            "description": "QManager 샘플 데이터",
            "total_questions": 0,
            "last_update": datetime.now().isoformat()
        },
        "questions": {}
    }
    
    # 샘플 기출문제들
    sample_sources = ["ABAA-01", "ABAA-02", "ABAA-03"]
    
    for source_qcode in sample_sources:
        slots = create_empty_slots()
        
        # 일부 슬롯에 샘플 데이터 추가
        if source_qcode == "ABAA-01":
            slots["B1"] = {
                "question": "보험업법 제1조에 따라 보험업을 영위하려면 금융위원회의 허가를 받아야 한다.",
                "answer": "O",
                "exists": True,
                "created_date": datetime.now().isoformat(),
                "modified_date": datetime.now().isoformat()
            }
            slots["B2"] = {
                "question": "보험계약은 계약자와 보험자 간의 합의로만 성립한다.",
                "answer": "X",
                "exists": True,
                "created_date": datetime.now().isoformat(),
                "modified_date": datetime.now().isoformat()
            }
        
        sample_data["questions"][source_qcode] = {
            "source_qcode": source_qcode,
            "slots": slots,
            "metadata": {
                "total_slots": 8,
                "filled_slots": 2 if source_qcode == "ABAA-01" else 0,
                "last_updated": datetime.now().isoformat()
            }
        }
    
    sample_data["metadata"]["total_questions"] = 2
    
    if save_json_data(QMANAGER_QUESTIONS_FILE, sample_data):
        print("✅ 샘플 데이터 생성 완료")
        return True
    else:
        print("❌ 샘플 데이터 생성 실패")
        return False

if __name__ == '__main__':
    print("🚀 QManager 데이터 마이그레이션 도구")
    print("=" * 50)
    
    # 기존 데이터가 있으면 마이그레이션, 없으면 샘플 데이터 생성
    if os.path.exists(GENERATED_QUESTIONS_FILE):
        print("📁 기존 진위형 문제 데이터 발견")
        if migrate_generated_questions():
            validate_migration()
    else:
        print("📁 기존 데이터 없음 - 샘플 데이터 생성")
        create_sample_data()
    
    print("=" * 50)
    print("✅ 마이그레이션 완료!")

