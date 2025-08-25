import pandas as pd

def convert_excel_to_csv():
    """
    GEP_MASTER_V1.0.xlsx를 CSV로 변환
    QUESTION 필드 절대 노터치 - 그대로 통과
    """
    print("=== Excel to CSV 변환 시작 ===")
    
    # Excel 파일 읽기
    df = pd.read_excel('참고자료/GEP_MASTER_V1.0.xlsx')
    print(f"총 {len(df)}개 문제 로드 완료")
    
    # CSV 파일로 저장 (QUESTION 필드 그대로 보존)
    output_file = '참고자료/GEP_MASTER_V1.0.csv'
    df.to_csv(output_file, index=False, encoding='utf-8-sig')
    
    print(f"✅ CSV 변환 완료: {output_file}")
    print(f"✅ 총 {len(df)}개 문제 변환됨")
    print(f"✅ 컬럼 수: {len(df.columns)}")
    
    # 샘플 데이터 확인
    print(f"\n=== 샘플 데이터 확인 ===")
    print(f"첫 번째 문제 INDEX: {df.iloc[0]['INDEX']}")
    print(f"첫 번째 문제 QCODE: {df.iloc[0]['QCODE']}")
    print(f"첫 번째 문제 QUESTION 길이: {len(str(df.iloc[0]['QUESTION']))} 문자")
    print(f"첫 번째 문제 QUESTION 시작: {str(df.iloc[0]['QUESTION'])[:100]}...")
    
    return output_file

if __name__ == "__main__":
    convert_excel_to_csv()
