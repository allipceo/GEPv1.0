import pandas as pd
import json
import os
import shutil
from datetime import datetime

def excel_to_gep_json():
    """
    GEP_MASTER_V1.0.xlsx 파일을 직접 GEP V1.0 JSON 구조로 변환합니다.
    CSV 변환 과정 없이 엑셀에서 바로 JSON으로 변환합니다.
    QUESTION 필드는 절대 수정하지 않고 그대로 전달합니다.
    """
    
    print("🚀 Excel to GEP JSON 직접 변환 시작...")
    
    # 파일 경로
    excel_file = "참고자료/GEP_MASTER_V1.0.xlsx"
    json_file = "static/data/gep_master_v1.0.json"
    backup_file = f"static/data/gep_master_v1.0_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    # 엑셀 파일 존재 확인
    if not os.path.exists(excel_file):
        print(f"❌ 엑셀 파일을 찾을 수 없습니다: {excel_file}")
        return False
    
    try:
        # 1. 기존 JSON 파일 백업
        if os.path.exists(json_file):
            shutil.copy2(json_file, backup_file)
            print(f"✅ 기존 파일 백업 완료: {backup_file}")
        
        # 2. 엑셀 파일 직접 읽기
        print("📖 엑셀 파일 읽는 중...")
        df = pd.read_excel(excel_file, engine='openpyxl')
        
        print(f"📊 엑셀 파일 정보:")
        print(f"  - 행 수: {len(df)}")
        print(f"  - 열 수: {len(df.columns)}")
        print(f"  - 열 이름: {list(df.columns)}")
        
        # 3. 데이터 변환
        questions = []
        total_questions = 0
        
        print("🔄 데이터 변환 중...")
        
        for index, row in df.iterrows():
            total_questions += 1
            
            # GEP V1.0 구조에 맞게 데이터 변환
            # NaN 값을 빈 문자열로 처리
            question_data = {
                "INDEX": str(row.get("INDEX", "")) if pd.notna(row.get("INDEX")) else "",
                "ETITLE": str(row.get("ETITLE", "")) if pd.notna(row.get("ETITLE")) else "",
                "ECLASS": str(row.get("ECLASS", "")) if pd.notna(row.get("ECLASS")) else "",
                "QCODE": str(row.get("QCODE", "")) if pd.notna(row.get("QCODE")) else "",
                "EROUND": str(row.get("EROUND", "")) if pd.notna(row.get("EROUND")) else "",
                "LAYER1": str(row.get("LAYER1", "")) if pd.notna(row.get("LAYER1")) else "",
                "LAYER2": str(row.get("LAYER2", "")) if pd.notna(row.get("LAYER2")) else "",
                "LAYER3": str(row.get("LAYER3", "")) if pd.notna(row.get("LAYER3")) else "",
                "QNUM": str(row.get("QNUM", "")) if pd.notna(row.get("QNUM")) else "",
                "QTYPE": str(row.get("QTYPE", "")) if pd.notna(row.get("QTYPE")) else "",
                "QUESTION": str(row.get("QUESTION", "")) if pd.notna(row.get("QUESTION")) else "",  # 절대 수정 금지
                "ANSWER": str(row.get("ANSWER", "")) if pd.notna(row.get("ANSWER")) else "",
                "DIFFICULTY": str(row.get("DIFFICULTY", "")) if pd.notna(row.get("DIFFICULTY")) else "",
                "CREATED_DATE": str(row.get("CREATED_DATE", "")) if pd.notna(row.get("CREATED_DATE")) else "",
                "MODIFIED_DATE": str(row.get("MODIFIED_DATE", "")) if pd.notna(row.get("MODIFIED_DATE")) else ""
            }
            
            questions.append(question_data)
            
            # 진행 상황 표시 (100개마다)
            if total_questions % 100 == 0:
                print(f"📊 처리 중... {total_questions}개 완료")
        
        # 4. GEP V1.0 JSON 구조 생성
        gep_data = {
            "metadata": {
                "version": "GEP V1.0",
                "conversion_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_questions": total_questions,
                "description": "손해보험중개사 시험 대비 문제 데이터베이스 (Excel 직접 변환)",
                "source_file": "GEP_MASTER_V1.0.xlsx",
                "conversion_method": "Excel to JSON Direct",
                "last_update": datetime.now().isoformat(),
                "backup_file": os.path.basename(backup_file) if os.path.exists(backup_file) else None
            },
            "questions": questions
        }
        
        # 5. JSON 파일 저장
        print("💾 JSON 파일 저장 중...")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(gep_data, f, ensure_ascii=False, indent=2)
        
        # 6. 결과 출력
        print(f"✅ 변환 완료!")
        print(f"📁 출력 파일: {json_file}")
        print(f"📊 총 문제 수: {total_questions}개")
        print(f"📏 파일 크기: {os.path.getsize(json_file)} bytes")
        
        # 7. 데이터 품질 검증
        print("\n🔍 데이터 품질 검증:")
        
        # QCODE 체계 확인
        qcodes = [q["QCODE"] for q in questions if q["QCODE"]]
        unique_qcodes = len(set(qcodes))
        print(f"  - 고유 QCODE 수: {unique_qcodes}")
        
        # QUESTION 필드 길이 확인
        question_lengths = [len(q["QUESTION"]) for q in questions if q["QUESTION"]]
        if question_lengths:
            avg_length = sum(question_lengths) / len(question_lengths)
            print(f"  - 평균 QUESTION 길이: {avg_length:.1f} 문자")
            print(f"  - 최대 QUESTION 길이: {max(question_lengths)} 문자")
        
        # ANSWER 형식 확인
        answers = [q["ANSWER"] for q in questions if q["ANSWER"]]
        unique_answers = set(answers)
        print(f"  - 고유 ANSWER 값: {sorted(unique_answers)}")
        
        # 8. 변경 사항 요약 (백업이 있는 경우)
        if os.path.exists(backup_file):
            with open(backup_file, 'r', encoding='utf-8') as f:
                old_data = json.load(f)
                old_count = old_data['metadata']['total_questions']
                
                if total_questions > old_count:
                    print(f"\n📈 추가된 문제: {total_questions - old_count}개")
                elif total_questions < old_count:
                    print(f"\n📉 삭제된 문제: {old_count - total_questions}개")
                else:
                    print(f"\n📝 문제 수 동일: {total_questions}개 (내용 수정됨)")
        
        # 9. 샘플 데이터 확인
        if questions:
            print(f"\n📋 첫 번째 문제 샘플:")
            print(f"  QCODE: {questions[0]['QCODE']}")
            print(f"  QUESTION 길이: {len(questions[0]['QUESTION'])} 문자")
            print(f"  ANSWER: {questions[0]['ANSWER']}")
            print(f"  LAYER1: {questions[0]['LAYER1']}")
        
        return True
        
    except Exception as e:
        print(f"❌ 변환 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_excel_reading():
    """엑셀 파일 읽기 테스트"""
    print("🧪 엑셀 파일 읽기 테스트...")
    
    excel_file = "참고자료/GEP_MASTER_V1.0.xlsx"
    
    try:
        # 엑셀 파일 정보 확인
        df = pd.read_excel(excel_file, engine='openpyxl')
        
        print(f"✅ 엑셀 파일 읽기 성공!")
        print(f"📊 파일 정보:")
        print(f"  - 행 수: {len(df)}")
        print(f"  - 열 수: {len(df.columns)}")
        print(f"  - 열 이름: {list(df.columns)}")
        
        # 첫 번째 행 샘플
        print(f"\n📋 첫 번째 행 샘플:")
        first_row = df.iloc[0]
        for col in df.columns:
            value = first_row[col]
            if pd.notna(value):
                print(f"  {col}: {str(value)[:50]}...")
            else:
                print(f"  {col}: (빈 값)")
        
        return True
        
    except Exception as e:
        print(f"❌ 엑셀 파일 읽기 실패: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Excel to GEP JSON 직접 변환 도구")
    print("=" * 60)
    
    # 1. 엑셀 파일 읽기 테스트
    if not test_excel_reading():
        print("💥 엑셀 파일 읽기 테스트 실패")
        exit(1)
    
    print("\n" + "=" * 60)
    
    # 2. 실제 변환 실행
    success = excel_to_gep_json()
    
    if success:
        print("\n🎉 Excel to GEP JSON 직접 변환 성공!")
        print("📝 다음 단계: 변환된 JSON 파일 검증")
    else:
        print("\n💥 변환 실패")
    
    print("\n📋 사용법:")
    print("1. 조대표님이 GEP_MASTER_V1.0.xlsx 파일 수정")
    print("2. 서대리가 이 스크립트 실행: python excel_to_gep_json.py")
    print("3. 자동으로 백업 생성 후 JSON 파일 업데이트")
    print("4. 데이터 품질 검증 및 변경 사항 요약 출력")
