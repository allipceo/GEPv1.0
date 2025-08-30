# G052: 3단계 LAYER2 과목별 기출문제 풀기 기능 세부개발계획서

## 📋 **문서 정보**
**문서 번호**: G052  
**작성일**: 2025년 8월 30일  
**목적**: LAYER2 과목별 기출문제 풀기 기능 세부 개발 계획  
**개발 방식**: 서대리 중심 개발 (개발→시뮬레이션→검증→실제데이터→디버깅→문서화)  
**기준 문서**: G049_GEP_기본서비스_개발_가이드.md  

---

## 🎯 **3단계 개발 목표**

### **핵심 목표**
사용자가 과목을 선택하면 해당 과목의 기출문제만 제공하는 기능 개발

### **제약사항**
- **객관식 문제는 제공하지 않음**: 기출문제만 제공
- **AB20AA QCODE 체계 준수**: 회차별 구분 유지
- **QUESTION 필드 절대 노터치**: 문제 데이터는 그대로 통과

### **기대 효과**
- **과목별 집중 학습**: 사용자가 원하는 과목만 선택하여 학습
- **효율적인 학습**: 불필요한 과목 제외로 학습 효율성 증대
- **사용자 경험 향상**: 직관적인 과목 선택 및 문제 풀이

---

## 🏗️ **개발 아키텍처 설계**

### **1. 데이터 구조 (AB20AA 체계)**
```json
{
  "questions": [
    {
      "QCODE": "AB20AA-01",
      "ETITLE": "보험중개사",
      "ECLASS": "손해보험",
      "LAYER1": "관계법령",
      "LAYER2": "보험업법",  // 과목별 분류 기준
      "QTYPE": "A",          // A: 기출문제만 제공
      "QUESTION": "보험업법의내용과관련하여타당하지않은것은?",
      "ANSWER": "2",
      "EROUND": "20.0"
    }
  ]
}
```

### **2. LAYER2 과목 목록**
```javascript
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
```

### **3. 시스템 구조**
```
3단계 과목별 기출문제 풀기 시스템
├── 과목 선택 UI (SubjectSelector)
├── 과목별 문제 필터링 (SubjectFilter)
├── 문제 풀이 인터페이스 (QuestionSolver)
├── 진행 상황 추적 (ProgressTracker)
└── 결과 저장 시스템 (ResultSaver)
```

---

## 📋 **세부 개발 단계 (서대리 중심)**

### **Phase 1: 개발 (Development) - DAY 1**

#### **1.1 과목 선택 UI 개발**
**목표**: 사용자가 과목을 선택할 수 있는 직관적인 인터페이스 구현

**개발 내용**:
```javascript
// static/js/subject-selector.js
class SubjectSelector {
    constructor() {
        this.subjects = LAYER2_SUBJECTS;
        this.selectedSubject = null;
    }
    
    // 과목 목록 렌더링
    renderSubjectList() {
        // 카드 형태의 과목 선택 UI
        // 각 과목별 문제 수 표시
        // 선택된 과목 하이라이트
    }
    
    // 과목 선택 이벤트 처리
    handleSubjectSelection(subject) {
        this.selectedSubject = subject;
        this.updateUI();
        this.loadSubjectQuestions(subject);
    }
}
```

**검증 기준**:
- [ ] 모든 LAYER2 과목이 정확히 표시됨
- [ ] 과목 선택 시 시각적 피드백 제공
- [ ] 반응형 디자인 적용

#### **1.2 과목별 문제 필터링 시스템 개발**
**목표**: 선택된 과목의 기출문제만 정확히 필터링

**개발 내용**:
```javascript
// static/js/subject-filter.js
class SubjectFilter {
    constructor(masterData) {
        this.masterData = masterData;
        this.filteredQuestions = [];
    }
    
    // 과목별 문제 필터링
    filterBySubject(subject) {
        this.filteredQuestions = this.masterData.filter(question => 
            question.LAYER2 === subject && 
            question.QTYPE === 'A'  // 기출문제만
        );
        return this.filteredQuestions;
    }
    
    // 과목별 통계 정보
    getSubjectStats(subject) {
        const questions = this.filterBySubject(subject);
        return {
            totalQuestions: questions.length,
            rounds: this.getUniqueRounds(questions),
            layer1Breakdown: this.getLayer1Breakdown(questions)
        };
    }
}
```

**검증 기준**:
- [ ] 선택된 과목의 문제만 정확히 필터링
- [ ] QTYPE 'A' (기출문제)만 포함
- [ ] 필터링 성능 최적화 (1초 이내)

#### **1.3 문제 풀이 인터페이스 개발**
**목표**: 필터링된 문제를 풀 수 있는 인터페이스 구현

**개발 내용**:
```javascript
// static/js/question-solver.js
class QuestionSolver {
    constructor() {
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = {};
    }
    
    // 문제 로드
    loadQuestions(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.renderCurrentQuestion();
    }
    
    // 현재 문제 렌더링
    renderCurrentQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        // 문제 텍스트, 선택지, 진행률 표시
    }
    
    // 답안 제출
    submitAnswer(answer) {
        const questionId = this.questions[this.currentQuestionIndex].QCODE;
        this.userAnswers[questionId] = {
            answer: answer,
            isCorrect: this.checkAnswer(answer),
            timestamp: new Date().toISOString()
        };
    }
}
```

**검증 기준**:
- [ ] 문제 텍스트 정확히 표시
- [ ] 선택지 정확히 표시
- [ ] 답안 제출 시 즉시 피드백
- [ ] 진행률 정확히 표시

### **Phase 2: 시뮬레이션 (Simulation) - DAY 1**

#### **2.1 시뮬레이션 데이터 생성**
**목표**: 실제 데이터 없이도 기능을 테스트할 수 있는 시뮬레이션 데이터 생성

**시뮬레이션 데이터**:
```javascript
// static/js/simulation-data.js
const SIMULATION_DATA = {
    questions: [
        {
            "QCODE": "AB20AA-01",
            "LAYER2": "보험업법",
            "QTYPE": "A",
            "QUESTION": "보험업법의 내용과 관련하여 타당하지 않은 것은?",
            "ANSWER": "2",
            "EROUND": "20.0"
        },
        // ... 더 많은 시뮬레이션 데이터
    ]
};
```

#### **2.2 시뮬레이션 테스트 시나리오**
**시나리오 1**: 과목 선택 테스트
- 사용자가 "보험업법" 선택
- 해당 과목의 문제만 표시되는지 확인
- 문제 수가 정확한지 확인

**시나리오 2**: 문제 풀이 테스트
- 문제 텍스트 정확히 표시되는지 확인
- 답안 제출 시 정답/오답 피드백 확인
- 다음 문제로 이동하는지 확인

**시나리오 3**: 진행 상황 테스트
- 진행률이 정확히 표시되는지 확인
- 이어풀기 기능이 작동하는지 확인

### **Phase 3: 검증 (Validation) - DAY 1**

#### **3.1 기능별 검증 체크리스트**
```javascript
// static/js/validation-checker.js
class ValidationChecker {
    constructor() {
        this.testResults = {};
    }
    
    // 과목 선택 검증
    validateSubjectSelection() {
        const tests = [
            "모든 과목이 표시되는가?",
            "과목 선택 시 시각적 피드백이 제공되는가?",
            "선택된 과목의 문제만 필터링되는가?",
            "문제 수가 정확한가?"
        ];
        return this.runTests(tests);
    }
    
    // 문제 풀이 검증
    validateQuestionSolving() {
        const tests = [
            "문제 텍스트가 정확히 표시되는가?",
            "선택지가 정확히 표시되는가?",
            "답안 제출 시 피드백이 제공되는가?",
            "진행률이 정확히 표시되는가?"
        ];
        return this.runTests(tests);
    }
}
```

#### **3.2 성능 검증**
- **로딩 시간**: 과목 선택 후 문제 로딩 3초 이내
- **메모리 사용량**: 50MB 이하 유지
- **반응성**: 사용자 인터랙션 1초 이내 응답

### **Phase 4: 실제 데이터 확인 (Real Data Verification) - DAY 2**

#### **4.1 실제 데이터 로드**
**목표**: 실제 `gep_master_v1.0.json` 데이터로 기능 검증

**데이터 로드 프로세스**:
```javascript
// static/js/real-data-loader.js
class RealDataLoader {
    async loadMasterData() {
        try {
            const response = await fetch('/static/data/gep_master_v1.0.json');
            const data = await response.json();
            return data.questions;
        } catch (error) {
            console.error('실제 데이터 로드 실패:', error);
            return null;
        }
    }
    
    // 데이터 무결성 검증
    validateDataIntegrity(questions) {
        const checks = [
            "모든 문제에 QCODE가 있는가?",
            "모든 문제에 LAYER2가 있는가?",
            "QTYPE이 'A'인 문제만 있는가?",
            "총 1,440개 문제인가?"
        ];
        return this.runChecks(questions, checks);
    }
}
```

#### **4.2 실제 데이터 테스트**
- **과목별 문제 수 확인**: 각 LAYER2 과목별 실제 문제 수 검증
- **문제 내용 확인**: 실제 문제 텍스트가 정확히 표시되는지 확인
- **답안 정확성 확인**: 실제 답안과 사용자 답안 비교 정확성 확인

### **Phase 5: 디버깅 (Debugging) - DAY 2**

#### **5.1 디버깅 도구 개발**
```javascript
// static/js/debug-tools.js
class DebugTools {
    constructor() {
        this.debugMode = false;
        this.logs = [];
    }
    
    // 디버그 모드 활성화
    enableDebugMode() {
        this.debugMode = true;
        this.showDebugPanel();
    }
    
    // 로그 기록
    log(message, data = null) {
        if (this.debugMode) {
            this.logs.push({
                timestamp: new Date().toISOString(),
                message: message,
                data: data
            });
            this.updateDebugPanel();
        }
    }
    
    // 성능 모니터링
    monitorPerformance(operation, callback) {
        const startTime = performance.now();
        const result = callback();
        const endTime = performance.now();
        this.log(`성능 측정: ${operation}`, {
            duration: endTime - startTime,
            result: result
        });
        return result;
    }
}
```

#### **5.2 일반적인 버그 및 해결 방안**
**버그 1**: 과목 선택 시 문제가 로드되지 않음
- **원인**: 데이터 필터링 로직 오류
- **해결**: 필터링 조건 검증 및 수정

**버그 2**: 문제 텍스트가 깨져서 표시됨
- **원인**: 인코딩 문제
- **해결**: UTF-8 인코딩 확인 및 수정

**버그 3**: 진행률이 부정확함
- **원인**: 진행률 계산 로직 오류
- **해결**: 계산 로직 검증 및 수정

### **Phase 6: 문서화 (Documentation) - DAY 2**

#### **6.1 개발 문서 작성**
**기술 문서**:
- 코드 구조 및 아키텍처 설명
- API 문서 (함수별 설명)
- 데이터 구조 문서

**사용자 문서**:
- 기능 사용법 가이드
- 문제 해결 가이드
- FAQ

#### **6.2 코드 주석 및 문서화**
```javascript
/**
 * 과목별 문제 필터링 클래스
 * @class SubjectFilter
 * @description 선택된 과목의 기출문제만 필터링하는 기능을 제공
 */
class SubjectFilter {
    /**
     * 과목별 문제 필터링
     * @param {string} subject - 필터링할 과목명 (LAYER2 값)
     * @returns {Array} 필터링된 문제 배열
     */
    filterBySubject(subject) {
        // 구현 내용
    }
}
```

---

## 📊 **개발 일정 및 마일스톤**

### **DAY 1: 개발 및 시뮬레이션**
- **오전**: Phase 1 (개발) - 과목 선택 UI, 필터링 시스템
- **오후**: Phase 2 (시뮬레이션) - 시뮬레이션 데이터로 테스트
- **저녁**: Phase 3 (검증) - 기능별 검증 및 성능 테스트

### **DAY 2: 실제 데이터 및 완성**
- **오전**: Phase 4 (실제 데이터 확인) - 실제 데이터로 검증
- **오후**: Phase 5 (디버깅) - 버그 수정 및 최적화
- **저녁**: Phase 6 (문서화) - 개발 문서 및 사용자 가이드 작성

---

## 🎯 **성공 기준**

### **기능적 성공 기준**
- [ ] 모든 LAYER2 과목이 정확히 표시됨
- [ ] 과목 선택 시 해당 과목의 문제만 필터링됨
- [ ] 기출문제만 제공됨 (객관식 문제 제외)
- [ ] 문제 풀이 인터페이스가 정상 작동함
- [ ] 진행률이 정확히 표시됨

### **성능적 성공 기준**
- [ ] 과목 선택 후 문제 로딩 시간 3초 이내
- [ ] 메모리 사용량 50MB 이하
- [ ] 사용자 인터랙션 응답 시간 1초 이내
- [ ] 브라우저 호환성 (Chrome, Firefox, Safari, Edge)

### **품질적 성공 기준**
- [ ] 코드 품질 (ESLint 기준 통과)
- [ ] 접근성 (WCAG 2.1 AA 기준)
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)
- [ ] 문서화 완성도 (100%)

---

## 🚨 **위험 요소 및 대응 방안**

### **위험 요소 1**: 실제 데이터 로드 실패
- **대응**: 시뮬레이션 데이터로 대체하여 개발 진행
- **예방**: 데이터 백업 및 검증 로직 구현

### **위험 요소 2**: 성능 문제
- **대응**: 코드 최적화 및 캐싱 전략 적용
- **예방**: 성능 모니터링 도구 구현

### **위험 요소 3**: 브라우저 호환성 문제
- **대응**: 폴리필 및 크로스 브라우저 테스트
- **예방**: 표준 웹 기술 사용

---

## 📋 **문서 정보**

**문서 번호**: G052  
**작성일**: 2025년 8월 30일  
**작성자**: 서대리 (AI Assistant)  
**검토자**: 조대표님  
**버전**: V1.0  
**상태**: 세부 개발 계획 완료

**이 문서를 기반으로 3단계 LAYER2 과목별 기출문제 풀기 기능 개발을 시작합니다!** 🚀
