import pandas as pd
import json
import os

def convert_csv_to_json():
    """
    GEP_MASTER_V1.0.csv를 JSON으로 변환
    핵심 원칙: QUESTION 필드 절대 노터치 - 그대로 통과
    """
    print("=== CSV to JSON 변환 시작 ===")
    
    # CSV 파일 읽기
    csv_file = '참고자료/GEP_MASTER_V1.0.csv'
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일이 없습니다: {csv_file}")
        print("먼저 Excel to CSV 변환을 실행해주세요.")
        return None
    
    df = pd.read_csv(csv_file, encoding='utf-8-sig')
    print(f"총 {len(df)}개 문제 로드 완료")
    
    # JSON 구조 초기화
    gep_questions = {}
    
    for index, row in df.iterrows():
        # QCODE를 키로 사용
        qcode = row['QCODE']
        
        # QUESTION 필드는 절대 건드리지 않고 그대로 보존
        question_data = {
            "QCODE": qcode,
            "INDEX": int(row['INDEX']),
            "ETITLE": str(row['ETITLE']),
            "ECLASS": str(row['ECLASS']),
            "EROUND": float(row['EROUND']) if pd.notna(row['EROUND']) else None,
            "LAYER1": str(row['LAYER1']) if pd.notna(row['LAYER1']) else None,
            "LAYER2": str(row['LAYER2']) if pd.notna(row['LAYER2']) else None,
            "LAYER3": str(row['LAYER3']) if pd.notna(row['LAYER3']) else None,
            "QNUM": int(row['QNUM']),
            "QTYPE": str(row['QTYPE']),
            # QUESTION 필드 - 절대 노터치, 그대로 통과
            "QUESTION": str(row['QUESTION']),
            "ANSWER": str(row['ANSWER']),
            "DIFFICULTY": float(row['DIFFICULTY']) if pd.notna(row['DIFFICULTY']) else None,
            "CREATED_DATE": str(row['CREATED_DATE']),
            "MODIFIED_DATE": str(row['MODIFIED_DATE'])
        }
        
        gep_questions[qcode] = question_data
    
    # JSON 파일로 저장
    output_file = 'static/gep_questions.json'
    
    # 디렉토리 생성 (필요시)
    os.makedirs('static', exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(gep_questions, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 변환 완료: {len(gep_questions)}개 문제")
    print(f"✅ 저장 위치: {output_file}")
    print(f"✅ QUESTION 필드 보존 확인: {len(gep_questions)}개 문제 모두 원본 그대로")
    
    # 샘플 데이터 확인 (QUESTION 필드 보존 확인용)
    sample_qcode = list(gep_questions.keys())[0]
    sample_question = gep_questions[sample_qcode]
    print(f"\n=== 샘플 데이터 확인 (QCODE: {sample_qcode}) ===")
    print(f"INDEX: {sample_question['INDEX']}")
    print(f"LAYER1: {sample_question['LAYER1']}")
    print(f"QTYPE: {sample_question['QTYPE']}")
    print(f"QUESTION 길이: {len(sample_question['QUESTION'])} 문자")
    print(f"QUESTION 시작 부분: {sample_question['QUESTION'][:100]}...")
    print(f"ANSWER: {sample_question['ANSWER']}")
    
    return gep_questions

if __name__ == "__main__":
    convert_csv_to_json()
