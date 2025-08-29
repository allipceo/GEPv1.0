# GEP 기본서비스 개발 가이드 (G049)

## 📋 **문서 정보**
**문서 번호**: G049  
**작성일**: 2025년 7월 17일  
**목적**: GEP 기본서비스 개발을 위한 종합 가이드  
**대상**: 새로운 브랜치에서 개발을 시작하는 서대리  

---

## 🎯 **현재까지의 개발 경과 요약**

### **✅ 완료된 시스템들**

#### **1. GEP 메인 시스템** (`http://localhost:5000`)
- **상태**: ✅ 완전 작동
- **기능**: 
  - 메인 페이지 (관리자 도구 제거됨)
  - 학습 페이지 (`/learning`)
  - 통계 페이지 (`/statistics`)
  - 1,440개 기출문제 데이터 로딩
- **데이터**: `static/data/gep_master_v1.0.json`

#### **2. QManager 시스템** (`http://localhost:5001`)
- **상태**: ✅ 완전 작동
- **기능**: 진위형 문제 생성 및 관리
- **특징**: 독립형 웹 애플리케이션

#### **3. 핵심 데이터 구조**
```json
{
  "INDEX": "1",
  "ETITLE": "보험중개사",
  "ECLASS": "손해보험",
  "QCODE": "ABAA-01",
  "EROUND": "20.0",
  "LAYER1": "관계법령",
  "LAYER2": "보험업법",
  "LAYER3": "",
  "QNUM": "1",
  "QTYPE": "A",
  "QUESTION": "보험업법의내용과관련하여타당하지않은것은?",
  "ANSWER": "2",
  "DIFFICULTY": "",
  "CREATED_DATE": "2025-08-23 21:17:14",
  "MODIFIED_DATE": "2025-08-23 21:17:14"
}
```

---

## 🚀 **기본서비스 개발 계획**

### **개발 순서 (조대표님 지시사항)**

#### **1단계: LAYER2 데이터 업데이트**
- **목표**: 엑셀 파일의 LAYER2 데이터를 JSON 파일에 업데이트
- **입력**: 조대표님이 준비한 LAYER2 엑셀 파일
- **출력**: `gep_master_v1.0.json`에 LAYER2 필드 업데이트
- **중요**: 기존 데이터 구조 유지, LAYER2 필드만 추가/수정

#### **2단계: LAYER2 과목별 기출문제 풀기 기능**
- **목표**: 사용자가 과목을 선택하면 해당 과목의 기출문제만 제공
- **제약사항**: 객관식 문제는 제공하지 않고 기출문제만 제공
- **기능**:
  - 과목 선택 UI (LAYER2 기반)
  - 선택된 과목의 기출문제 필터링
  - 기출문제 풀이 인터페이스

#### **3단계: 과목별 틀린문제 보기 서비스**
- **목표**: 과목별로 틀린문제를 관리하고 재학습 가능
- **기능**:
  - 과목별 틀린문제 횟수 추적
  - 틀린회수 기준 필터링
  - 틀린문제 재학습 기능

#### **4단계: 통계서비스**
- **목표**: 과목별 상세 통계 및 합격 가능성 분석
- **기능**:
  - 과목별 누적 푼문제, 정답율
  - 과목별 금일 푼문제수, 정답율
  - LAYER1 기준 예상점수, 총평균
  - 합격가능성 여부 판단

---

## 🛠️ **기술적 구현 가이드**

### **1. 데이터 업데이트 방법**

#### **LAYER2 데이터 업데이트 스크립트**
```python
# convert_layer2_excel_to_json.py
import pandas as pd
import json

def update_layer2_data():
    # 1. 기존 JSON 파일 로드
    with open('static/data/gep_master_v1.0.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 2. 엑셀 파일에서 LAYER2 데이터 로드
    df = pd.read_excel('layer2_data.xlsx')  # 조대표님이 제공한 파일
    
    # 3. QCODE를 기준으로 매칭하여 LAYER2 업데이트
    for question in data['questions']:
        qcode = question['QCODE']
        # 엑셀에서 해당 QCODE의 LAYER2 데이터 찾기
        layer2_data = df[df['QCODE'] == qcode]['LAYER2'].iloc[0]
        question['LAYER2'] = layer2_data
    
    # 4. 업데이트된 JSON 저장
    with open('static/data/gep_master_v1.0.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
```

### **2. 과목별 필터링 시스템**

#### **LAYER2 과목 목록**
```javascript
// LAYER2 과목별 필터링
const LAYER2_SUBJECTS = [
    "보험업법",
    "상법보험편",
    "자동차보험",
    "화재보험",
    "해상보험",
    "재해보험",
    "보험계리",
    "보험경영",
    "보험마케팅",
    "보험심사",
    "보험사고처리",
    "보험계약관리"
];

// 과목별 문제 필터링 함수
function filterQuestionsByLayer2(layer2Subject) {
    return masterData.filter(question => 
        question.LAYER2 === layer2Subject
    );
}
```

### **3. 틀린문제 관리 시스템**

#### **틀린문제 데이터 구조**
```javascript
// 틀린문제 추적 시스템
const wrongAnswerTracker = {
    // 사용자별 틀린문제 기록
    userWrongAnswers: {
        [userId]: {
            [qcode]: {
                wrongCount: 0,
                lastWrongDate: null,
                layer2: "",
                question: ""
            }
        }
    },
    
    // 틀린문제 추가
    addWrongAnswer(userId, qcode, questionData) {
        if (!this.userWrongAnswers[userId]) {
            this.userWrongAnswers[userId] = {};
        }
        
        if (!this.userWrongAnswers[userId][qcode]) {
            this.userWrongAnswers[userId][qcode] = {
                wrongCount: 0,
                lastWrongDate: null,
                layer2: questionData.LAYER2,
                question: questionData.QUESTION
            };
        }
        
        this.userWrongAnswers[userId][qcode].wrongCount++;
        this.userWrongAnswers[userId][qcode].lastWrongDate = new Date().toISOString();
    },
    
    // 과목별 틀린문제 조회
    getWrongAnswersByLayer2(userId, layer2) {
        const userWrong = this.userWrongAnswers[userId] || {};
        return Object.values(userWrong).filter(item => 
            item.layer2 === layer2
        );
    }
};
```

### **4. 통계 시스템**

#### **통계 데이터 구조**
```javascript
// 통계 계산 시스템
const StatisticsManager = {
    // 과목별 통계 계산
    calculateSubjectStats(userId, layer2) {
        const questions = filterQuestionsByLayer2(layer2);
        const userAnswers = getUserAnswers(userId);
        
        const stats = {
            totalQuestions: questions.length,
            answeredQuestions: 0,
            correctAnswers: 0,
            todayAnswered: 0,
            todayCorrect: 0,
            accuracy: 0,
            todayAccuracy: 0
        };
        
        // 통계 계산 로직
        questions.forEach(question => {
            const answer = userAnswers[question.QCODE];
            if (answer) {
                stats.answeredQuestions++;
                if (answer.isCorrect) stats.correctAnswers++;
                
                // 오늘 날짜 체크
                if (isToday(answer.timestamp)) {
                    stats.todayAnswered++;
                    if (answer.isCorrect) stats.todayCorrect++;
                }
            }
        });
        
        stats.accuracy = stats.answeredQuestions > 0 ? 
            (stats.correctAnswers / stats.answeredQuestions * 100) : 0;
        stats.todayAccuracy = stats.todayAnswered > 0 ? 
            (stats.todayCorrect / stats.todayAnswered * 100) : 0;
        
        return stats;
    },
    
    // 합격 가능성 분석
    calculatePassProbability(userId) {
        const layer1Stats = this.calculateLayer1Stats(userId);
        const totalAccuracy = layer1Stats.averageAccuracy;
        
        // 합격 기준: 70% 이상
        const passProbability = totalAccuracy >= 70 ? "합격 가능" : "합격 어려움";
        
        return {
            totalAccuracy,
            passProbability,
            recommendedActions: this.getRecommendedActions(layer1Stats)
        };
    }
};
```

---

## 📁 **파일 구조 및 개발 순서**

### **새로 생성할 파일들**

#### **1. 데이터 업데이트 스크립트**
```
scripts/
├── update_layer2_data.py          # LAYER2 데이터 업데이트
└── validate_layer2_data.py        # 데이터 검증
```

#### **2. 새로운 페이지들**
```
templates/pages/
├── subject_selection.html         # 과목 선택 페이지
├── subject_learning.html          # 과목별 학습 페이지
├── wrong_answers.html             # 틀린문제 관리 페이지
└── subject_statistics.html        # 과목별 통계 페이지
```

#### **3. 새로운 JavaScript 모듈들**
```
static/js/
├── subject-manager.js             # 과목 관리
├── wrong-answer-tracker.js        # 틀린문제 추적
├── subject-statistics.js          # 과목별 통계
└── pass-probability.js            # 합격 가능성 분석
```

#### **4. 새로운 API 엔드포인트들**
```python
# app.py에 추가할 라우트들
@app.route('/api/subjects')                    # 과목 목록 조회
@app.route('/api/subject/<layer2>/questions')  # 과목별 문제 조회
@app.route('/api/wrong-answers/<layer2>')      # 과목별 틀린문제 조회
@app.route('/api/subject-stats/<layer2>')      # 과목별 통계 조회
@app.route('/api/pass-probability')            # 합격 가능성 조회
```

---

## 🔧 **개발 단계별 체크리스트**

### **1단계: LAYER2 데이터 업데이트**
- [ ] 조대표님의 LAYER2 엑셀 파일 확인
- [ ] `update_layer2_data.py` 스크립트 작성
- [ ] 데이터 업데이트 실행
- [ ] 업데이트된 데이터 검증
- [ ] 백업 파일 생성

### **2단계: 과목별 기출문제 풀기 기능**
- [ ] 과목 선택 UI 구현
- [ ] 과목별 문제 필터링 로직 구현
- [ ] 과목별 학습 페이지 구현
- [ ] 기출문제 풀이 인터페이스 구현
- [ ] 객관식 문제 제외 로직 구현

### **3단계: 틀린문제 관리 시스템**
- [ ] 틀린문제 추적 데이터 구조 설계
- [ ] 틀린문제 기록 로직 구현
- [ ] 과목별 틀린문제 조회 기능 구현
- [ ] 틀린문제 재학습 기능 구현
- [ ] 틀린회수 기준 필터링 구현

### **4단계: 통계 시스템**
- [ ] 과목별 통계 계산 로직 구현
- [ ] 일별 통계 계산 로직 구현
- [ ] 예상점수 계산 알고리즘 구현
- [ ] 합격 가능성 분석 로직 구현
- [ ] 통계 시각화 UI 구현

---

## 🚨 **주의사항 및 핵심 원칙**

### **1. 기존 시스템 보존**
- **원칙**: 기존 GEP 메인 시스템은 절대 건드리지 않음
- **방법**: 새로운 기능은 별도 페이지/모듈로 구현
- **검증**: 각 단계마다 기존 시스템 정상 작동 확인

### **2. 데이터 무결성**
- **원칙**: 기존 1,440개 기출문제 데이터 완전 보존
- **방법**: LAYER2 데이터만 추가/수정
- **백업**: 모든 데이터 변경 전 백업 필수

### **3. 사용자 경험**
- **원칙**: 직관적이고 일관된 UI/UX
- **방법**: 기존 GEP UI 스타일 유지
- **테스트**: 각 기능 구현 후 실제 사용 테스트

### **4. 성능 최적화**
- **원칙**: 빠른 응답 속도 유지
- **방법**: 효율적인 데이터 필터링 및 캐싱
- **모니터링**: 성능 지표 지속적 확인

---

## 📞 **개발 중 문의사항**

### **조대표님께 확인이 필요한 사항들**
1. **LAYER2 엑셀 파일**: 정확한 파일명과 구조
2. **과목 목록**: LAYER2에 포함된 모든 과목명
3. **합격 기준**: 정확한 합격 점수 기준
4. **UI/UX**: 과목 선택 및 통계 표시 방식

### **기술적 의사결정**
1. **데이터 저장 방식**: LocalStorage vs 서버 저장
2. **통계 계산 주기**: 실시간 vs 배치 처리
3. **캐싱 전략**: 데이터 캐싱 방식

---

## 🎯 **성공 기준**

### **기능별 성공 기준**
1. **LAYER2 데이터 업데이트**: 모든 문제에 LAYER2 필드 정확히 매핑
2. **과목별 학습**: 선택한 과목의 기출문제만 정확히 필터링
3. **틀린문제 관리**: 과목별 틀린문제 정확히 추적 및 재학습
4. **통계 시스템**: 과목별/일별 통계 정확히 계산 및 표시

### **품질 기준**
- **성능**: 페이지 로딩 시간 3초 이내
- **안정성**: 에러 발생률 1% 미만
- **사용성**: 직관적인 UI로 사용자 혼란 최소화

---

## 📋 **문서 정보**

**문서 번호**: G049  
**작성일**: 2025년 7월 17일  
**작성자**: 서대리 (Cursor AI)  
**검토자**: 조대표님  
**버전**: V1.0  
**상태**: 개발 가이드 완료

**이 문서를 기반으로 GEP-BASIC-SERVICE 브랜치에서 개발을 시작하세요!** 🚀
