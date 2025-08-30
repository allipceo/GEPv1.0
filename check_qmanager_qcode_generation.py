import json
import os

def check_qmanager_qcode_generation():
    """Q매니저에서 진위형 문제의 QCODE 생성 로직 확인"""
    
    print("=== Q매니저 진위형 문제 QCODE 생성 로직 확인 ===")
    
    # Q매니저 파일 확인
    qmanager_file = 'static/data/qmanager_questions.json'
    
    if not os.path.exists(qmanager_file):
        print(f"❌ Q매니저 파일이 존재하지 않습니다: {qmanager_file}")
        return
    
    try:
        with open(qmanager_file, encoding='utf-8') as f:
            qmanager_data = json.load(f)
        
        print(f"✅ Q매니저 파일 읽기 성공")
        
        questions = qmanager_data.get('questions', {})
        print(f"📊 총 기출문제 수: {len(questions)}개")
        
        if not questions:
            print(f"📝 Q매니저에 데이터가 없습니다. 샘플 데이터를 생성하여 테스트해보겠습니다.")
            create_sample_qmanager_data()
            return
        
        # QCODE 생성 로직 검증
        print(f"\n🔍 QCODE 생성 로직 검증:")
        
        for source_qcode, question_data in questions.items():
            print(f"\n📋 부모 문제: {source_qcode}")
            
            slots = question_data.get('slots', {})
            filled_slots = 0
            
            for slot_name, slot_data in slots.items():
                if slot_data.get('exists', False):
                    filled_slots += 1
                    
                    # 예상되는 진위형 문제 QCODE
                    expected_qcode = f"{source_qcode}-{slot_name}"
                    
                    print(f"   ✅ 슬롯 {slot_name}: {expected_qcode}")
                    print(f"      문제: {slot_data.get('question', 'N/A')[:50]}...")
                    print(f"      답: {slot_data.get('answer', 'N/A')}")
            
            if filled_slots == 0:
                print(f"   📭 채워진 슬롯 없음")
        
        # QCODE 패턴 분석
        print(f"\n🔍 QCODE 패턴 분석:")
        
        all_derived_qcodes = []
        for source_qcode, question_data in questions.items():
            slots = question_data.get('slots', {})
            for slot_name, slot_data in slots.items():
                if slot_data.get('exists', False):
                    derived_qcode = f"{source_qcode}-{slot_name}"
                    all_derived_qcodes.append(derived_qcode)
        
        print(f"   📊 총 진위형 문제 수: {len(all_derived_qcodes)}개")
        
        if all_derived_qcodes:
            print(f"   📋 진위형 문제 QCODE 예시:")
            for i, qcode in enumerate(all_derived_qcodes[:10]):
                print(f"      {i+1}. {qcode}")
            
            # 패턴 검증
            print(f"\n✅ QCODE 패턴 검증:")
            
            # AB20AA-01-B1 형태인지 확인
            valid_patterns = 0
            invalid_patterns = 0
            
            for qcode in all_derived_qcodes:
                if '-' in qcode and qcode.count('-') == 2:
                    parts = qcode.split('-')
                    if len(parts) == 3:
                        base = parts[0]  # AB20AA
                        number = parts[1]  # 01
                        slot = parts[2]  # B1
                        
                        if (len(base) == 6 and 
                            base.startswith('AB') and 
                            number.isdigit() and 
                            slot.startswith('B') and 
                            slot[1:].isdigit()):
                            valid_patterns += 1
                        else:
                            invalid_patterns += 1
                            print(f"   ❌ 잘못된 패턴: {qcode}")
                    else:
                        invalid_patterns += 1
                        print(f"   ❌ 잘못된 형식: {qcode}")
                else:
                    invalid_patterns += 1
                    print(f"   ❌ 하이픈 부족: {qcode}")
            
            print(f"   ✅ 올바른 패턴: {valid_patterns}개")
            print(f"   ❌ 잘못된 패턴: {invalid_patterns}개")
            
            if invalid_patterns == 0:
                print(f"   🎉 모든 QCODE가 올바른 패턴을 따릅니다!")
            else:
                print(f"   ⚠️ 일부 QCODE 패턴이 잘못되었습니다.")
        
    except Exception as e:
        print(f"❌ 파일 읽기 실패: {e}")

def create_sample_qmanager_data():
    """샘플 Q매니저 데이터 생성 (테스트용)"""
    print(f"\n🧪 샘플 Q매니저 데이터 생성...")
    
    sample_data = {
        "metadata": {
            "version": "QManager Questions V1.0",
            "created_date": "2025-08-30",
            "description": "QManager로 관리되는 진위형 문제 데이터베이스",
            "total_questions": 4,
            "last_update": "2025-08-30T12:00:00"
        },
        "questions": {
            "AB20AA-01": {
                "source_qcode": "AB20AA-01",
                "slots": {
                    "B1": {
                        "question": "보험업법 제1조에 따라 보험업을 영위하려면 금융위원회의 허가를 받아야 한다.",
                        "answer": "O",
                        "exists": True,
                        "created_date": "2025-08-30T12:00:00",
                        "modified_date": "2025-08-30T12:00:00"
                    },
                    "B2": {
                        "question": "보험계약은 계약자와 보험자 간의 합의로만 성립한다.",
                        "answer": "X",
                        "exists": True,
                        "created_date": "2025-08-30T12:00:00",
                        "modified_date": "2025-08-30T12:00:00"
                    },
                    "B3": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B4": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B5": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B6": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B7": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B8": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    }
                },
                "metadata": {
                    "total_slots": 8,
                    "filled_slots": 2,
                    "last_updated": "2025-08-30T12:00:00"
                }
            },
            "AB20AA-02": {
                "source_qcode": "AB20AA-02",
                "slots": {
                    "B1": {
                        "question": "상법에 따라 주식회사의 최소 자본금은 1억원이다.",
                        "answer": "O",
                        "exists": True,
                        "created_date": "2025-08-30T12:00:00",
                        "modified_date": "2025-08-30T12:00:00"
                    },
                    "B2": {
                        "question": "회계재무에서 자산은 항상 부채보다 크다.",
                        "answer": "X",
                        "exists": True,
                        "created_date": "2025-08-30T12:00:00",
                        "modified_date": "2025-08-30T12:00:00"
                    },
                    "B3": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B4": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B5": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B6": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B7": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    },
                    "B8": {
                        "question": "",
                        "answer": "",
                        "exists": False,
                        "created_date": None,
                        "modified_date": None
                    }
                },
                "metadata": {
                    "total_slots": 8,
                    "filled_slots": 2,
                    "last_updated": "2025-08-30T12:00:00"
                }
            }
        }
    }
    
    # 샘플 데이터 저장
    with open('static/data/qmanager_questions.json', 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 샘플 데이터 생성 완료")
    print(f"📁 저장 위치: static/data/qmanager_questions.json")
    
    # 생성된 데이터로 다시 검증
    print(f"\n🔄 생성된 데이터로 QCODE 검증...")
    check_qmanager_qcode_generation()

if __name__ == "__main__":
    check_qmanager_qcode_generation()
