#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GEP 표준 데이터 구조 생성 스크립트
우리가 확정한 GEP 필드 구조에 맞는 빈 JSON 파일을 생성합니다.
"""

import json
import os

def create_gep_master_structure():
    """
    GEP V1.0의 정확한 필드 구조를 가진 빈 JSON 파일을 생성합니다.
    """
    
    # GEP V1.0의 정확한 필드 구조 (대문자)
    gep_structure = {
        "metadata": {
            "version": "GEP V1.0",
            "created_date": "2025-01-17",
            "total_questions": 0,
            "description": "GEP Master Database Structure - Empty Template"
        },
        "questions": []
    }
    
    # static/data 폴더가 없으면 생성
    os.makedirs("static/data", exist_ok=True)
    
    # JSON 파일 생성
    file_path = "static/data/gep_master_v1.0.json"
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(gep_structure, f, ensure_ascii=False, indent=2)
        
        print(f"✅ GEP Master 구조 파일이 성공적으로 생성되었습니다: {file_path}")
        print(f"📁 파일 크기: {os.path.getsize(file_path)} bytes")
        
        # 생성된 파일의 구조 확인
        print("\n📋 생성된 JSON 구조:")
        print(json.dumps(gep_structure, ensure_ascii=False, indent=2))
        
        return True
        
    except Exception as e:
        print(f"❌ 파일 생성 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    print("🚀 GEP V1.0 Master 구조 파일 생성 시작...")
    success = create_gep_master_structure()
    
    if success:
        print("\n🎉 GEP Master 구조 파일 생성 완료!")
        print("📝 다음 단계: CSV 데이터를 이 구조에 맞게 변환")
    else:
        print("\n💥 파일 생성 실패")
