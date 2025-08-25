import csv
import json
import os
from datetime import datetime

def convert_csv_to_gep_json():
    """
    GEP_MASTER_V1.0.csv 파일을 GEP V1.0 JSON 구조로 변환합니다.
    QUESTION 필드는 절대 수정하지 않고 그대로 전달합니다.
    """
    
    print("🚀 CSV to GEP JSON 변환 시작...")
    
    # 입력 파일 경로
    csv_file = "참고자료/GEP_MASTER_V1.0.csv"
    output_file = "static/data/gep_master_v1.0.json"
    
    # CSV 파일 존재 확인
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일을 찾을 수 없습니다: {csv_file}")
        return False
    
    try:
        # CSV 파일 읽기
        questions = []
        total_questions = 0
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                total_questions += 1
                
                # GEP V1.0 구조에 맞게 데이터 변환
                question_data = {
                    "INDEX": row.get("INDEX", ""),
                    "ETITLE": row.get("ETITLE", ""),
                    "ECLASS": row.get("ECLASS", ""),
                    "QCODE": row.get("QCODE", ""),
                    "EROUND": row.get("EROUND", ""),
                    "LAYER1": row.get("LAYER1", ""),
                    "LAYER2": row.get("LAYER2", ""),
                    "LAYER3": row.get("LAYER3", ""),
                    "QNUM": row.get("QNUM", ""),
                    "QTYPE": row.get("QTYPE", ""),
                    "QUESTION": row.get("QUESTION", ""),  # 절대 수정 금지
                    "ANSWER": row.get("ANSWER", ""),
                    "DIFFICULTY": row.get("DIFFICULTY", ""),
                    "CREATED_DATE": row.get("CREATED_DATE", ""),
                    "MODIFIED_DATE": row.get("MODIFIED_DATE", "")
                }
                
                questions.append(question_data)
                
                # 진행 상황 표시 (100개마다)
                if total_questions % 100 == 0:
                    print(f"📊 처리 중... {total_questions}개 완료")
        
        # GEP V1.0 JSON 구조 생성
        gep_data = {
            "metadata": {
                "version": "GEP V1.0",
                "created_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_questions": total_questions,
                "description": "손해보험중개사 시험 대비 문제 데이터베이스",
                "source_file": "GEP_MASTER_V1.0.csv",
                "conversion_date": datetime.now().isoformat()
            },
            "questions": questions
        }
        
        # JSON 파일 저장
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gep_data, f, ensure_ascii=False, indent=2)
        
        # 결과 출력
        print(f"✅ 변환 완료!")
        print(f"📁 출력 파일: {output_file}")
        print(f"📊 총 문제 수: {total_questions}개")
        print(f"📏 파일 크기: {os.path.getsize(output_file)} bytes")
        
        # 샘플 데이터 확인
        if questions:
            print(f"\n📋 첫 번째 문제 샘플:")
            print(f"  QCODE: {questions[0]['QCODE']}")
            print(f"  QUESTION 길이: {len(questions[0]['QUESTION'])} 문자")
            print(f"  ANSWER: {questions[0]['ANSWER']}")
        
        return True
        
    except Exception as e:
        print(f"❌ 변환 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    success = convert_csv_to_gep_json()
    
    if success:
        print("\n🎉 CSV to GEP JSON 변환 성공!")
        print("📝 다음 단계: 변환된 JSON 파일 검증")
    else:
        print("\n💥 변환 실패")
