import pandas as pd
import json
import os
from datetime import datetime

def convert_csv_to_json():
    """
    GEP_MASTER_V1.0.csv를 JSON으로 변환
    핵심 원칙: QUESTION 필드 절대 노터치 - 그대로 통과
    ACIU S4 구조 참고하여 GEP 구조 생성
    """
    print("=== GEP CSV to JSON 변환 시작 (v2) ===")
    
    # CSV 파일 읽기
    csv_file = '참고자료/GEP_MASTER_V1.0.csv'
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일이 없습니다: {csv_file}")
        return None
    
    try:
        df = pd.read_csv(csv_file, encoding='utf-8-sig')
        print(f"✅ 총 {len(df)}개 문제 로드 완료")
        print(f"✅ 컬럼 수: {len(df.columns)}")
        print(f"✅ 컬럼명: {list(df.columns)}")
    except Exception as e:
        print(f"❌ CSV 파일 읽기 실패: {e}")
        return None
    
    # JSON 구조 초기화 (ACIU S4 구조 참고)
    gep_data = {
        "metadata": {
            "total_questions": len(df),
            "source_file": "GEP_MASTER_V1.0.csv",
            "conversion_date": datetime.now().isoformat(),
            "version": "GEP v1.0",
            "exam_type": "손해보험중개사",
            "categories": {}
        },
        "questions": {}
    }
    
    # 카테고리별 문제 수 집계
    if 'LAYER1' in df.columns:
        category_counts = df['LAYER1'].value_counts().to_dict()
        gep_data["metadata"]["categories"] = category_counts
    
    # 문제 데이터 변환
    for index, row in df.iterrows():
        # QCODE를 키로 사용
        qcode = str(row['QCODE']) if pd.notna(row['QCODE']) else f"GEP-{index+1:04d}"
        
        # QUESTION 필드는 절대 건드리지 않고 그대로 보존
        question_text = str(row['QUESTION']) if pd.notna(row['QUESTION']) else ""
        
        # 문제 데이터 구성 (ACIU S4 구조 참고)
        question_data = {
            "index": int(row['INDEX']) if pd.notna(row['INDEX']) else index + 1,
            "qcode": qcode,
            "question": question_text,  # 절대 노터치
            "answer": str(row['ANSWER']) if pd.notna(row['ANSWER']) else "",
            "type": str(row['QTYPE']) if pd.notna(row['QTYPE']) else "진위형",
            "layer1": str(row['LAYER1']) if pd.notna(row['LAYER1']) else "",
            "layer2": str(row['LAYER2']) if pd.notna(row['LAYER2']) else "",
            "layer3": str(row['LAYER3']) if pd.notna(row['LAYER3']) else "",
            "source": "GEP_MASTER",
            "title": str(row['ETITLE']) if pd.notna(row['ETITLE']) else "",
            "round": float(row['EROUND']) if pd.notna(row['EROUND']) else None,
            "qnum": int(row['QNUM']) if pd.notna(row['QNUM']) else 0,
            "difficulty": float(row['DIFFICULTY']) if pd.notna(row['DIFFICULTY']) else None,
            "created_date": str(row['CREATED_DATE']) if pd.notna(row['CREATED_DATE']) else "",
            "modified_date": str(row['MODIFIED_DATE']) if pd.notna(row['MODIFIED_DATE']) else "",
            "exam_class": str(row['ECLASS']) if pd.notna(row['ECLASS']) else ""
        }
        
        gep_data["questions"][qcode] = question_data
    
    # JSON 파일로 저장
    output_file = 'static/data/gep_questions.json'
    
    # 디렉토리 생성 (필요시)
    os.makedirs('static/data', exist_ok=True)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gep_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 변환 완료: {len(gep_data['questions'])}개 문제")
        print(f"✅ 저장 위치: {output_file}")
        print(f"✅ QUESTION 필드 보존 확인: {len(gep_data['questions'])}개 문제 모두 원본 그대로")
        
        # 샘플 데이터 확인 (QUESTION 필드 보존 확인용)
        sample_qcode = list(gep_data['questions'].keys())[0]
        sample_question = gep_data['questions'][sample_qcode]
        print(f"\n=== 샘플 데이터 확인 (QCODE: {sample_qcode}) ===")
        print(f"INDEX: {sample_question['index']}")
        print(f"LAYER1: {sample_question['layer1']}")
        print(f"TYPE: {sample_question['type']}")
        print(f"QUESTION 길이: {len(sample_question['question'])} 문자")
        print(f"QUESTION 시작 부분: {sample_question['question'][:100]}...")
        print(f"ANSWER: {sample_question['answer']}")
        
        # 메타데이터 출력
        print(f"\n=== 메타데이터 ===")
        print(f"총 문제 수: {gep_data['metadata']['total_questions']}")
        print(f"변환 날짜: {gep_data['metadata']['conversion_date']}")
        print(f"카테고리별 문제 수: {gep_data['metadata']['categories']}")
        
        return gep_data
        
    except Exception as e:
        print(f"❌ JSON 저장 실패: {e}")
        return None

if __name__ == "__main__":
    convert_csv_to_json()
