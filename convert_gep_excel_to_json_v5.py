import pandas as pd
import json
from datetime import datetime

def convert_excel_to_json():
    """실제 엑셀 파일을 JSON으로 변환 (세제재무 → 회계재무 변경)"""
    
    # 실제 엑셀 파일 읽기
    try:
        df = pd.read_excel('참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx')
        print(f"✅ 엑셀 파일 읽기 성공: {len(df)}개 행")
    except Exception as e:
        print(f"❌ 엑셀 파일 읽기 실패: {e}")
        return
    
    # LAYER2 필드가 있는 데이터만 필터링 (빈 값 제거)
    df_filtered = df[df['LAYER2'].notna() & (df['LAYER2'] != '')]
    print(f"✅ LAYER2 필터링 완료: {len(df_filtered)}개 행")
    
    # 세제재무를 회계재무로 변경
    df_filtered['LAYER2'] = df_filtered['LAYER2'].replace('세제재무', '회계재무')
    print(f"✅ 세제재무 → 회계재무 변경 완료")
    
    # LAYER2 고유값 확인
    layer2_values = df_filtered['LAYER2'].unique()
    print(f"✅ LAYER2 고유값: {layer2_values}")
    
    # QTYPE 'A' (객관식) 문제만 필터링
    df_a_type = df_filtered[df_filtered['QTYPE'] == 'A']
    print(f"✅ QTYPE 'A' 필터링 완료: {len(df_a_type)}개 행")
    
    # JSON 구조 생성
    questions = []
    
    for idx, row in df_a_type.iterrows():
        question_data = {
            "QCODE": str(row.get('QCODE', '')),
            "ETITLE": str(row.get('ETITLE', '')),
            "ECLASS": str(row.get('ECLASS', '')),
            "LAYER1": str(row.get('LAYER1', '')),
            "LAYER2": str(row.get('LAYER2', '')),
            "QTYPE": str(row.get('QTYPE', '')),
            "QUESTION": str(row.get('QUESTION', '')),  # QUESTION 필드 절대 노터치
            "ANSWER": str(row.get('ANSWER', '')),
            "EROUND": str(row.get('EROUND', ''))
        }
        questions.append(question_data)
    
    # 메타데이터 생성
    metadata = {
        "version": "1.0",
        "created_date": datetime.now().strftime("%Y-%m-%d"),
        "total_questions": len(questions),
        "subjects": sorted(layer2_values.tolist()),
        "data_integrity": {
            "question_field_protected": True,
            "no_parsing_or_modification": True,
            "source_file": "GEP_MASTER_V1.0(LAYER2포함).xlsx",
            "conversion_note": "세제재무 → 회계재무로 변경됨"
        }
    }
    
    # 최종 JSON 구조
    json_data = {
        "metadata": metadata,
        "questions": questions
    }
    
    # JSON 파일 저장
    output_file = 'static/data/gep_master_v1.0.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ JSON 파일 생성 완료: {output_file}")
    print(f"📊 총 문제 수: {len(questions)}개")
    print(f"📚 과목 수: {len(layer2_values)}개")
    print(f"📋 과목 목록: {sorted(layer2_values.tolist())}")
    
    # 과목별 문제 수 확인
    print("\n📈 과목별 문제 수:")
    for subject in sorted(layer2_values.tolist()):
        count = len([q for q in questions if q['LAYER2'] == subject])
        print(f"  - {subject}: {count}개")

if __name__ == "__main__":
    convert_excel_to_json()
