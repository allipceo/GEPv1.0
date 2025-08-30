import pandas as pd
import json
from datetime import datetime

def update_excel_qcode():
    """엑셀 파일의 QCODE를 새로운 방식으로 변환"""
    
    print("=== 엑셀 파일 QCODE 업데이트 시작 ===")
    
    # 1. JSON 파일에서 현재 QCODE 매핑 정보 읽기
    print("1. JSON 파일에서 QCODE 매핑 정보 읽기...")
    with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
        json_data = json.load(f)
    
    # JSON 데이터를 딕셔너리로 변환 (QCODE 매핑용)
    qcode_mapping = {}
    for question in json_data['questions']:
        # 고유 식별자 생성 (LAYER2 + EROUND + 순서)
        key = f"{question.get('LAYER2', '')}_{question.get('EROUND', '')}_{question.get('QCODE', '').split('-')[-1] if '-' in question.get('QCODE', '') else ''}"
        qcode_mapping[key] = question.get('QCODE', '')
    
    print(f"   JSON에서 {len(qcode_mapping)}개의 QCODE 매핑 정보 로드 완료")
    
    # 2. 엑셀 파일 읽기
    print("2. 엑셀 파일 읽기...")
    try:
        df = pd.read_excel('참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx')
        print(f"   엑셀 파일 읽기 성공: {len(df)}개 행")
    except Exception as e:
        print(f"   ❌ 엑셀 파일 읽기 실패: {e}")
        return
    
    # 3. 기존 QCODE 백업
    print("3. 기존 QCODE 백업...")
    df['QCODE_OLD'] = df['QCODE'].copy()
    
    # 4. 새로운 QCODE 생성
    print("4. 새로운 QCODE 생성...")
    updated_count = 0
    
    for idx, row in df.iterrows():
        layer2 = str(row.get('LAYER2', ''))
        eround = str(row.get('EROUND', ''))
        old_qcode = str(row.get('QCODE', ''))
        
        # 기존 QCODE에서 순번 추출
        if '-' in old_qcode:
            sequence = old_qcode.split('-')[-1]
        else:
            sequence = str(idx + 1).zfill(2)
        
        # 고유 식별자 생성
        key = f"{layer2}_{eround}_{sequence}"
        
        # JSON에서 매칭되는 QCODE 찾기
        if key in qcode_mapping:
            new_qcode = qcode_mapping[key]
            df.at[idx, 'QCODE'] = new_qcode
            updated_count += 1
        else:
            # 매칭되지 않는 경우 기본 패턴으로 생성
            if layer2 and eround:
                # AB20AA 형태로 생성
                year = eround.split('.')[0] if '.' in eround else eround
                if layer2 == '보험업법':
                    new_qcode = f"AB{year}AA-{sequence}"
                elif layer2 == '상법':
                    new_qcode = f"AB{year}AA-{sequence}"
                elif layer2 == '회계재무':
                    new_qcode = f"AB{year}AA-{sequence}"
                else:
                    new_qcode = f"AB{year}AA-{sequence}"
                df.at[idx, 'QCODE'] = new_qcode
                updated_count += 1
    
    print(f"   {updated_count}개의 QCODE 업데이트 완료")
    
    # 5. 백업 파일 생성
    print("5. 백업 파일 생성...")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"참고자료/GEP_MASTER_V1.0_QCODE_BACKUP_{timestamp}.xlsx"
    df.to_excel(backup_filename, index=False)
    print(f"   백업 파일 생성: {backup_filename}")
    
    # 6. 원본 파일 업데이트
    print("6. 원본 엑셀 파일 업데이트...")
    df.to_excel('참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx', index=False)
    print("   원본 파일 업데이트 완료")
    
    # 7. 결과 확인
    print("7. 결과 확인...")
    print(f"   총 행 수: {len(df)}개")
    print(f"   업데이트된 QCODE: {updated_count}개")
    
    # QCODE 패턴 분석
    qcode_patterns = df['QCODE'].value_counts()
    print(f"   고유한 QCODE 수: {len(qcode_patterns)}개")
    
    print()
    print("=== 업데이트된 QCODE 예시 ===")
    for i, (qcode, count) in enumerate(qcode_patterns.head(10).items()):
        print(f"   {qcode}: {count}개")
    
    print()
    print("✅ 엑셀 파일 QCODE 업데이트 완료!")
    print(f"📁 백업 파일: {backup_filename}")
    print(f"📁 업데이트된 파일: 참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx")

if __name__ == "__main__":
    update_excel_qcode()
