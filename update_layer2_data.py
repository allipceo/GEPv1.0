#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LAYER2 필드 업데이트 스크립트
엑셀 파일의 LAYER2 데이터를 JSON 파일에 안전하게 업데이트
"""

import json
import pandas as pd
import os
from datetime import datetime
import sys

def load_json_data(file_path):
    """JSON 파일 로드"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ JSON 파일 로드 실패: {e}")
        return None

def save_json_data(file_path, data):
    """JSON 파일 저장"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"❌ JSON 파일 저장 실패: {e}")
        return False

def load_excel_data(file_path):
    """엑셀 파일 로드"""
    try:
        df = pd.read_excel(file_path)
        return df
    except Exception as e:
        print(f"❌ 엑셀 파일 로드 실패: {e}")
        return None

def validate_data_integrity(json_data, excel_df):
    """데이터 무결성 검증"""
    print("🔍 데이터 무결성 검증 시작...")
    
    # 1단계: 레코드 수 비교
    json_count = len(json_data['questions'])
    excel_count = len(excel_df)
    
    print(f"📊 레코드 수 비교:")
    print(f"   JSON 파일: {json_count}개")
    print(f"   엑셀 파일: {excel_count}개")
    
    if json_count != excel_count:
        print(f"❌ 레코드 수 불일치! JSON: {json_count}, 엑셀: {excel_count}")
        return False
    
    print("✅ 레코드 수 일치")
    
    # 2단계: QCODE 정렬
    json_questions = sorted(json_data['questions'], key=lambda x: x['QCODE'])
    excel_df_sorted = excel_df.sort_values('QCODE').reset_index(drop=True)
    
    print("✅ QCODE 정렬 완료")
    
    # 3단계: 완전 동일성 검증 (LAYER2 제외)
    print("🔍 핵심 필드 동일성 검증 중...")
    
    mismatch_count = 0
    for i, (json_q, excel_row) in enumerate(zip(json_questions, excel_df_sorted.itertuples())):
        # 핵심 필드 비교 (LAYER2 제외)
        if (json_q['QCODE'] != excel_row.QCODE or
            json_q['QUESTION'] != excel_row.QUESTION or
            json_q['ANSWER'] != excel_row.ANSWER or
            json_q['LAYER1'] != excel_row.LAYER1):
            
            mismatch_count += 1
            if mismatch_count <= 5:  # 처음 5개만 출력
                print(f"❌ 불일치 발견 (레코드 {i+1}):")
                print(f"   QCODE: JSON={json_q['QCODE']}, Excel={excel_row.QCODE}")
                print(f"   QUESTION: JSON={json_q['QUESTION'][:50]}..., Excel={excel_row.QUESTION[:50]}...")
    
    if mismatch_count > 0:
        print(f"❌ 총 {mismatch_count}개의 불일치 발견!")
        return False
    
    print("✅ 모든 핵심 필드 일치")
    return True

def update_layer2_data(json_data, excel_df):
    """LAYER2 데이터 업데이트"""
    print("🔄 LAYER2 데이터 업데이트 시작...")
    
    # QCODE 기준으로 정렬
    json_questions = sorted(json_data['questions'], key=lambda x: x['QCODE'])
    excel_df_sorted = excel_df.sort_values('QCODE').reset_index(drop=True)
    
    updated_count = 0
    for i, (json_q, excel_row) in enumerate(zip(json_questions, excel_df_sorted.itertuples())):
        old_layer2 = json_q['LAYER2']
        new_layer2 = excel_row.LAYER2
        
        if old_layer2 != new_layer2:
            json_q['LAYER2'] = new_layer2
            updated_count += 1
            
            if updated_count <= 5:  # 처음 5개만 출력
                print(f"   업데이트: {json_q['QCODE']} - '{old_layer2}' → '{new_layer2}'")
    
    print(f"✅ 총 {updated_count}개의 LAYER2 필드 업데이트 완료")
    return json_data

def create_backup(file_path):
    """백업 파일 생성"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = file_path.replace('.json', f'_backup_{timestamp}.json')
    
    try:
        import shutil
        shutil.copy2(file_path, backup_path)
        print(f"✅ 백업 파일 생성: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"❌ 백업 파일 생성 실패: {e}")
        return None

def main():
    """메인 실행 함수"""
    print("🚀 LAYER2 필드 업데이트 작업 시작")
    print("=" * 50)
    
    # 파일 경로 설정 (조대표님이 제공한 정확한 경로)
    json_file = "static/data/gep_master_v1.0.json"
    excel_file = r"D:\AI_Project\GEPv1.0\참고자료\GEP_MASTER_V1.0(LAYER2포함).XLSX"
    
    # 파일 존재 확인
    if not os.path.exists(json_file):
        print(f"❌ JSON 파일을 찾을 수 없습니다: {json_file}")
        return False
    
    if not os.path.exists(excel_file):
        print(f"❌ 엑셀 파일을 찾을 수 없습니다: {excel_file}")
        return False
    
    # 1. 백업 생성
    print("📦 백업 파일 생성 중...")
    backup_path = create_backup(json_file)
    if not backup_path:
        return False
    
    # 2. 데이터 로드
    print("📂 데이터 파일 로드 중...")
    json_data = load_json_data(json_file)
    excel_df = load_excel_data(excel_file)
    
    if json_data is None or excel_df is None:
        return False
    
    # 3. 데이터 무결성 검증
    if not validate_data_integrity(json_data, excel_df):
        print("❌ 데이터 무결성 검증 실패!")
        return False
    
    # 4. LAYER2 업데이트
    updated_json_data = update_layer2_data(json_data, excel_df)
    
    # 5. 업데이트된 파일 저장
    print("💾 업데이트된 파일 저장 중...")
    if save_json_data(json_file, updated_json_data):
        print("✅ LAYER2 업데이트 완료!")
        print(f"📁 업데이트된 파일: {json_file}")
        print(f"📁 백업 파일: {backup_path}")
        return True
    else:
        print("❌ 파일 저장 실패!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 LAYER2 필드 업데이트 작업이 성공적으로 완료되었습니다!")
    else:
        print("\n💥 LAYER2 필드 업데이트 작업이 실패했습니다!")
        sys.exit(1)
