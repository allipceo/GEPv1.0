#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QGENERATOR 테스트 스크립트
서대리가 직접 진위형 문제를 생성하여 테스트하는 스크립트
"""

import json
import os
from datetime import datetime

def load_master_data():
    """마스터 데이터 로드"""
    try:
        with open('static/data/gep_master_v1.0.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data['questions']
    except Exception as e:
        print(f"마스터 데이터 로드 실패: {e}")
        return []

def load_generated_questions():
    """생성된 문제 데이터 로드"""
    try:
        if os.path.exists('static/data/gep_generated_questions.json'):
            with open('static/data/gep_generated_questions.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        else:
            return {
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
    except Exception as e:
        print(f"생성된 문제 데이터 로드 실패: {e}")
        return None

def save_generated_questions(data):
    """생성된 문제 데이터 저장"""
    try:
        with open('static/data/gep_generated_questions.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"생성된 문제 데이터 저장 실패: {e}")
        return False

def generate_test_questions():
    """테스트용 진위형 문제 생성"""
    
    # 마스터 데이터 로드
    master_questions = load_master_data()
    if not master_questions:
        print("❌ 마스터 데이터 로드 실패")
        return False
    
    # 기존 생성된 문제 데이터 로드
    generated_data = load_generated_questions()
    if not generated_data:
        print("❌ 생성된 문제 데이터 로드 실패")
        return False
    
    # 테스트용 원본 문제 선택 (20회, 21회, 22회에서 각각 1개씩)
    test_originals = [
        master_questions[0],   # 20회 관계법령 1번
        master_questions[160], # 21회 관계법령 1번 (대략)
        master_questions[320]  # 22회 관계법령 1번 (대략)
    ]
    
    print("🔍 테스트용 원본 문제 선택:")
    for i, original in enumerate(test_originals):
        print(f"  {i+1}. {original['QCODE']} | {original['EROUND']}회 {original['LAYER1']} {original['QNUM']}번")
        print(f"     문제: {original['QUESTION'][:100]}...")
        print(f"     정답: {original['ANSWER']}")
        print()
    
    # 진위형 문제 생성
    new_questions = []
    
    for i, original in enumerate(test_originals):
        print(f"📝 {original['QCODE']}에서 진위형 문제 생성 중...")
        
        # 각 원본 문제에서 5-7개의 진위형 문제 생성
        num_questions = 5 + i  # 5, 6, 7개씩
        
        for j in range(num_questions):
            question_num = j + 1
            qcode = f"{original['QCODE']}-B{question_num}"
            
            # 진위형 문제 생성 (실제로는 사용자가 입력하는 내용)
            if j == 0:
                question_text = f"{original['ETITLE']} 시험은 {original['ECLASS']} 분야의 시험이다."
                answer = "O"
            elif j == 1:
                question_text = f"{original['EROUND']}회 시험의 {original['LAYER1']} 과목은 {original['QNUM']}번 문제가 있다."
                answer = "O"
            elif j == 2:
                question_text = f"{original['QCODE']}는 {original['QTYPE']} 타입의 문제이다."
                answer = "O"
            elif j == 3:
                question_text = f"{original['QUESTION'][:50]}... 이 문제의 정답은 {original['ANSWER']}번이 아니다."
                answer = "X"
            else:
                question_text = f"{original['LAYER1']} 과목의 문제는 모두 {original['ECLASS']} 분야에 속한다."
                answer = "O" if j % 2 == 0 else "X"
            
            new_question = {
                "QCODE": qcode,
                "QTYPE": "B",
                "QUESTION": question_text,
                "ANSWER": answer,
                "SOURCE_QCODE": original['QCODE'],
                "PARENT_INFO": f"{original['EROUND']}회 {original['LAYER1']} {original['QNUM']}번",
                "ETITLE": original['ETITLE'],
                "ECLASS": original['ECLASS'],
                "EROUND": original['EROUND'],
                "LAYER1": original['LAYER1'],
                "QNUM": original['QNUM'],
                "CREATED_DATE": datetime.now().isoformat()
            }
            
            new_questions.append(new_question)
            print(f"    생성: {qcode} - {question_text[:50]}... (정답: {answer})")
    
    # 기존 문제에 새 문제 추가
    generated_data['questions'].extend(new_questions)
    
    # 메타데이터 업데이트
    generated_data['metadata']['total_questions'] = len(generated_data['questions'])
    generated_data['metadata']['last_update'] = datetime.now().isoformat()
    generated_data['metadata']['qcode_prefix'] = "B"
    generated_data['metadata']['description'] = "기출문제 기반으로 생성된 진위형 문제 데이터베이스"
    
    # 저장
    if save_generated_questions(generated_data):
        print(f"\n✅ 테스트 완료!")
        print(f"📊 생성된 진위형 문제: {len(new_questions)}개")
        print(f"📊 총 진위형 문제: {generated_data['metadata']['total_questions']}개")
        print(f"💾 저장 위치: static/data/gep_generated_questions.json")
        
        # 생성된 문제 요약
        print(f"\n📋 생성된 문제 요약:")
        for original in test_originals:
            count = len([q for q in new_questions if q['SOURCE_QCODE'] == original['QCODE']])
            print(f"  - {original['QCODE']}: {count}개 진위형 문제 생성")
        
        return True
    else:
        print("❌ 저장 실패")
        return False

def verify_data_structure():
    """데이터 구조 검증"""
    print("🔍 데이터 구조 검증 중...")
    
    # 생성된 문제 데이터 로드
    generated_data = load_generated_questions()
    if not generated_data:
        print("❌ 생성된 문제 데이터 로드 실패")
        return False
    
    # 필수 필드 검증
    required_fields = ['QCODE', 'QTYPE', 'QUESTION', 'ANSWER', 'SOURCE_QCODE', 'PARENT_INFO']
    
    for i, question in enumerate(generated_data['questions']):
        missing_fields = []
        for field in required_fields:
            if field not in question:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"❌ 문제 {i+1}에서 필수 필드 누락: {missing_fields}")
            return False
    
    # 부모-자식 관계 검증
    master_questions = load_master_data()
    master_qcodes = {q['QCODE'] for q in master_questions}
    
    for question in generated_data['questions']:
        if question['SOURCE_QCODE'] not in master_qcodes:
            print(f"❌ 부모 문제 없음: {question['QCODE']} -> {question['SOURCE_QCODE']}")
            return False
    
    print("✅ 데이터 구조 검증 완료")
    return True

def main():
    """메인 함수"""
    print("🚀 QGENERATOR 테스트 시작")
    print("=" * 50)
    
    # 1. 테스트용 진위형 문제 생성
    print("1️⃣ 테스트용 진위형 문제 생성")
    if not generate_test_questions():
        print("❌ 진위형 문제 생성 실패")
        return
    
    print("\n" + "=" * 50)
    
    # 2. 데이터 구조 검증
    print("2️⃣ 데이터 구조 검증")
    if not verify_data_structure():
        print("❌ 데이터 구조 검증 실패")
        return
    
    print("\n" + "=" * 50)
    
    # 3. 최종 결과 출력
    print("3️⃣ 최종 결과")
    generated_data = load_generated_questions()
    print(f"✅ 테스트 성공!")
    print(f"📊 총 진위형 문제: {generated_data['metadata']['total_questions']}개")
    print(f"📅 마지막 업데이트: {generated_data['metadata']['last_update']}")
    print(f"🔗 부모-자식 관계: {generated_data['metadata']['parent_reference']}")
    
    # 샘플 문제 출력
    print(f"\n📝 샘플 문제:")
    for i, question in enumerate(generated_data['questions'][:3]):
        print(f"  {i+1}. {question['QCODE']}")
        print(f"     문제: {question['QUESTION']}")
        print(f"     정답: {question['ANSWER']}")
        print(f"     부모: {question['PARENT_INFO']}")
        print()

if __name__ == "__main__":
    main()
