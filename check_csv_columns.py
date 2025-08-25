import pandas as pd
import os

def check_csv_columns():
    """CSV 파일의 컬럼명을 확인합니다."""
    csv_file = "GEP_MASTER_V1.0.csv"
    
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일이 없습니다: {csv_file}")
        return None
    
    try:
        df = pd.read_csv(csv_file, encoding='utf-8-sig')
        print(f"✅ CSV 파일 로드 완료: {csv_file}")
        print(f"📊 총 {len(df)}개 행, {len(df.columns)}개 컬럼")
        print(f"📋 컬럼명 목록:")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i:2d}. {col}")
        
        # 샘플 데이터 확인
        print(f"\n📝 첫 번째 행 샘플:")
        first_row = df.iloc[0]
        for col in df.columns:
            value = str(first_row[col])[:50] + "..." if len(str(first_row[col])) > 50 else str(first_row[col])
            print(f"  {col}: {value}")
        
        return df.columns.tolist()
        
    except Exception as e:
        print(f"❌ CSV 파일 읽기 실패: {e}")
        return None

if __name__ == "__main__":
    check_csv_columns()
