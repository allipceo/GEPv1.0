import csv
import json
import os
import shutil
from datetime import datetime

def update_gep_data():
    """
    수정된 CSV 파일로 GEP JSON 데이터를 업데이트합니다.
    기존 파일 백업 후 새로운 데이터로 교체합니다.
    """
    
    print("🔄 GEP 데이터 업데이트 시작...")
    
    # 파일 경로
    csv_file = "참고자료/GEP_MASTER_V1.0.csv"
    json_file = "static/data/gep_master_v1.0.json"
    backup_file = f"static/data/gep_master_v1.0_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    # CSV 파일 존재 확인
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일을 찾을 수 없습니다: {csv_file}")
        return False
    
    try:
        # 1. 기존 JSON 파일 백업
        if os.path.exists(json_file):
            shutil.copy2(json_file, backup_file)
            print(f"✅ 기존 파일 백업 완료: {backup_file}")
        
        # 2. CSV 파일 읽기 및 변환
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
        
        # 3. GEP V1.0 JSON 구조 생성
        gep_data = {
            "metadata": {
                "version": "GEP V1.0",
                "updated_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_questions": total_questions,
                "description": "손해보험중개사 시험 대비 문제 데이터베이스 (업데이트됨)",
                "source_file": "GEP_MASTER_V1.0.csv",
                "last_update": datetime.now().isoformat(),
                "backup_file": os.path.basename(backup_file) if os.path.exists(backup_file) else None
            },
            "questions": questions
        }
        
        # 4. JSON 파일 저장
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(gep_data, f, ensure_ascii=False, indent=2)
        
        # 5. 결과 출력
        print(f"✅ 업데이트 완료!")
        print(f"📁 업데이트된 파일: {json_file}")
        print(f"📊 총 문제 수: {total_questions}개")
        print(f"📏 파일 크기: {os.path.getsize(json_file)} bytes")
        
        # 6. 변경 사항 요약
        if os.path.exists(backup_file):
            with open(backup_file, 'r', encoding='utf-8') as f:
                old_data = json.load(f)
                old_count = old_data['metadata']['total_questions']
                
                if total_questions > old_count:
                    print(f"📈 추가된 문제: {total_questions - old_count}개")
                elif total_questions < old_count:
                    print(f"📉 삭제된 문제: {old_count - total_questions}개")
                else:
                    print(f"📝 문제 수 동일: {total_questions}개 (내용 수정됨)")
        
        return True
        
    except Exception as e:
        print(f"❌ 업데이트 중 오류 발생: {e}")
        return False

def show_update_help():
    """업데이트 프로세스 도움말"""
    print("\n📋 GEP 데이터 업데이트 프로세스:")
    print("1. 조대표님이 GEP_MASTER_V1.0.xlsx 파일 수정")
    print("2. 엑셀 파일을 CSV로 저장 (참고자료 폴더)")
    print("3. 서대리가 이 스크립트 실행: python update_gep_data.py")
    print("4. 자동으로 백업 생성 후 JSON 파일 업데이트")
    print("5. 변경 사항 요약 출력")

if __name__ == "__main__":
    print("🚀 GEP 데이터 업데이트 도구")
    print("=" * 50)
    
    success = update_gep_data()
    
    if success:
        print("\n🎉 GEP 데이터 업데이트 성공!")
        print("📝 다음 단계: 업데이트된 데이터 검증")
    else:
        print("\n💥 업데이트 실패")
    
    show_update_help()
