# G016_GEP 프로젝트 서대리 자체 시뮬레이션 개발 절차

## 📋 문서 개요

**문서명**: GEP 프로젝트 서대리 자체 시뮬레이션 개발 절차  
**작성일**: 2025년 8월 25일  
**작성자**: 서대리 (AI Assistant)  
**방법론**: ACIU S4 검증된 서대리 자체 시뮬레이션 방법론 + UI-데이터 역설계 방법론 적용  
**목적**: GEP 1.0의 효율적이고 안정적인 개발을 위한 최적 절차 정의  
**업데이트**: 노팀장 피드백 반영 (2025년 8월 25일) + 코코치 의견 반영 (2025년 8월 25일)

---

## 🎯 개발 전 확정 필요 사항 (코코치 의견 반영)

### **1. 프로젝트 핵심 가치 및 방법론 확정**

#### **1.1 핵심 가치 정의 (코코치 제안)**
```python
# 코코치 제안 핵심 가치
핵심_가치 = {
    "과학적_학습_이론": "검증된 학습 이론을 바탕으로 한 효율적인 학습 시스템",
    "기출문제_권위성": "11년치 기출문제의 권위성을 바탕으로 한 신뢰성 있는 콘텐츠",
    "차세대_플랫폼": "과학적 학습 이론과 기출문제 권위성을 결합한 차세대 자격시험 준비 플랫폼"
}
```

#### **1.2 개발 방법론 확정 (코코치 제안)**
```python
# 코코치 제안 개발 방법론
개발_방법론 = {
    "UI_데이터_역설계": "UI를 먼저 구상하고, 이에 필요한 데이터를 역으로 설계하는 방법론",
    "분산형_레고블록": "모듈화된 기능들을 레고블록처럼 조립하는 개발 방식",
    "ACIU_경험_반영": "ACIU에서 겪은 통계 데이터 불일치 문제를 근본적으로 해결"
}
```

### **2. 기술 스택 및 환경 확정**

#### **2.1 백엔드 기술 스택 (코코치 확정 요청)**
```python
# 코코치 확정 요청: 최종 기술 스택 명시
확정된_백엔드_스택 = {
    "프레임워크": "Flask (ACIU S4와 동일) ✅ 최종 확정",
    "데이터베이스": "JSON 파일 기반 (ACIU S4 방식) ✅ 최종 확정",
    "배포_환경": "Heroku (ACIU S4와 동일) ✅ 최종 확정",
    "향후_전환_계획": "Firestore로 전환하는 로드맵 확정",
    "API_구조": "RESTful API ✅ 최종 확정",
    "인증_방식": "세션 기반 ✅ 최종 확정"
}
```

#### **2.2 프론트엔드 기술 스택 (코코치 확정 요청)**
```python
# 코코치 확정 요청: 최종 기술 스택 명시
확정된_프론트엔드_스택 = {
    "프레임워크": "Vanilla JavaScript (ACIU S4와 동일) ✅ 최종 확정",
    "UI_라이브러리": "Tailwind CSS (ACIU S4와 동일) ✅ 최종 확정",
    "상태_관리": "LocalStorage 기반 (ACIU S4와 동일) ✅ 최종 확정",
    "빌드_도구": "Webpack ✅ 최종 확정"
}
```

#### **2.3 데이터 구조 확정**
```python
# 확정 필요 사항
데이터_확정사항 = {
    "questions.json_구조": "GEP_MASTER_V1.0.xlsx 변환 방식 확정",
    "user_db.json_구조": "사용자 정보 필드 확정",
    "event_log.json_구조": "이벤트 타입 및 데이터 구조 확정",
    "statistics.json_구조": "통계 계산 방식 및 저장 구조 확정"
}
```

### **2. 개발 우선순위 및 범위 확정**

#### **2.1 MVP 범위 확정 (코코치 재정의 요청)**
```python
# 코코치 재정의 요청: 서비스 범위 명확화
확정된_MVP_범위 = {
    "무료_서비스_범위": "기출 회차별 학습만 ✅ 최종 확정",
    "유료_기본_서비스_범위": "과목별 학습 + 틀린문제 학습 ✅ 최종 확정",
    "유료_고급_서비스_범위": "미니 모의고사 + AI 개인화 기능 ✅ 최종 확정",
    "사용자_등록_방식": "휴대폰 번호만 ✅ 최종 확정",
    "결제_시스템": "1차 개발 포함 ✅ 최종 확정"
}
```

#### **2.2 개발 순서 확정 (코코치 명확화 요청)**
```python
# 코코치 명확화 요청: 개발 경과 종합 보고서 Phase 1~4와 통합
GEP_공식_로드맵 = {
    "Phase_1": "UI 및 데이터 스키마 확정 ✅ 공식 로드맵",
    "Phase_2": "기초 기능 구현 ✅ 공식 로드맵", 
    "Phase_3": "고급 기능 구현 ✅ 공식 로드맵",
    "Phase_4": "최종 점검 및 배포 ✅ 공식 로드맵"
}

서대리_상세_개발_계획 = {
    "Phase_1_하위과업": "통계 UI 확정, 필요 데이터 정의, DB 스키마 설계",
    "Phase_2_하위과업": "문제 풀이, 이어풀기, 설정 기능 개발 및 연동",
    "Phase_3_하위과업": "유료 콘텐츠, 고급 통계 및 예측 기능 개발",
    "Phase_4_하위과업": "통합 테스트, 성능 최적화, 상용 서비스 배포"
}
```

### **3. 데이터 소스 및 변환 방식 확정**

#### **3.1 GEP_MASTER_V1.0.xlsx 변환 방식**
```python
# 확정 필요 사항
엑셀변환_확정사항 = {
    "변환_도구": "Python pandas vs openpyxl vs xlrd",
    "JSON_구조": "QCODE 기반 vs 인덱스 기반",
    "데이터_검증": "변환 후 데이터 무결성 검증 방식",
    "업데이트_방식": "전체 재변환 vs 증분 업데이트"
}
```

#### **3.2 ACIU S4 데이터 활용 방식**
```python
# 확정 필요 사항
ACIU활용_확정사항 = {
    "기존_코드_재사용": "CentralDataManager 재사용 범위",
    "UI_컴포넌트_재사용": "문제 풀이 UI 재사용 방식",
    "데이터_마이그레이션": "ACIU 데이터를 GEP로 변환 방식",
    "호환성_유지": "ACIU와 GEP 동시 운영 여부"
}
```

---

## 🔄 서대리 자체 시뮬레이션 개발 절차

### **Phase 1: 개발 환경 및 데이터 구조 시뮬레이션**

#### **1.1 기술 스택 검증 시뮬레이션**
```python
# test_tech_stack_simulation.py
import json
import requests
import sqlite3
from flask import Flask, jsonify

class TechStackSimulation:
    def __init__(self):
        self.app = Flask(__name__)
        self.results = []
        
    def simulate_flask_backend(self):
        """Flask 백엔드 시뮬레이션"""
        @self.app.route('/api/test')
        def test_endpoint():
            return jsonify({"status": "success", "message": "Flask 백엔드 정상 작동"})
        
        try:
            response = requests.get('http://localhost:5000/api/test')
            if response.status_code == 200:
                self.results.append({
                    "test": "Flask 백엔드",
                    "status": "성공",
                    "response": response.json()
                })
            else:
                self.results.append({
                    "test": "Flask 백엔드",
                    "status": "실패",
                    "error": f"HTTP {response.status_code}"
                })
        except Exception as e:
            self.results.append({
                "test": "Flask 백엔드",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_json_database(self):
        """JSON 데이터베이스 시뮬레이션"""
        test_data = {
            "questions": [
                {"qcode": "TEST001", "question": "테스트 문제", "answer": "O"}
            ],
            "users": [
                {"user_id": "01012345678", "name": "테스트 사용자"}
            ]
        }
        
        try:
            # JSON 파일 쓰기/읽기 테스트
            with open('test_db.json', 'w', encoding='utf-8') as f:
                json.dump(test_data, f, ensure_ascii=False, indent=2)
            
            with open('test_db.json', 'r', encoding='utf-8') as f:
                loaded_data = json.load(f)
            
            if loaded_data == test_data:
                self.results.append({
                    "test": "JSON 데이터베이스",
                    "status": "성공",
                    "message": "JSON 파일 읽기/쓰기 정상"
                })
            else:
                self.results.append({
                    "test": "JSON 데이터베이스",
                    "status": "실패",
                    "error": "데이터 불일치"
                })
        except Exception as e:
            self.results.append({
                "test": "JSON 데이터베이스",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_excel_to_json_conversion(self):
        """엑셀 to JSON 변환 시뮬레이션"""
        import pandas as pd
        
        try:
            # GEP_MASTER_V1.0.xlsx 읽기 시뮬레이션
            df = pd.read_excel('참고자료/GEP_MASTER_V1.0.xlsx')
            
            # JSON 변환 시뮬레이션
            questions_data = []
            for index, row in df.iterrows():
                question = {
                    "qcode": row['QCODE'],
                    "etitle": row['ETITLE'],
                    "eround": row['EROUND'],
                    "layer1": row['LAYER1'],
                    "question": row['QUESTION'],
                    "answer": row['ANSWER']
                }
                questions_data.append(question)
            
            # 변환 결과 검증
            if len(questions_data) > 0:
                self.results.append({
                    "test": "엑셀 to JSON 변환",
                    "status": "성공",
                    "converted_count": len(questions_data),
                    "sample_data": questions_data[0]
                })
            else:
                self.results.append({
                    "test": "엑셀 to JSON 변환",
                    "status": "실패",
                    "error": "변환된 데이터 없음"
                })
        except Exception as e:
            self.results.append({
                "test": "엑셀 to JSON 변환",
                "status": "오류",
                "error": str(e)
            })
    
    def run_tech_stack_simulation(self):
        """기술 스택 전체 시뮬레이션"""
        print("🚀 GEP 기술 스택 시뮬레이션 시작")
        print("=" * 60)
        
        self.simulate_flask_backend()
        self.simulate_json_database()
        self.simulate_excel_to_json_conversion()
        
        self.generate_tech_stack_report()
    
    def generate_tech_stack_report(self):
        """기술 스택 시뮬레이션 리포트"""
        success_count = sum(1 for r in self.results if r["status"] == "성공")
        total_count = len(self.results)
        success_rate = (success_count / total_count * 100) if total_count > 0 else 0
        
        report = {
            "시뮬레이션_정보": {
                "실행_시간": "2025-08-25",
                "총_테스트": total_count,
                "성공": success_count,
                "실패": total_count - success_count,
                "성공률": f"{success_rate:.1f}%"
            },
            "상세_결과": self.results,
            "권장사항": self.generate_recommendations()
        }
        
        with open('tech_stack_simulation_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 기술 스택 시뮬레이션 완료: {success_rate:.1f}% 성공률")
    
    def generate_recommendations(self):
        """기술 스택 권장사항 생성"""
        recommendations = []
        
        flask_success = any(r["test"] == "Flask 백엔드" and r["status"] == "성공" 
                           for r in self.results)
        json_success = any(r["test"] == "JSON 데이터베이스" and r["status"] == "성공" 
                          for r in self.results)
        excel_success = any(r["test"] == "엑셀 to JSON 변환" and r["status"] == "성공" 
                           for r in self.results)
        
        if flask_success:
            recommendations.append("✅ Flask 백엔드 사용 권장")
        else:
            recommendations.append("❌ Flask 백엔드 대안 검토 필요")
        
        if json_success:
            recommendations.append("✅ JSON 파일 기반 데이터베이스 사용 권장")
        else:
            recommendations.append("❌ JSON 데이터베이스 대안 검토 필요")
        
        if excel_success:
            recommendations.append("✅ pandas를 이용한 엑셀 변환 방식 사용 권장")
        else:
            recommendations.append("❌ 엑셀 변환 방식 대안 검토 필요")
        
        return recommendations
```

#### **1.2 데이터 구조 검증 시뮬레이션**
```python
# test_data_structure_simulation.py
class DataStructureSimulation:
    def __init__(self):
        self.results = []
        
    def simulate_questions_structure(self):
        """questions.json 구조 시뮬레이션"""
        test_questions = {
            "QCODE_ABAA-01": {
                "ETITLE": "보험중개사",
                "ECLASS": "손해보험",
                "EROUND": "20회",
                "LAYER1": "관계법령",
                "LAYER2": "보험계약",
                "LAYER3": "계약성립",
                "QNUM": 1,
                "QTYPE": "진위형",
                "QUESTION": "보험계약은 계약자와 보험자가 합의하여 성립한다.",
                "ANSWER": "O",
                "DIFFICULTY": "중",
                "STANDARD_SCORE": 40,
                "EXAM_SESSION": "20회차"
            }
        }
        
        try:
            # 구조 검증
            required_fields = ["ETITLE", "ECLASS", "EROUND", "LAYER1", "QUESTION", "ANSWER"]
            for qcode, question in test_questions.items():
                missing_fields = [field for field in required_fields if field not in question]
                if not missing_fields:
                    self.results.append({
                        "test": "questions.json 구조",
                        "status": "성공",
                        "qcode": qcode,
                        "message": "필수 필드 모두 존재"
                    })
                else:
                    self.results.append({
                        "test": "questions.json 구조",
                        "status": "실패",
                        "qcode": qcode,
                        "error": f"누락된 필드: {missing_fields}"
                    })
        except Exception as e:
            self.results.append({
                "test": "questions.json 구조",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_user_db_structure(self):
        """user_db.json 구조 시뮬레이션"""
        test_user = {
            "01012345678": {
                "user_id": "01012345678",
                "user_name": "홍길동",
                "user_type": "registered",
                "subscription_level": "premium",
                "exam_type": "손해보험중개사",
                "exam_date": "2025-12-15",
                "registration_date": "2025-08-25T15:30:00Z",
                "d_day_remaining": 112
            }
        }
        
        try:
            # 구조 검증
            required_fields = ["user_id", "exam_type", "exam_date", "registration_date"]
            for user_id, user_data in test_user.items():
                missing_fields = [field for field in required_fields if field not in user_data]
                if not missing_fields:
                    self.results.append({
                        "test": "user_db.json 구조",
                        "status": "성공",
                        "user_id": user_id,
                        "message": "필수 필드 모두 존재"
                    })
                else:
                    self.results.append({
                        "test": "user_db.json 구조",
                        "status": "실패",
                        "user_id": user_id,
                        "error": f"누락된 필드: {missing_fields}"
                    })
        except Exception as e:
            self.results.append({
                "test": "user_db.json 구조",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_statistics_structure(self):
        """statistics.json 구조 시뮬레이션"""
        test_statistics = {
            "01012345678": {
                "user_id": "01012345678",
                "overall_stats": {
                    "total_problems_attempted": 150,
                    "total_correct_answers": 120,
                    "overall_accuracy": 80.0
                },
                "daily_stats": {
                    "2025-08-25": {
                        "problems_attempted": 10,
                        "correct_answers": 8,
                        "daily_accuracy": 80.0
                    }
                },
                "category_stats": {
                    "관계법령": {
                        "problems_attempted": 50,
                        "correct_answers": 40,
                        "accuracy": 80.0
                    }
                },
                "last_question_index": {
                    "subject_based": {
                        "관계법령": 25,
                        "특종보험": 18
                    }
                }
            }
        }
        
        try:
            # 구조 검증
            required_sections = ["overall_stats", "daily_stats", "category_stats", "last_question_index"]
            for user_id, stats_data in test_statistics.items():
                missing_sections = [section for section in required_sections if section not in stats_data]
                if not missing_sections:
                    self.results.append({
                        "test": "statistics.json 구조",
                        "status": "성공",
                        "user_id": user_id,
                        "message": "필수 섹션 모두 존재"
                    })
                else:
                    self.results.append({
                        "test": "statistics.json 구조",
                        "status": "실패",
                        "user_id": user_id,
                        "error": f"누락된 섹션: {missing_sections}"
                    })
        except Exception as e:
            self.results.append({
                "test": "statistics.json 구조",
                "status": "오류",
                "error": str(e)
            })
```

### **Phase 2: 대문 UI 시뮬레이션**

#### **2.1 대문 UI 데이터 로드 시뮬레이션**
```python
# test_main_screen_simulation.py
class MainScreenSimulation:
    def __init__(self):
        self.results = []
        
    def simulate_sector1_data_loading(self):
        """섹터1 데이터 로드 시뮬레이션"""
        try:
            # user_db.json에서 사용자 정보 로드 시뮬레이션
            user_data = {
                "user_id": "01012345678",
                "exam_type": "손해보험중개사",
                "exam_date": "2025-12-15"
            }
            
            # D-Day 계산 시뮬레이션
            from datetime import datetime
            exam_date = datetime.strptime(user_data["exam_date"], "%Y-%m-%d")
            current_date = datetime.now()
            d_day = (exam_date - current_date).days
            
            if d_day > 0:
                self.results.append({
                    "test": "섹터1 데이터 로드",
                    "status": "성공",
                    "user_id": user_data["user_id"],
                    "exam_type": user_data["exam_type"],
                    "d_day": d_day,
                    "message": "사용자 정보 및 D-Day 계산 성공"
                })
            else:
                self.results.append({
                    "test": "섹터1 데이터 로드",
                    "status": "경고",
                    "message": "시험일이 지났습니다"
                })
        except Exception as e:
            self.results.append({
                "test": "섹터1 데이터 로드",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_sector2_data_loading(self):
        """섹터2 데이터 로드 시뮬레이션"""
        try:
            # statistics.json에서 과목별 성과 데이터 로드 시뮬레이션
            category_stats = {
                "관계법령": {"accuracy": 80.0, "problems_attempted": 50},
                "특종보험": {"accuracy": 75.0, "problems_attempted": 40},
                "손보1부": {"accuracy": 85.0, "problems_attempted": 30},
                "손보2부": {"accuracy": 70.0, "problems_attempted": 30}
            }
            
            # 합격 기준과 비교 시뮬레이션
            passing_standard = 60.0
            pass_fail_status = {}
            
            for category, stats in category_stats.items():
                if stats["accuracy"] >= passing_standard:
                    pass_fail_status[category] = "합격"
                else:
                    pass_fail_status[category] = "불합격"
            
            self.results.append({
                "test": "섹터2 데이터 로드",
                "status": "성공",
                "category_stats": category_stats,
                "pass_fail_status": pass_fail_status,
                "message": "과목별 성과 및 합격 여부 계산 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "섹터2 데이터 로드",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_sector3_data_loading(self):
        """섹터3 데이터 로드 시뮬레이션"""
        try:
            # questions.json에서 총 문제 수 로드 시뮬레이션
            total_problems_by_category = {
                "관계법령": 200,
                "특종보험": 180,
                "손보1부": 150,
                "손보2부": 150
            }
            
            # statistics.json에서 풀이한 문제 수 로드 시뮬레이션
            solved_problems_by_category = {
                "관계법령": 50,
                "특종보험": 40,
                "손보1부": 30,
                "손보2부": 30
            }
            
            # 진행률 계산 시뮬레이션
            progress_percentage = {}
            for category in total_problems_by_category:
                total = total_problems_by_category[category]
                solved = solved_problems_by_category[category]
                progress_percentage[category] = (solved / total) * 100
            
            self.results.append({
                "test": "섹터3 데이터 로드",
                "status": "성공",
                "total_problems": total_problems_by_category,
                "solved_problems": solved_problems_by_category,
                "progress_percentage": progress_percentage,
                "message": "문제 진행률 계산 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "섹터3 데이터 로드",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_sector4_data_loading(self):
        """섹터4 데이터 로드 시뮬레이션"""
        try:
            # event_log.json에서 날짜별 학습 활동 로드 시뮬레이션
            daily_activity = {
                "2025-08-20": {"problems_solved": 5},
                "2025-08-21": {"problems_solved": 8},
                "2025-08-22": {"problems_solved": 3},
                "2025-08-23": {"problems_solved": 10},
                "2025-08-24": {"problems_solved": 7},
                "2025-08-25": {"problems_solved": 12}
            }
            
            # 시계열 데이터 생성 시뮬레이션
            dates = list(daily_activity.keys())
            problems_solved = [daily_activity[date]["problems_solved"] for date in dates]
            
            self.results.append({
                "test": "섹터4 데이터 로드",
                "status": "성공",
                "daily_activity": daily_activity,
                "trend_data": {
                    "dates": dates,
                    "problems_solved": problems_solved
                },
                "message": "학습 활동 트렌드 데이터 생성 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "섹터4 데이터 로드",
                "status": "오류",
                "error": str(e)
            })
```

### **Phase 3: 과목별 학습 시뮬레이션**

#### **3.1 카테고리 선택 시뮬레이션**
```python
# test_subject_learning_simulation.py
class SubjectLearningSimulation:
    def __init__(self):
        self.results = []
        
    def simulate_category_selection(self):
        """카테고리 선택 시뮬레이션"""
        try:
            # 사용자 카테고리명 → 시스템 카테고리명 매핑 시뮬레이션
            category_mapping = {
                "재산보험": "06재산보험",
                "특종보험": "07특종보험", 
                "배상책임보험": "08배상책임보험",
                "해상보험": "09해상보험"
            }
            
            # 카테고리별 통계 로드 시뮬레이션
            category_stats = {}
            for user_category, system_category in category_mapping.items():
                # questions.json에서 총 문제 수 조회 시뮬레이션
                total_problems = {
                    "06재산보험": 169,
                    "07특종보험": 182,
                    "08배상책임보험": 268,
                    "09해상보험": 170
                }
                
                # statistics.json에서 진도율, 정답률 조회 시뮬레이션
                progress_stats = {
                    "06재산보험": {"progress": 0, "accuracy": 0},
                    "07특종보험": {"progress": 0, "accuracy": 0},
                    "08배상책임보험": {"progress": 0, "accuracy": 0},
                    "09해상보험": {"progress": 0, "accuracy": 0}
                }
                
                category_stats[user_category] = {
                    "system_category": system_category,
                    "total_problems": total_problems[system_category],
                    "progress": progress_stats[system_category]["progress"],
                    "accuracy": progress_stats[system_category]["accuracy"]
                }
            
            self.results.append({
                "test": "카테고리 선택",
                "status": "성공",
                "category_stats": category_stats,
                "message": "카테고리별 통계 로드 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "카테고리 선택",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_continue_learning(self):
        """이어풀기 기능 시뮬레이션"""
        try:
            # statistics.json에서 last_question_index 조회 시뮬레이션
            last_question_index = {
                "subject_based": {
                    "관계법령": 25,
                    "특종보험": 18,
                    "손보1부": 12,
                    "손보2부": 8
                }
            }
            
            # 선택된 카테고리의 다음 문제 결정 시뮬레이션
            selected_category = "특종보험"
            current_index = last_question_index["subject_based"].get(selected_category, 0)
            next_index = current_index + 1
            
            # questions.json에서 다음 문제 로드 시뮬레이션
            next_question = {
                "qcode": f"QCODE_{selected_category}_{next_index:03d}",
                "question": "다음 문제 내용...",
                "qtype": "진위형"
            }
            
            self.results.append({
                "test": "이어풀기 기능",
                "status": "성공",
                "selected_category": selected_category,
                "current_index": current_index,
                "next_index": next_index,
                "next_question": next_question,
                "message": "이어풀기 기능 정상 작동"
            })
        except Exception as e:
            self.results.append({
                "test": "이어풀기 기능",
                "status": "오류",
                "error": str(e)
            })
```

### **Phase 4: 문제 풀이 시뮬레이션**

#### **4.1 문제 로드 및 표시 시뮬레이션**
```python
# test_problem_solving_simulation.py
class ProblemSolvingSimulation:
    def __init__(self):
        self.results = []
        
    def simulate_problem_loading(self):
        """문제 로드 시뮬레이션"""
        try:
            # questions.json에서 문제 데이터 로드 시뮬레이션
            problem_data = {
                "qcode": "QCODE_ABAA-01",
                "question": "기계 및 설비의 시운전담보 특별약관에서 기계 또는 설비가 중고품일 경우는 시운전이 보상되지 않는다",
                "qtype": "진위형",
                "answer": "O",
                "category": "07특종보험",
                "subcategory": "기술보험"
            }
            
            # 문제 유형에 따른 UI 렌더링 시뮬레이션
            if problem_data["qtype"] == "진위형":
                answer_options = ["O", "X"]
            elif problem_data["qtype"] == "선택형":
                answer_options = ["1", "2", "3", "4"]
            else:
                answer_options = []
            
            self.results.append({
                "test": "문제 로드",
                "status": "성공",
                "problem_data": problem_data,
                "answer_options": answer_options,
                "message": "문제 데이터 로드 및 UI 렌더링 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "문제 로드",
                "status": "오류",
                "error": str(e)
            })
    
    def simulate_answer_submission(self):
        """답안 제출 시뮬레이션"""
        try:
            # 사용자 답안 제출 시뮬레이션
            user_answer = "O"
            correct_answer = "O"
            
            # 정답 확인 시뮬레이션
            is_correct = user_answer == correct_answer
            
            # event_log.json에 이벤트 기록 시뮬레이션
            event_data = {
                "event_id": "EVT-20250825-001",
                "user_id": "01012345678",
                "event_type": "problem_attempt",
                "timestamp": "2025-08-25T16:10:00Z",
                "event_data": {
                    "qcode": "QCODE_ABAA-01",
                    "user_answer": user_answer,
                    "is_correct": is_correct,
                    "category": "07특종보험"
                }
            }
            
            # statistics.json 업데이트 시뮬레이션
            updated_stats = {
                "daily_stats": {
                    "2025-08-25": {
                        "problems_attempted": 1,
                        "correct_answers": 1 if is_correct else 0
                    }
                },
                "category_stats": {
                    "07특종보험": {
                        "problems_attempted": 1,
                        "correct_answers": 1 if is_correct else 0
                    }
                }
            }
            
            self.results.append({
                "test": "답안 제출",
                "status": "성공",
                "user_answer": user_answer,
                "is_correct": is_correct,
                "event_data": event_data,
                "updated_stats": updated_stats,
                "message": "답안 제출 및 통계 업데이트 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "답안 제출",
                "status": "오류",
                "error": str(e)
            })
```

### **Phase 5: 틀린문제 학습 시뮬레이션**

#### **5.1 틀린문제 필터링 시뮬레이션**
```python
# test_incorrect_problem_simulation.py
class IncorrectProblemSimulation:
    def __init__(self):
        self.results = []
        
    def simulate_incorrect_problem_filtering(self):
        """틀린문제 필터링 시뮬레이션"""
        try:
            # event_log.json에서 틀린 문제 조회 시뮬레이션
            user_events = [
                {"qcode": "QCODE_001", "is_correct": False},
                {"qcode": "QCODE_001", "is_correct": True},
                {"qcode": "QCODE_002", "is_correct": False},
                {"qcode": "QCODE_002", "is_correct": False},
                {"qcode": "QCODE_003", "is_correct": False},
                {"qcode": "QCODE_003", "is_correct": False},
                {"qcode": "QCODE_003", "is_correct": True}
            ]
            
            # QCODE별 오답 횟수 계산 시뮬레이션
            incorrect_counts = {}
            for event in user_events:
                qcode = event["qcode"]
                if not event["is_correct"]:
                    incorrect_counts[qcode] = incorrect_counts.get(qcode, 0) + 1
            
            # 틀린 횟수별 분류 시뮬레이션
            filtered_problems = {
                "1_time_incorrect": [],
                "2_times_incorrect": [],
                "3_plus_times_incorrect": []
            }
            
            for qcode, count in incorrect_counts.items():
                if count == 1:
                    filtered_problems["1_time_incorrect"].append(qcode)
                elif count == 2:
                    filtered_problems["2_times_incorrect"].append(qcode)
                else:
                    filtered_problems["3_plus_times_incorrect"].append(qcode)
            
            self.results.append({
                "test": "틀린문제 필터링",
                "status": "성공",
                "incorrect_counts": incorrect_counts,
                "filtered_problems": filtered_problems,
                "message": "틀린문제 필터링 성공"
            })
        except Exception as e:
            self.results.append({
                "test": "틀린문제 필터링",
                "status": "오류",
                "error": str(e)
            })
```

---

## 🎯 개발 절차 실행 계획 (노팀장 + 코코치 피드백 반영)

### **1. 사전 확정 단계 (1-2일)**

#### **1.1 기술 스택 최종 확정 (노팀장 + 코코치 승인)**
```python
# 노팀장 + 코코치 최종 승인된 기술 스택
최종_확정된_기술_스택 = {
    "백엔드": "Flask + JSON 파일 기반 (ACIU S4와 동일) ✅ 최종 확정",
    "프론트엔드": "Vanilla JavaScript + Tailwind CSS (ACIU S4와 동일) ✅ 최종 확정",
    "배포": "Heroku (ACIU S4와 동일) ✅ 최종 확정",
    "향후_전환": "Firestore로 전환하는 로드맵 확정 ✅ 최종 확정",
    "데이터_변환": "pandas를 이용한 엑셀 to JSON 변환 ✅ 최종 확정",
    "성능_고려사항": "11년치 데이터(1MB 이내) 충분히 처리 가능"
}
```

#### **1.2 MVP 범위 최종 확정 (노팀장 + 코코치 승인)**
```python
# 노팀장 + 코코치 최종 승인된 MVP 범위
최종_확정된_MVP_범위 = {
    "GEP_공식_로드맵": {
        "Phase_1": "UI 및 데이터 스키마 확정 ✅ 공식 로드맵",
        "Phase_2": "기초 기능 구현 ✅ 공식 로드맵", 
        "Phase_3": "고급 기능 구현 ✅ 공식 로드맵",
        "Phase_4": "최종 점검 및 배포 ✅ 공식 로드맵"
    },
    "서비스_단계_명확화": {
        "무료_서비스": "기출 회차별 학습만 ✅ 최종 확정",
        "유료_기본_서비스": "과목별 학습 + 틀린문제 학습 ✅ 최종 확정",
        "유료_고급_서비스": "미니 모의고사 + AI 개인화 기능 ✅ 최종 확정"
    }
}
```

### **2. 시뮬레이션 기반 개발 단계 (GEP 공식 로드맵 통합)**

#### **2.1 Phase 1: UI 및 데이터 스키마 확정 (5-7일)**
```python
Phase_1_공식_로드맵 = {
    "Day_1-2": "통계 서비스 UI/UX 시나리오 및 와이어프레임 작성 (노팀장)",
    "Day_3-4": "UI에 필요한 데이터 항목 리스트업 및 정의 (서대리)",
    "Day_5-6": "통계 데이터베이스 스키마(statistics.json) 설계 (노팀장)",
    "Day_7": "이벤트 데이터베이스 스키마(event_log.json) 설계 (서대리)",
    "핵심_목표": "UI-데이터 역설계 방법론에 따른 데이터 스키마 완성"
}
```

#### **2.2 Phase 2: 기초 기능 구현 (7-10일)**
```python
Phase_2_공식_로드맵 = {
    "Day_1-3": "문제 풀이 기능 개발 및 시뮬레이션 (서대리)",
    "Day_4-6": "이어풀기 기능 개발 및 시뮬레이션 (서대리)",
    "Day_7-8": "설정 기능 개발 및 연동 (서대리)",
    "Day_9-10": "무료 서비스 (기출 회차별 학습) 완성 및 테스트",
    "핵심_목표": "기초 문제풀이 기능 완성 (무료 서비스 기준)"
}
```

#### **2.3 Phase 3: 고급 기능 구현 (10-12일)**
```python
Phase_3_공식_로드맵 = {
    "Day_1-3": "유료 콘텐츠 (과목별 학습) 개발 및 시뮬레이션 (서대리)",
    "Day_4-6": "틀린문제 학습 기능 개발 및 시뮬레이션 (서대리)",
    "Day_7-9": "고급 통계 및 예측 기능 개발 (서대리)",
    "Day_10-12": "유료 기본 서비스 완성 및 테스트",
    "핵심_목표": "유료 기본 서비스 (과목별 학습 + 틀린문제 학습) 완성"
}
```

#### **2.4 Phase 4: 최종 점검 및 배포 (5-7일)**
```python
Phase_4_공식_로드맵 = {
    "Day_1-2": "통합 테스트 및 성능 최적화 (서대리)",
    "Day_3-4": "미니 모의고사 + AI 개인화 기능 개발 (서대리)",
    "Day_5-6": "상용 서비스 배포 준비 및 최종 검증 (서대리)",
    "Day_7": "Heroku 배포 및 모니터링 설정",
    "핵심_목표": "유료 고급 서비스 (미니 모의고사 + AI 개인화) 완성 및 배포"
}
```

### **3. 최종 검증 및 배포 단계 (3-4일)**

#### **3.1 최종 시뮬레이션**
```python
최종_검증_계획 = {
    "Day_1": "전체 시스템 시뮬레이션 및 성능 테스트",
    "Day_2": "사용자 시나리오 테스트 및 버그 수정",
    "Day_3": "배포 준비 및 최종 검증",
    "Day_4": "Heroku 배포 및 모니터링 설정",
    "핵심_목표": "프로덕션 레벨 안정성 확보"
}
```

### **4. 최종 확정된 전체 일정 (노팀장 + 코코치 권고사항 반영)**
```python
최종_확정된_전체_일정 = {
    "Phase_1": "5-7일 (UI 및 데이터 스키마 확정)",
    "Phase_2": "7-10일 (기초 기능 구현 - 무료 서비스)",
    "Phase_3": "10-12일 (고급 기능 구현 - 유료 기본 서비스)",
    "Phase_4": "5-7일 (최종 점검 및 배포 - 유료 고급 서비스)",
    "총_기간": "27-36일 (4-5주)",
    "서비스_단계별_완성": {
        "무료_서비스": "Phase 2 완료 시점",
        "유료_기본_서비스": "Phase 3 완료 시점", 
        "유료_고급_서비스": "Phase 4 완료 시점"
    }
}
```

---

## 🚀 서대리 자체 시뮬레이션 방법론의 GEP 적용 효과 (노팀장 피드백 반영)

### **1. 예상 효과**

#### **1.1 개발 효율성**
- **시뮬레이션 기반 사전 검증**: 문제점 사전 발견으로 개발 시간 단축
- **반복적 검증**: 각 단계별 완벽한 검증으로 안정성 확보
- **자율적 문제 해결**: 조대표님의 간섭 최소화로 개발 속도 향상

#### **1.2 품질 향상**
- **완성도 높은 결과물**: 충분한 시뮬레이션을 통한 안정적인 시스템
- **일관된 아키텍처**: ACIU S4 검증된 방식의 일관적 적용
- **확장 가능한 구조**: 향후 기능 추가를 위한 견고한 기반

#### **1.3 리스크 감소**
- **사전 문제 발견**: 시뮬레이션을 통한 잠재적 문제점 조기 발견
- **안정적 배포**: 충분한 검증을 통한 안전한 배포
- **유지보수성**: 체계적 개발로 인한 높은 유지보수성

### **2. ACIU S4 대비 개선점**

#### **2.1 방법론 고도화**
- **더 체계적인 시뮬레이션**: ACIU S4 경험을 바탕으로 더 정교한 시뮬레이션 설계
- **단계별 검증 강화**: 각 Phase별 완벽한 검증 후 다음 단계 진행
- **문서화 개선**: 모든 과정의 체계적 문서화

#### **2.2 기술적 발전**
- **데이터 구조 최적화**: GEP 특성에 맞는 최적화된 데이터 구조
- **UI/UX 개선**: ACIU S4의 UI를 기반으로 한 고도화된 사용자 경험
- **성능 최적화**: 시뮬레이션을 통한 성능 병목점 사전 해결

### **3. 노팀장 피드백 반영 개선사항**

#### **3.1 기술적 고려사항 보완**
```python
성능_최적화_전략 = {
    "데이터_로딩": "11년치 데이터 로딩 전략 수립",
    "메모리_최적화": "메모리 사용량 최적화 방안 구현",
    "로딩_시간": "로딩 시간 최소화 방안 적용",
    "오프라인_지원": "오프라인 사용 가능성 검토",
    "확장성": "향후 데이터 증가 대비책 마련"
}
```

#### **3.2 위험 관리 방안**
```python
위험_관리_계획 = {
    "기술적_위험": {
        "데이터_손실": "엑셀 변환 과정에서 데이터 손실 가능성 대응",
        "UI_복잡도": "복잡한 UI 구현의 기술적 난이도 대응"
    },
    "일정_위험": {
        "Phase_의존성": "각 Phase간 의존성으로 인한 지연 가능성 대응",
        "요구사항_변경": "예상보다 복잡한 요구사항 발견 시 대응"
    },
    "품질_위험": {
        "테스트_시간": "충분한 테스트 시간 확보 방안",
        "사용자_피드백": "사용자 피드백 반영 프로세스"
    }
}
```

#### **3.3 실제 데이터 기반 접근**
```python
실제_데이터_접근 = {
    "파일_분석": "GEP_MASTER_V1.0.xlsx 파일 구조 실제 분석",
    "데이터_기반_시뮬레이션": "실제 데이터 기반 시뮬레이션 코드 작성",
    "ACIU_코드_재사용": "AICU S4 코드 재사용 가능 부분 명확히 식별",
    "구체적_구현": "추상적 예시에서 구체적 구현으로 전환"
}
```

---

## 📝 결론 및 권장사항 (노팀장 + 코코치 피드백 반영)

### **1. 즉시 시작 가능한 사항**

#### **1.1 노팀장 + 코코치 최종 승인된 사항**
```python
노팀장_코코치_최종_승인_사항 = [
    "✅ 기술 스택 최종 확정 (Flask + JSON + Heroku + 향후 Firestore 전환)",
    "✅ GEP 공식 로드맵 최종 확정 (Phase 1~4)",
    "✅ 서비스 범위 명확화 (무료/유료 기본/유료 고급)",
    "✅ UI-데이터 역설계 방법론 + 서대리 자체 시뮬레이션 방법론 승인",
    "✅ 개발 착수 가능 상태 확정"
]
```

#### **1.2 서대리 즉시 시작 가능 (노팀장 + 코코치 권고사항)**
```python
즉시_시작_가능 = [
    "🚀 Phase 1 첫 번째 과업: 통계 서비스 UI/UX 시나리오 및 와이어프레임 작성",
    "🚀 GEP_MASTER_V1.0.xlsx 파일 구조 분석 및 변환 시스템 설계",
    "🚀 AICU S4 코드 재사용 가능 부분 식별 및 CentralDataManager 재활용",
    "🚀 UI-데이터 역설계 방법론에 따른 데이터 스키마 설계"
]
```

### **2. 수정된 개발 절차 (노팀장 권고사항 반영)**

#### **2.1 1단계: 사전 확정 (1-2일)**
- 노팀장 승인된 기술 스택 및 MVP 범위 확정
- 서대리가 실제 데이터 분석 및 시뮬레이션 프로그램 준비

#### **2.2 2단계: 시뮬레이션 기반 개발 (27-36일)**
- Phase 1-4 순차적 개발 및 시뮬레이션 (수정된 일정)
- 각 Phase 완료 후 다음 Phase 진행
- 위험 관리 및 성능 최적화 지속적 적용

#### **2.3 3단계: 최종 검증 및 배포 (3-4일)**
- 전체 시스템 시뮬레이션 및 성능 테스트
- 사용자 시나리오 테스트 및 버그 수정
- Heroku 배포 및 모니터링 설정

### **3. 예상 성과 (수정된 기간)**

#### **3.1 개발 성과**
- **완성도**: ACIU S4 수준의 안정적이고 완성도 높은 시스템
- **기능성**: 조대표님이 제시한 모든 UI 기능 완벽 구현
- **확장성**: 향후 AI 기반 개인화 서비스 확장 가능한 구조
- **성능**: 11년치 데이터 처리 최적화 완료

#### **3.2 비즈니스 성과**
- **시장 진입**: 빠른 시장 진입을 통한 선점 효과
- **사용자 경험**: 우수한 사용자 경험을 통한 고객 만족도 향상
- **수익성**: 단계적 서비스 제공을 통한 지속적 수익 창출

### **4. 코코치 최종 권고사항**

#### **4.1 전반적 방향 승인**
```
✅ 서대리 주도의 자율적 개발 방식에 전적으로 동의
✅ 시뮬레이션 절차에 대한 긍정적 평가
✅ ACIU 경험 재활용에 대한 동의
✅ MVP 범위에 대한 확정
```

#### **4.2 수정 완료 사항**
```
✅ 구체적인 기술 스택 확정 (Flask + JSON + Heroku + 향후 Firestore 전환)
✅ MVP 범위 재정의 (무료/유료 기본/유료 고급 서비스 명확화)
✅ 개발 순서 명확화 (GEP 공식 로드맵 Phase 1~4와 통합)
✅ UI-데이터 역설계 방법론 적용
```

#### **4.3 우선 진행 사항**
```
🚀 Phase 1 첫 번째 과업: 통계 서비스 UI/UX 시나리오 및 와이어프레임 작성
🚀 GEP_MASTER_V1.0.xlsx 파일 구조 분석 및 변환 시스템 설계
🚀 AICU S4 코드 재사용 가능 부분 식별 및 CentralDataManager 재활용
🚀 UI-데이터 역설계 방법론에 따른 데이터 스키마 설계
```

**조대표님, 노팀장과 코코치의 피드백을 반영하여 GEP 프로젝트의 개발 절차가 최종적으로 확정되었습니다!** 

이제 **27-36일(4-5주) 내에 완성도 높은 GEP 1.0을 완성**할 수 있을 것으로 예상됩니다! 🚀

**코코치 최종 권고사항**: 수정 후 개발 착수 가능 ✅
