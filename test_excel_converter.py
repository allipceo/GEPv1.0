import pandas as pd
import json
import os
from datetime import datetime

def debug_excel_structure():
    """엑셀 파일 구조 상세 분석"""
    print("🔍 엑셀 파일 구조 상세 분석...")
    
    excel_file = "참고자료/GEP_MASTER_V1.0.xlsx"
    
    try:
        df = pd.read_excel(excel_file, engine='openpyxl')
        
        print(f"📊 기본 정보:")
        print(f"  - 행 수: {len(df)}")
        print(f"  - 열 수: {len(df.columns)}")
        print(f"  - 메모리 사용량: {df.memory_usage(deep=True).sum() / 1024:.2f} KB")
        
        print(f"\n📋 열 정보:")
        for i, col in enumerate(df.columns):
            non_null_count = df[col].count()
            null_count = df[col].isnull().sum()
            unique_count = df[col].nunique()
            
            print(f"  {i+1:2d}. {col:15s} - 비어있지 않은 값: {non_null_count:4d}, 빈 값: {null_count:4d}, 고유값: {unique_count:4d}")
        
        print(f"\n📋 데이터 타입:")
        for col in df.columns:
            dtype = df[col].dtype
            print(f"  {col:15s}: {dtype}")
        
        print(f"\n📋 샘플 데이터 (첫 3행):")
        for i in range(min(3, len(df))):
            print(f"  행 {i+1}:")
            for col in df.columns:
                value = df.iloc[i][col]
                if pd.notna(value):
                    display_value = str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
                    print(f"    {col}: {display_value}")
                else:
                    print(f"    {col}: (빈 값)")
            print()
        
        return True
        
    except Exception as e:
        print(f"❌ 분석 실패: {e}")
        return False

def test_data_conversion():
    """데이터 변환 테스트"""
    print("🧪 데이터 변환 테스트...")
    
    excel_file = "참고자료/GEP_MASTER_V1.0.xlsx"
    
    try:
        df = pd.read_excel(excel_file, engine='openpyxl')
        
        # 첫 번째 행 변환 테스트
        first_row = df.iloc[0]
        
        print(f"📋 첫 번째 행 변환 테스트:")
        
        # 원본 데이터
        print(f"  원본 데이터:")
        for col in df.columns:
            value = first_row[col]
            if pd.notna(value):
                print(f"    {col}: {str(value)[:50]}...")
            else:
                print(f"    {col}: (빈 값)")
        
        # 변환된 데이터
        print(f"\n  변환된 데이터:")
        converted_data = {
            "INDEX": str(first_row.get("INDEX", "")) if pd.notna(first_row.get("INDEX")) else "",
            "ETITLE": str(first_row.get("ETITLE", "")) if pd.notna(first_row.get("ETITLE")) else "",
            "ECLASS": str(first_row.get("ECLASS", "")) if pd.notna(first_row.get("ECLASS")) else "",
            "QCODE": str(first_row.get("QCODE", "")) if pd.notna(first_row.get("QCODE")) else "",
            "EROUND": str(first_row.get("EROUND", "")) if pd.notna(first_row.get("EROUND")) else "",
            "LAYER1": str(first_row.get("LAYER1", "")) if pd.notna(first_row.get("LAYER1")) else "",
            "LAYER2": str(first_row.get("LAYER2", "")) if pd.notna(first_row.get("LAYER2")) else "",
            "LAYER3": str(first_row.get("LAYER3", "")) if pd.notna(first_row.get("LAYER3")) else "",
            "QNUM": str(first_row.get("QNUM", "")) if pd.notna(first_row.get("QNUM")) else "",
            "QTYPE": str(first_row.get("QTYPE", "")) if pd.notna(first_row.get("QTYPE")) else "",
            "QUESTION": str(first_row.get("QUESTION", "")) if pd.notna(first_row.get("QUESTION")) else "",
            "ANSWER": str(first_row.get("ANSWER", "")) if pd.notna(first_row.get("ANSWER")) else "",
            "DIFFICULTY": str(first_row.get("DIFFICULTY", "")) if pd.notna(first_row.get("DIFFICULTY")) else "",
            "CREATED_DATE": str(first_row.get("CREATED_DATE", "")) if pd.notna(first_row.get("CREATED_DATE")) else "",
            "MODIFIED_DATE": str(first_row.get("MODIFIED_DATE", "")) if pd.notna(first_row.get("MODIFIED_DATE")) else ""
        }
        
        for key, value in converted_data.items():
            print(f"    {key}: {value[:50]}..." if len(value) > 50 else f"    {key}: {value}")
        
        # QUESTION 필드 보호 확인
        print(f"\n🔒 QUESTION 필드 보호 확인:")
        original_question = first_row.get("QUESTION", "")
        converted_question = converted_data["QUESTION"]
        
        if pd.notna(original_question):
            print(f"  원본 길이: {len(str(original_question))} 문자")
            print(f"  변환 길이: {len(converted_question)} 문자")
            print(f"  내용 일치: {'✅' if str(original_question) == converted_question else '❌'}")
        else:
            print(f"  원본: 빈 값")
            print(f"  변환: {converted_question}")
        
        return True
        
    except Exception as e:
        print(f"❌ 변환 테스트 실패: {e}")
        return False

def validate_json_output():
    """생성된 JSON 파일 검증"""
    print("🔍 JSON 파일 검증...")
    
    json_file = "static/data/gep_master_v1.0.json"
    
    if not os.path.exists(json_file):
        print(f"❌ JSON 파일이 존재하지 않습니다: {json_file}")
        return False
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📊 JSON 파일 정보:")
        print(f"  - 파일 크기: {os.path.getsize(json_file)} bytes")
        print(f"  - 메타데이터: {data['metadata']}")
        
        questions = data['questions']
        print(f"  - 문제 수: {len(questions)}")
        
        if questions:
            first_question = questions[0]
            print(f"\n📋 첫 번째 문제 검증:")
            print(f"  QCODE: {first_question['QCODE']}")
            print(f"  QUESTION 길이: {len(first_question['QUESTION'])} 문자")
            print(f"  ANSWER: {first_question['ANSWER']}")
            print(f"  모든 필드 존재: {'✅' if all(key in first_question for key in ['INDEX', 'ETITLE', 'ECLASS', 'QCODE', 'EROUND', 'LAYER1', 'LAYER2', 'LAYER3', 'QNUM', 'QTYPE', 'QUESTION', 'ANSWER', 'DIFFICULTY', 'CREATED_DATE', 'MODIFIED_DATE']) else '❌'}")
        
        # 데이터 무결성 검사
        print(f"\n🔍 데이터 무결성 검사:")
        
        # QCODE 중복 확인
        qcodes = [q['QCODE'] for q in questions if q['QCODE']]
        unique_qcodes = set(qcodes)
        print(f"  - QCODE 중복: {'❌' if len(qcodes) != len(unique_qcodes) else '✅'}")
        
        # 빈 QUESTION 확인
        empty_questions = [q for q in questions if not q['QUESTION']]
        print(f"  - 빈 QUESTION: {len(empty_questions)}개")
        
        # ANSWER 형식 확인
        answers = [q['ANSWER'] for q in questions if q['ANSWER']]
        unique_answers = set(answers)
        print(f"  - 고유 ANSWER: {sorted(unique_answers)}")
        
        return True
        
    except Exception as e:
        print(f"❌ JSON 검증 실패: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Excel to JSON 변환기 디버깅 및 테스트")
    print("=" * 60)
    
    # 1. 엑셀 파일 구조 분석
    print("1️⃣ 엑셀 파일 구조 분석")
    debug_excel_structure()
    
    print("\n" + "=" * 60)
    
    # 2. 데이터 변환 테스트
    print("2️⃣ 데이터 변환 테스트")
    test_data_conversion()
    
    print("\n" + "=" * 60)
    
    # 3. JSON 파일 검증
    print("3️⃣ JSON 파일 검증")
    validate_json_output()
    
    print("\n" + "=" * 60)
    print("🎉 디버깅 및 테스트 완료!")
