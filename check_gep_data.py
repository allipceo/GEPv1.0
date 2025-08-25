import pandas as pd

# GEP_MASTER_V1.0.xlsx 파일 읽기
df = pd.read_excel('참고자료/GEP_MASTER_V1.0.xlsx')

print("=== GEP_MASTER_V1.0.xlsx 데이터 분석 ===")
print(f"총 문제 수: {len(df)}")
print(f"컬럼 수: {len(df.columns)}")

print("\n=== 컬럼명 ===")
print(list(df.columns))

print("\n=== 문제 유형별 분포 ===")
print(df['QTYPE'].value_counts())

print("\n=== 과목별 분포 ===")
print(df['LAYER1'].value_counts())

print("\n=== 회차별 분포 (상위 10개) ===")
print(df['EROUND'].value_counts().head(10))

print("\n=== QCODE 패턴 분석 ===")
print("QCODE 접두사별 분포:")
qcode_prefixes = df['QCODE'].str[:4].value_counts()
print(qcode_prefixes)

print("\n=== 샘플 데이터 (첫 3개) ===")
sample_data = df[['INDEX', 'QCODE', 'LAYER1', 'QTYPE', 'QUESTION', 'ANSWER']].head(3)
for idx, row in sample_data.iterrows():
    print(f"\n문제 {row['INDEX']}:")
    print(f"  QCODE: {row['QCODE']}")
    print(f"  과목: {row['LAYER1']}")
    print(f"  유형: {row['QTYPE']}")
    print(f"  문제: {row['QUESTION'][:100]}...")
    print(f"  정답: {row['ANSWER']}")
