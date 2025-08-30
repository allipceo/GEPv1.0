import json
import pandas as pd
import os
from datetime import datetime

def sync_layer2_from_excel_to_json():
    """엑셀파일의 LAYER2 데이터를 문제제이슨 파일에 동기화"""
    
    print("=== 엑셀파일 LAYER2 → 문제제이슨 파일 동기화 ===")
    
    # 파일 경로
    excel_file = '참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx'
    json_file = 'static/data/gep_master_v1.0.json'
    backup_file = f'static/data/gep_master_v1.0_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    
    # 파일 존재 확인
    if not os.path.exists(excel_file):
        print(f"❌ 엑셀 파일이 존재하지 않습니다: {excel_file}")
        return False
    
    if not os.path.exists(json_file):
        print(f"❌ JSON 파일이 존재하지 않습니다: {json_file}")
        return False
    
    try:
        # 1. 엑셀 파일 읽기
        print(f"📁 엑셀 파일 읽기: {excel_file}")
        df = pd.read_excel(excel_file)
        
        print(f"   📊 엑셀 파일 레코드 수: {len(df)}개")
        print(f"   📋 엑셀 파일 컬럼: {list(df.columns)}")
        
        # QCODE와 LAYER2 컬럼 확인
        if 'QCODE' not in df.columns:
            print(f"❌ 엑셀 파일에 QCODE 컬럼이 없습니다.")
            return False
        
        if 'LAYER2' not in df.columns:
            print(f"❌ 엑셀 파일에 LAYER2 컬럼이 없습니다.")
            return False
        
        # 2. JSON 파일 읽기
        print(f"📁 JSON 파일 읽기: {json_file}")
        with open(json_file, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        questions = json_data.get('questions', [])
        print(f"   📊 JSON 파일 레코드 수: {len(questions)}개")
        
        # 3. 레코드 수 일치 확인
        if len(df) != len(questions):
            print(f"❌ 레코드 수 불일치: 엑셀 {len(df)}개 vs JSON {len(questions)}개")
            return False
        
        print(f"✅ 레코드 수 일치 확인 완료")
        
        # 4. 엑셀 파일을 QCODE 기준으로 정렬
        print(f"🔄 엑셀 파일을 QCODE 기준으로 정렬...")
        df_sorted = df.sort_values('QCODE').reset_index(drop=True)
        
        # 5. JSON 파일을 QCODE 기준으로 정렬
        print(f"🔄 JSON 파일을 QCODE 기준으로 정렬...")
        questions_sorted = sorted(questions, key=lambda x: x.get('QCODE', ''))
        
        # 6. 백업 생성
        print(f"💾 백업 생성: {backup_file}")
        backup_data = json_data.copy()
        backup_data['questions'] = questions_sorted
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, ensure_ascii=False, indent=2)
        
        # 7. LAYER2 데이터 동기화
        print(f"🔄 LAYER2 데이터 동기화 시작...")
        
        updated_count = 0
        unchanged_count = 0
        error_count = 0
        
        for i, (excel_row, json_question) in enumerate(zip(df_sorted.itertuples(), questions_sorted)):
            excel_qcode = getattr(excel_row, 'QCODE', '')
            json_qcode = json_question.get('QCODE', '')
            
            # QCODE 일치 확인
            if excel_qcode != json_qcode:
                print(f"   ⚠️ QCODE 불일치 (행 {i+1}): 엑셀 '{excel_qcode}' vs JSON '{json_qcode}'")
                error_count += 1
                continue
            
            excel_layer2 = getattr(excel_row, 'LAYER2', '')
            json_layer2 = json_question.get('LAYER2', '')
            
            # LAYER2 데이터 업데이트
            if excel_layer2 != json_layer2:
                json_question['LAYER2'] = excel_layer2
                updated_count += 1
                print(f"   ✅ 업데이트: {excel_qcode} - '{json_layer2}' → '{excel_layer2}'")
            else:
                unchanged_count += 1
        
        # 8. 결과 출력
        print(f"\n📊 동기화 결과:")
        print(f"   ✅ 업데이트된 레코드: {updated_count}개")
        print(f"   📋 변경 없는 레코드: {unchanged_count}개")
        print(f"   ❌ 오류 발생: {error_count}개")
        
        if error_count > 0:
            print(f"   ⚠️ 일부 QCODE 불일치로 인한 오류가 발생했습니다.")
            return False
        
        # 9. 업데이트된 JSON 파일 저장
        print(f"💾 업데이트된 JSON 파일 저장: {json_file}")
        json_data['questions'] = questions_sorted
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        # 10. LAYER2 과목별 통계 확인
        print(f"\n📋 LAYER2 과목별 통계:")
        layer2_counts = {}
        for question in questions_sorted:
            layer2 = question.get('LAYER2', '')
            layer2_counts[layer2] = layer2_counts.get(layer2, 0) + 1
        
        # 11개 과목 확인
        expected_subjects = [
            '보험업법', '상법', '세제재무', '자동차보험', '특종보험',
            '보증보험', '연금저축', '화재보험', '해상보험', '항공우주', '재보험'
        ]
        
        print(f"   📊 예상 과목 수: {len(expected_subjects)}개")
        print(f"   📊 실제 과목 수: {len(layer2_counts)}개")
        
        for subject in expected_subjects:
            count = layer2_counts.get(subject, 0)
            print(f"      {subject}: {count}개")
        
        # 누락된 과목 확인
        missing_subjects = [subject for subject in expected_subjects if subject not in layer2_counts]
        if missing_subjects:
            print(f"   ⚠️ 누락된 과목: {missing_subjects}")
        
        # 추가된 과목 확인
        extra_subjects = [subject for subject in layer2_counts if subject not in expected_subjects]
        if extra_subjects:
            print(f"   ⚠️ 추가된 과목: {extra_subjects}")
        
        print(f"\n✅ LAYER2 동기화 완료!")
        print(f"📁 백업 파일: {backup_file}")
        print(f"📁 업데이트된 파일: {json_file}")
        
        return True
        
    except Exception as e:
        print(f"❌ 동기화 중 오류 발생: {e}")
        return False

def verify_sync_result():
    """동기화 결과 검증"""
    
    print(f"\n=== 동기화 결과 검증 ===")
    
    # 엑셀 파일 읽기
    excel_file = '참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx'
    json_file = 'static/data/gep_master_v1.0.json'
    
    try:
        df = pd.read_excel(excel_file)
        with open(json_file, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        questions = json_data.get('questions', [])
        
        # QCODE 기준으로 정렬
        df_sorted = df.sort_values('QCODE').reset_index(drop=True)
        questions_sorted = sorted(questions, key=lambda x: x.get('QCODE', ''))
        
        # 일치 여부 확인
        match_count = 0
        mismatch_count = 0
        
        for excel_row, json_question in zip(df_sorted.itertuples(), questions_sorted):
            excel_qcode = getattr(excel_row, 'QCODE', '')
            json_qcode = json_question.get('QCODE', '')
            excel_layer2 = getattr(excel_row, 'LAYER2', '')
            json_layer2 = json_question.get('LAYER2', '')
            
            if excel_qcode == json_qcode and excel_layer2 == json_layer2:
                match_count += 1
            else:
                mismatch_count += 1
                if excel_qcode != json_qcode:
                    print(f"   ❌ QCODE 불일치: 엑셀 '{excel_qcode}' vs JSON '{json_qcode}'")
                if excel_layer2 != json_layer2:
                    print(f"   ❌ LAYER2 불일치: 엑셀 '{excel_layer2}' vs JSON '{json_layer2}'")
        
        print(f"📊 검증 결과:")
        print(f"   ✅ 일치: {match_count}개")
        print(f"   ❌ 불일치: {mismatch_count}개")
        
        if mismatch_count == 0:
            print(f"🎉 완벽한 동기화 확인!")
        else:
            print(f"⚠️ 일부 불일치 발견")
        
        return mismatch_count == 0
        
    except Exception as e:
        print(f"❌ 검증 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    print("🚀 엑셀파일 LAYER2 → 문제제이슨 파일 동기화 시작")
    print("=" * 60)
    
    # 동기화 실행
    if sync_layer2_from_excel_to_json():
        print("\n" + "=" * 60)
        # 검증 실행
        verify_sync_result()
    else:
        print("\n❌ 동기화 실패")
    
    print("\n" + "=" * 60)
    print("🏁 작업 완료")
