#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QCODE 마이그레이션 스크립트
ABAA-XX → AB20AA-XX 체계로 변경
"""

import json
import pandas as pd
import os
from datetime import datetime
import shutil

def create_backup(file_path):
    """백업 파일 생성"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = file_path.replace('.json', f'_backup_{timestamp}.json')
    if file_path.endswith('.xlsx'):
        backup_path = file_path.replace('.xlsx', f'_backup_{timestamp}.xlsx')
    
    try:
        shutil.copy2(file_path, backup_path)
        print(f"✅ 백업 파일 생성: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"❌ 백업 파일 생성 실패: {e}")
        return None

def generate_new_qcode(old_qcode, eround):
    """새로운 QCODE 생성"""
    # EROUND를 float으로 변환 후 int로 변환
    try:
        round_number = int(float(eround))
    except (ValueError, TypeError):
        print(f"⚠️ EROUND 변환 실패: {eround}")
        return old_qcode
    
    # ABAA-XX → AB20AA-XX 형태로 변경
    if old_qcode.startswith('ABAA'):
        # 관계법령 문제
        new_prefix = f"AB{round_number}AA"
    elif old_qcode.startswith('ABBA'):
        # 손보1부 문제
        new_prefix = f"AB{round_number}BA"
    elif old_qcode.startswith('ABCA'):
        # 손보2부 문제
        new_prefix = f"AB{round_number}CA"
    else:
        print(f"⚠️ 알 수 없는 QCODE 패턴: {old_qcode}")
        return old_qcode
    
    # 기존 번호 유지
    number_part = old_qcode.split('-')[1]
    new_qcode = f"{new_prefix}-{number_part}"
    
    return new_qcode

def migrate_json_file(json_file_path):
    """JSON 파일 QCODE 마이그레이션"""
    print(f"🔄 JSON 파일 마이그레이션 시작: {json_file_path}")
    
    # 백업 생성
    backup_path = create_backup(json_file_path)
    if not backup_path:
        return False
    
    # JSON 파일 로드
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ JSON 파일 로드 실패: {e}")
        return False
    
    # QCODE 변경
    old_to_new_mapping = {}
    for question in data['questions']:
        old_qcode = question['QCODE']
        eround = question['EROUND']
        new_qcode = generate_new_qcode(old_qcode, eround)
        
        if old_qcode != new_qcode:
            old_to_new_mapping[old_qcode] = new_qcode
            question['QCODE'] = new_qcode
            print(f"   변경: {old_qcode} → {new_qcode}")
    
    # 변경된 파일 저장
    try:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ JSON 파일 마이그레이션 완료: {len(old_to_new_mapping)}개 QCODE 변경")
        return old_to_new_mapping
    except Exception as e:
        print(f"❌ JSON 파일 저장 실패: {e}")
        return False

def migrate_qmanager_file(qmanager_file_path, qcode_mapping):
    """Q매니저 파일 QCODE 마이그레이션"""
    print(f"🔄 Q매니저 파일 마이그레이션 시작: {qmanager_file_path}")
    
    # 백업 생성
    backup_path = create_backup(qmanager_file_path)
    if not backup_path:
        return False
    
    # JSON 파일 로드
    try:
        with open(qmanager_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Q매니저 파일 로드 실패: {e}")
        return False
    
    # QCODE 변경
    changed_count = 0
    new_questions = {}
    
    for old_source_qcode, question_data in data['questions'].items():
        if old_source_qcode in qcode_mapping:
            new_source_qcode = qcode_mapping[old_source_qcode]
            question_data['source_qcode'] = new_source_qcode
            new_questions[new_source_qcode] = question_data
            
            # 슬롯 내의 original_qcode도 변경
            for slot_name, slot_data in question_data['slots'].items():
                if 'original_qcode' in slot_data:
                    old_original_qcode = slot_data['original_qcode']
                    if old_original_qcode in qcode_mapping:
                        new_original_qcode = qcode_mapping[old_original_qcode]
                        slot_data['original_qcode'] = new_original_qcode
                        print(f"   슬롯 변경: {old_original_qcode} → {new_original_qcode}")
                        changed_count += 1
        else:
            new_questions[old_source_qcode] = question_data
    
    data['questions'] = new_questions
    
    # 변경된 파일 저장
    try:
        with open(qmanager_file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Q매니저 파일 마이그레이션 완료: {changed_count}개 QCODE 변경")
        return True
    except Exception as e:
        print(f"❌ Q매니저 파일 저장 실패: {e}")
        return False

def migrate_excel_file(excel_file_path, qcode_mapping):
    """엑셀 파일 QCODE 마이그레이션"""
    print(f"🔄 엑셀 파일 마이그레이션 시작: {excel_file_path}")
    
    # 백업 생성
    backup_path = create_backup(excel_file_path)
    if not backup_path:
        return False
    
    # 엑셀 파일 로드
    try:
        df = pd.read_excel(excel_file_path)
    except Exception as e:
        print(f"❌ 엑셀 파일 로드 실패: {e}")
        return False
    
    # QCODE 변경
    changed_count = 0
    for index, row in df.iterrows():
        old_qcode = row['QCODE']
        if old_qcode in qcode_mapping:
            new_qcode = qcode_mapping[old_qcode]
            df.at[index, 'QCODE'] = new_qcode
            print(f"   변경: {old_qcode} → {new_qcode}")
            changed_count += 1
    
    # 변경된 파일 저장
    try:
        df.to_excel(excel_file_path, index=False)
        print(f"✅ 엑셀 파일 마이그레이션 완료: {changed_count}개 QCODE 변경")
        return True
    except Exception as e:
        print(f"❌ 엑셀 파일 저장 실패: {e}")
        return False

def main():
    """메인 실행 함수"""
    print("🚀 QCODE 마이그레이션 작업 시작")
    print("=" * 50)
    
    # 파일 경로 설정
    json_file = "static/data/gep_master_v1.0.json"
    qmanager_file = "static/data/qmanager_questions.json"
    excel_file = r"D:\AI_Project\GEPv1.0\참고자료\GEP_MASTER_V1.0(LAYER2포함).XLSX"
    
    # 파일 존재 확인
    files_to_check = [json_file, qmanager_file, excel_file]
    for file_path in files_to_check:
        if not os.path.exists(file_path):
            print(f"❌ 파일을 찾을 수 없습니다: {file_path}")
            return False
    
    print("✅ 모든 파일 존재 확인 완료")
    
    # 1단계: 전체문제파일 JSON 마이그레이션
    print("\n📋 1단계: 전체문제파일 JSON 마이그레이션")
    qcode_mapping = migrate_json_file(json_file)
    if qcode_mapping is False:
        print("❌ JSON 파일 마이그레이션 실패!")
        return False
    
    # 2단계: 객관식문제 JSON 마이그레이션
    print("\n📋 2단계: 객관식문제 JSON 마이그레이션")
    if not migrate_qmanager_file(qmanager_file, qcode_mapping):
        print("❌ Q매니저 파일 마이그레이션 실패!")
        return False
    
    # 3단계: 엑셀파일 마이그레이션
    print("\n📋 3단계: 엑셀파일 마이그레이션")
    if not migrate_excel_file(excel_file, qcode_mapping):
        print("❌ 엑셀 파일 마이그레이션 실패!")
        return False
    
    print("\n🎉 QCODE 마이그레이션 작업이 성공적으로 완료되었습니다!")
    print(f"📊 총 변경된 QCODE 수: {len(qcode_mapping)}개")
    print("\n📝 변경 사항 요약:")
    print("- ABAA-XX → AB20AA-XX (관계법령)")
    print("- ABBA-XX → AB20BA-XX (손보1부)")
    print("- ABCA-XX → AB20CA-XX (손보2부)")
    print("- 회차별로 명확한 구분 가능")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n💥 QCODE 마이그레이션 작업이 실패했습니다!")
        exit(1)
