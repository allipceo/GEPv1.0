import pandas as pd
import json
import os

# CSV 파일 읽기
df = pd.read_csv('GEP_MASTER_V1.0.csv', encoding='utf-8-sig')
print(f"총 {len(df)}개 문제 로드")

# JSON 구조 생성
questions = {}
for index, row in df.iterrows():
    qcode = str(row['QCODE']) if pd.notna(row['QCODE']) else f"GEP-{index+1:04d}"
    
    # QUESTION 필드는 절대 건드리지 않고 그대로 보존
    questions[qcode] = {
        "index": int(row['INDEX']) if pd.notna(row['INDEX']) else index + 1,
        "qcode": qcode,
        "question": str(row['QUESTION']),  # 절대 노터치
        "answer": str(row['ANSWER']) if pd.notna(row['ANSWER']) else "",
        "type": str(row['QTYPE']) if pd.notna(row['QTYPE']) else "진위형",
        "layer1": str(row['LAYER1']) if pd.notna(row['LAYER1']) else "",
        "layer2": str(row['LAYER2']) if pd.notna(row['LAYER2']) else "",
        "layer3": str(row['LAYER3']) if pd.notna(row['LAYER3']) else "",
        "title": str(row['ETITLE']) if pd.notna(row['ETITLE']) else "",
        "round": float(row['EROUND']) if pd.notna(row['EROUND']) else None,
        "qnum": int(row['QNUM']) if pd.notna(row['QNUM']) else 0,
        "difficulty": float(row['DIFFICULTY']) if pd.notna(row['DIFFICULTY']) else None,
        "exam_class": str(row['ECLASS']) if pd.notna(row['ECLASS']) else ""
    }

# 디렉토리 생성
os.makedirs('static/data', exist_ok=True)

# JSON 저장
with open('static/data/gep_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"✅ 변환 완료: {len(questions)}개 문제")
print("✅ 저장: static/data/gep_questions.json")
