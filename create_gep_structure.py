#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GEP 표준 데이터 구조 생성 스크립트
우리가 확정한 GEP 필드 구조에 맞는 빈 JSON 파일을 생성합니다.
"""

import json
import os
from datetime import datetime

def create_gep_structure():
    """GEP 표준 데이터 구조의 빈 JSON 파일 생성"""
    
    print("=== GEP 표준 데이터 구조 생성 ===")
    
    # GEP 표준 필드 구조 (문서에서 확정된 구조)
    gep_structure = {
        "metadata": {
            "version": "GEP V1.0",
            "created_date": datetime.now().isoformat(),
            "total_questions": 0,
            "description": "손해보험중개사 시험 대비 문제 데이터베이스",
            "field_structure": {
                "ETITLE": "시험 종류 (예: 손해보험중개사)",
                "ECLASS": "시험 분류 (예: 손해보험)",
                "EROUND": "회차 (예: 20회)",
                "LAYER1": "대분류 (예: 관계법령)",
                "LAYER2": "중분류 (예: 보험계약)",
                "LAYER3": "소분류 (예: 계약성립)",
                "QNUM": "문제 번호",
                "QTYPE": "문제 유형 (예: 진위형, 객관식)",
                "QUESTION": "문제 내용 (절대 노터치)",
                "ANSWER": "정답",
                "DIFFICULTY": "난이도",
                "CREATED_DATE": "생성일",
                "MODIFIED_DATE": "수정일"
            }
        },
        "questions": {}
    }
    
    # 디렉토리 생성
    os.makedirs('static/data', exist_ok=True)
    
    # 파일 저장
    output_file = 'static/data/gep_master_v1.0.json'
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gep_structure, f, ensure_ascii=False, indent=2)
        
        print(f"✅ GEP 표준 구조 파일 생성 완료")
        print(f"📁 파일 위치: {output_file}")
        print(f"📊 메타데이터 포함")
        print(f"🔧 필드 구조 정의 완료")
        
        # 파일 크기 확인
        file_size = os.path.getsize(output_file)
        print(f"📏 파일 크기: {file_size} bytes")
        
        return {
            "success": True,
            "file_path": output_file,
            "file_size": file_size,
            "structure": gep_structure
        }
        
    except Exception as e:
        print(f"❌ 파일 생성 실패: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def show_structure_info():
    """생성된 구조 정보 출력"""
    print("\n=== GEP 표준 필드 구조 ===")
    print("📋 필드명 (대문자 표준)")
    print("  ETITLE     - 시험 종류")
    print("  ECLASS     - 시험 분류") 
    print("  EROUND     - 회차")
    print("  LAYER1     - 대분류")
    print("  LAYER2     - 중분류")
    print("  LAYER3     - 소분류")
    print("  QNUM       - 문제 번호")
    print("  QTYPE      - 문제 유형")
    print("  QUESTION   - 문제 내용 (절대 노터치)")
    print("  ANSWER     - 정답")
    print("  DIFFICULTY - 난이도")
    print("  CREATED_DATE   - 생성일")
    print("  MODIFIED_DATE  - 수정일")
    
    print("\n⚠️  중요 사항")
    print("  - 모든 필드명은 대문자로 표준화")
    print("  - QUESTION 필드는 절대 변환/수정 금지")
    print("  - 기존 Excel 파일의 필드명과 정확히 일치")

if __name__ == "__main__":
    result = create_gep_structure()
    
    if result["success"]:
        show_structure_info()
        print(f"\n🎉 GEP 표준 구조 파일이 성공적으로 생성되었습니다!")
        print(f"이제 이 구조를 기준으로 Excel 데이터를 변환할 수 있습니다.")
    else:
        print(f"❌ 구조 생성 실패: {result['error']}")
