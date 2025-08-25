#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GEP V1.0 - GEP MASTER CSV를 JSON으로 변환하는 스크립트

이 스크립트는 조대표님께서 제공해주신 GEP MASTER CSV 파일을 읽어,
사전에 정의된 GEP V1.0의 questions.json 스키마에 맞춰 변환합니다.
QCODE 생성, 문제 유형 식별 등 핵심 로직을 포함합니다.

작성자: 코코치 (PM)
작성일: 2025-08-25
"""

import pandas as pd
import json
import os
from typing import Dict, List, Any
from datetime import datetime

# ==============================================================================
# 1. QCODE 생성 및 매핑 데이터
# ==============================================================================

def generate_qcode(e_title, e_class, layer1, q_type, q_num):
    """
    GEP의 규칙에 따라 고유한 QCODE를 생성합니다.
    형식: [ETITLE코드][ECLASS코드][LAYER1코드][QTYPE코드]-[문제번호]
    예시: ABAA-01
    """
    exam_codes = {'보험중개사': 'A', '보험심사역': 'B', '손해사정사': 'C'}
    class_codes = {'생명보험': 'A', '손해보험': 'B', '제3보험': 'C'}
    layer1_codes = {'관계법령 등': 'A', '손보1부': 'B', '손보2부': 'C'}
    qtype_codes = {'A': 'A', 'B': 'B'}  # 'A': 객관식(선택형), 'B': 진위형

    exam_code = exam_codes.get(e_title, 'X')
    class_code = class_codes.get(e_class, 'X')
    layer1_code = layer1_codes.get(layer1, 'X')
    qtype_code = qtype_codes.get(q_type, 'X')

    # 문제 번호는 2자리 숫자로 포맷팅
    qcode = f"{exam_code}{class_code}{layer1_code}{qtype_code}-{int(q_num):02d}"
    return qcode

# ==============================================================================
# 2. CSV -> JSON 변환 클래스
# ==============================================================================

class GEPDataConverter:
    """GEP MASTER CSV 파일을 JSON 파일로 변환하는 클래스"""

    def __init__(self, csv_file_path: str, json_output_path: str):
        self.csv_file_path = csv_file_path
        self.json_output_path = json_output_path
        self.questions = []

    def convert(self) -> Dict[str, Any]:
        """
        주요 변환 로직
        - CSV 파일에서 데이터를 읽어 JSON 스키마에 맞게 변환합니다.
        - QUESTION 필드는 원본 그대로 보존합니다.
        """
        print(f"🚀 GEP MASTER 파일 변환 시작: {self.csv_file_path}")
        
        try:
            # pandas를 사용하여 CSV 파일 로드
            df = pd.read_csv(self.csv_file_path, keep_default_na=False)
            
            # 각 행을 JSON 객체로 변환
            for index, row in df.iterrows():
                # 빈 행 또는 필수 데이터가 없는 행은 건너뜁니다.
                if not row['QUESTION'] or not row['ANSWER']:
                    continue
                
                # QCODE가 비어있으면 생성
                if not row['QCODE']:
                    qcode = generate_qcode(
                        e_title=row['ETITLE'],
                        e_class=row['ECLASS'],
                        layer1=row['LAYER1'],
                        q_type=row['QTYPE'],
                        q_num=row['QNUM']
                    )
                else:
                    qcode = row['QCODE']

                # is_application 필드 설정 (QTYPE이 'B'이면 응용문제)
                is_application = True if row.get('QTYPE', 'A') == 'B' else False
                
                # 응용문제일 경우 원본 출처를 명시 (예시)
                original_ref = None
                if is_application:
                    original_ref = f"제{row['EROUND']}회 {row['ETITLE']} {row['QNUM']}번 문항"

                question_data = {
                    "problem_id": qcode,
                    "e_title": row['ETITLE'],
                    "e_class": row['ECLASS'],
                    "exam_session": int(row['EROUND']) if row['EROUND'] else None,
                    "layer1": row['LAYER1'],
                    "layer2": row['LAYER2'],
                    "layer3": row['LAYER3'],
                    "question_type": "진위형" if is_application else "단일선택형",
                    "question_text": row['QUESTION'],  # 원본 그대로 보존
                    "correct_answer": row['ANSWER'],
                    "original_question_reference": original_ref,
                    "is_application": is_application,
                    "version_info": "v1.0"
                }
                self.questions.append(question_data)
            
            print(f"✅ {len(self.questions)}개의 문제 변환 완료")

            # 메타데이터 포함 최종 JSON 구조 생성
            json_data = {
                "metadata": {
                    "total_questions": len(self.questions),
                    "creation_date": datetime.now().isoformat(),
                    "source_file": os.path.basename(self.csv_file_path),
                    "version": "GEP V1.0"
                },
                "questions": self.questions
            }
            
            return json_data
            
        except FileNotFoundError:
            print(f"❌ 오류: CSV 파일을 찾을 수 없습니다: {self.csv_file_path}")
            return {}
        except Exception as e:
            print(f"❌ 변환 중 오류 발생: {str(e)}")
            return {}

    def save_json(self, json_data: Dict[str, Any]) -> bool:
        """변환된 JSON 데이터를 파일로 저장합니다."""
        try:
            with open(self.json_output_path, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, ensure_ascii=False, indent=2)
            print(f"✅ JSON 파일 저장 완료: {self.json_output_path}")
            return True
        except Exception as e:
            print(f"❌ JSON 파일 저장 실패: {str(e)}")
            return False

# ==============================================================================
# 3. 메인 실행 함수
# ==============================================================================

if __name__ == "__main__":
    # 파일 경로 설정
    csv_input_file = "GEP_MASTER_V1.0.csv"
    json_output_file = "static/data/gep_questions.json"
    
    # 출력 디렉토리 생성
    os.makedirs("static/data", exist_ok=True)
    
    # 변환기 생성 및 실행
    converter = GEPDataConverter(csv_input_file, json_output_file)
    
    # CSV를 JSON으로 변환
    json_data = converter.convert()
    
    if json_data:
        # JSON 파일로 저장
        success = converter.save_json(json_data)
        
        if success:
            print("🎉 GEP MASTER CSV to JSON 변환 완료!")
            print(f"📊 총 {len(json_data['questions'])}개 문제 변환됨")
            print(f"💾 저장 위치: {json_output_file}")
        else:
            print("❌ JSON 파일 저장 실패")
    else:
        print("❌ 변환 실패")