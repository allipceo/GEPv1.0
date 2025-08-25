import pandas as pd
import json
import os

def convert_csv_to_json_simple():
    """간단한 CSV to JSON 변환"""
    print("=== CSV to JSON 변환 시작 ===")
    
    # CSV 파일 읽기
    csv_file = 'GEP_MASTER_V1.0.csv'
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일이 없습니다: {csv_file}")
        return None
    
    try:
        df = pd.read_csv(csv_file, encoding='utf-8-sig')
        print(f"✅ 총 {len(df)}개 문제 로드 완료")
        print(f"✅ 컬럼명: {list(df.columns)}")
    except Exception as e:
        print(f"❌ CSV 파일 읽기 실패: {e}")
        return None
    
    # JSON 구조 생성
    gep_data = {
        "metadata": {
            "total_questions": len(df),
            "source_file": csv_file,
            "version": "GEP v1.0"
        },
        "questions": {}
    }
    
    # 문제 데이터 변환
    for index, row in df.iterrows():
        qcode = str(row['QCODE']) if pd.notna(row['QCODE']) else f"GEP-{index+1:04d}"
        
        # QUESTION 필드는 절대 건드리지 않고 그대로 보존
        question_text = str(row['QUESTION']) if pd.notna(row['QUESTION']) else ""
        
        question_data = {
            "index": int(row['INDEX']) if pd.notna(row['INDEX']) else index + 1,
            "qcode": qcode,
            "question": question_text,  # 절대 노터치
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
        
        gep_data["questions"][qcode] = question_data
    
    # JSON 파일로 저장
    output_file = 'static/data/gep_questions.json'
    os.makedirs('static/data', exist_ok=True)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gep_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 변환 완료: {len(gep_data['questions'])}개 문제")
        print(f"✅ 저장 위치: {output_file}")
        
        # 샘플 확인
        sample_qcode = list(gep_data['questions'].keys())[0]
        sample_question = gep_data['questions'][sample_qcode]
        print(f"✅ 샘플 - QCODE: {sample_qcode}, QUESTION 길이: {len(sample_question['question'])} 문자")
        
        return gep_data
        
    except Exception as e:
        print(f"❌ JSON 저장 실패: {e}")
        return None

if __name__ == "__main__":
    convert_csv_to_json_simple()
