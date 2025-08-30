import pandas as pd
import json
from datetime import datetime

def sync_excel_qcode_with_json():
    """JSON 파일의 QCODE를 엑셀 파일에 완전히 동일하게 적용"""
    
    print("=== JSON과 엑셀 파일 QCODE 동기화 시작 ===")
    
    # 1. JSON 파일 읽기
    print("1. JSON 파일 읽기...")
    with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
        json_data = json.load(f)
    
    print(f"   JSON 파일: {len(json_data['questions'])}개 문제")
    
    # 2. 엑셀 파일 읽기
    print("2. 엑셀 파일 읽기...")
    try:
        df = pd.read_excel('참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx')
        print(f"   엑셀 파일: {len(df)}개 행")
    except Exception as e:
        print(f"   ❌ 엑셀 파일 읽기 실패: {e}")
        return
    
    # 3. 레코드 수 확인
    if len(df) != len(json_data['questions']):
        print(f"   ❌ 레코드 수 불일치: 엑셀 {len(df)}개 vs JSON {len(json_data['questions'])}개")
        return
    else:
        print(f"   ✅ 레코드 수 일치: {len(df)}개")
    
    # 4. 기존 QCODE 백업
    print("3. 기존 QCODE 백업...")
    df['QCODE_OLD'] = df['QCODE'].copy()
    
    # 5. JSON의 QCODE를 순서대로 엑셀에 적용
    print("4. JSON QCODE를 엑셀에 적용...")
    updated_count = 0
    
    for idx, question in enumerate(json_data['questions']):
        if idx < len(df):
            json_qcode = question.get('QCODE', '')
            df.at[idx, 'QCODE'] = json_qcode
            updated_count += 1
    
    print(f"   {updated_count}개의 QCODE 적용 완료")
    
    # 6. 백업 파일 생성
    print("5. 백업 파일 생성...")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"참고자료/GEP_MASTER_V1.0_QCODE_SYNC_BACKUP_{timestamp}.xlsx"
    df.to_excel(backup_filename, index=False)
    print(f"   백업 파일 생성: {backup_filename}")
    
    # 7. 원본 파일 업데이트
    print("6. 원본 엑셀 파일 업데이트...")
    df.to_excel('참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx', index=False)
    print("   원본 파일 업데이트 완료")
    
    # 8. 결과 확인
    print("7. 결과 확인...")
    print(f"   총 행 수: {len(df)}개")
    print(f"   업데이트된 QCODE: {updated_count}개")
    
    # QCODE 중복 확인
    qcode_counts = df['QCODE'].value_counts()
    duplicates = qcode_counts[qcode_counts > 1]
    
    if len(duplicates) > 0:
        print(f"   ❌ 중복된 QCODE: {len(duplicates)}개")
        print("   중복된 QCODE 목록:")
        for qcode, count in duplicates.head(5).items():
            print(f"     {qcode}: {count}회")
    else:
        print(f"   ✅ 중복된 QCODE 없음")
    
    print(f"   고유한 QCODE 수: {len(qcode_counts)}개")
    
    # 9. JSON과 엑셀 비교
    print("8. JSON과 엑셀 파일 비교...")
    match_count = 0
    for idx, question in enumerate(json_data['questions']):
        if idx < len(df):
            json_qcode = question.get('QCODE', '')
            excel_qcode = df.at[idx, 'QCODE']
            if json_qcode == excel_qcode:
                match_count += 1
    
    print(f"   JSON과 일치하는 QCODE: {match_count}개")
    print(f"   일치율: {match_count/len(df)*100:.2f}%")
    
    print()
    print("=== 업데이트된 QCODE 예시 (처음 10개) ===")
    for i in range(min(10, len(df))):
        print(f"   {i+1:2d}. {df.at[i, 'QCODE']}")
    
    print()
    print("✅ JSON과 엑셀 파일 QCODE 동기화 완료!")
    print(f"📁 백업 파일: {backup_filename}")
    print(f"📁 업데이트된 파일: 참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx")

if __name__ == "__main__":
    sync_excel_qcode_with_json()
