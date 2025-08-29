# G040 QManager 세부개발계획서 v1.0

## 📋 프로젝트 개요

### 프로젝트명
**QManager - 진위형 문제 관리 시스템 (개선된 접근법)**

### 개발 목적
기존 QGENERATOR의 검증된 코드를 최대한 재활용하여, 기출문제별 파생문제를 통합 관리할 수 있는 시스템 개발

### 개발 기간
**2025년 8월 27일 (1일 집중 개발)**

### 개발자
**서대리**

### 검토자
**조대표**

### 이전 실패 경험 반영
- **실패 원인**: 복잡한 데이터 매핑, UI 상태 관리, 저장/업로드 로직 혼동
- **개선 방안**: QGENERATOR 코드 90% 재활용, 단순화된 조건부 로직

---

## 🎯 핵심 개발 전략

### 1. QGENERATOR 코드 최대 재활용
- **좌측 패널**: QGENERATOR의 기출문제 목록 그대로 사용
- **생성 모드**: QGENERATOR의 문제 생성 화면 그대로 사용
- **저장/업로드**: QGENERATOR의 로직 그대로 사용
- **QCODE 생성**: QGENERATOR의 규칙 정확히 준수

### 2. 조건부 UI 로직
```
기출문제 라디오 버튼 클릭
    ↓
파생문제 존재 여부 확인
    ↓
있음 → 관리 모드 (신규 개발)
없음 → 생성 모드 (QGENERATOR 재사용)
```

### 3. 유일한 신규 개발 부분
- **라디오 버튼 추가**: 기출문제 선택을 위한 명확한 인터페이스
- **관리 모드**: 기존 파생문제 표시, 수정, 삭제, 추가 기능

---

## 🏗️ 시스템 아키텍처

### 1. 전체 구조
```
QManager (QGENERATOR 기반)
├── 좌측 패널: 기출문제 목록 (QGENERATOR 재사용)
│   └── 라디오 버튼 추가 (신규)
├── 우측 패널: 동적 컨텐츠
│   ├── 관리 모드: 기존 파생문제 관리 (신규)
│   └── 생성 모드: QGENERATOR 화면 (재사용)
└── 저장/업로드: QGENERATOR 로직 (재사용)
```

### 2. 파일 구조
```
qmanager/
├── index.html              # 메인 HTML (QGENERATOR 기반)
├── styles.css              # CSS 스타일 (QGENERATOR 기반 + 라디오 버튼)
├── js/
│   └── qmanager.js         # 핵심 로직 (QGENERATOR 상속 + 조건부 로직)
└── README.md               # 문서
```

### 3. 데이터 구조
```json
{
  "metadata": {
    "version": "QManager V1.0",
    "total_original_questions": 1440,
    "total_derived_questions": 29,
    "last_update": "2025-08-27T..."
  },
  "questions": [
    {
      "QCODE": "ABAA-01-B1",
      "QTYPE": "B",
      "QUESTION": "진위형 문제 내용",
      "ANSWER": "O",
      "SOURCE_QCODE": "ABAA-01",
      "PARENT_INFO": "20.0회 관계법령 1번",
      "STATUS": "ACTIVE"
    }
  ]
}
```

---

## 📅 세부 개발 일정

### Phase 1: QGENERATOR 기반 구조 설정 (30분)
**목표**: QGENERATOR 코드 복사 및 기본 구조 설정

#### 1.1 프로젝트 구조 생성
- [ ] `qmanager/` 디렉토리 생성
- [ ] QGENERATOR 파일들 복사
- [ ] Flask 라우팅 추가 (`/admin/qmanager`)

#### 1.2 기본 파일 설정
- [ ] `qmanager/index.html`: QGENERATOR 기반 HTML
- [ ] `qmanager/styles.css`: QGENERATOR 기반 CSS
- [ ] `qmanager/js/qmanager.js`: QGENERATOR 기반 JavaScript

#### 1.3 라디오 버튼 추가
- [ ] 기출문제 목록에 라디오 버튼 추가
- [ ] 라디오 버튼 이벤트 리스너 설정
- [ ] 선택된 기출문제 상태 관리

### Phase 2: 조건부 로직 구현 (1시간)
**목표**: 파생문제 존재 여부에 따른 UI 전환 로직

#### 2.1 파생문제 확인 로직
- [ ] `getDerivedQuestions(qcode)` 함수 구현
- [ ] 파생문제 존재 여부 확인 로직
- [ ] 데이터 매핑 최적화

#### 2.2 생성 모드 구현
- [ ] QGENERATOR 화면 그대로 사용
- [ ] 문제 생성 폼 렌더링
- [ ] QCODE 생성 로직 (QGENERATOR 재사용)

#### 2.3 관리 모드 구현 (신규 개발)
- [ ] 기존 파생문제 표시 기능
- [ ] 파생문제 목록 렌더링
- [ ] 기본 관리 인터페이스

### Phase 3: 관리 기능 개발 (1시간)
**목표**: 기존 파생문제 관리 기능 완성

#### 3.1 파생문제 표시 기능
- [ ] 기존 파생문제 목록 표시
- [ ] 문제별 상태 표시 (ACTIVE/INACTIVE)
- [ ] 실시간 통계 업데이트

#### 3.2 파생문제 관리 기능
- [ ] 새로운 파생문제 추가 기능
- [ ] 기존 파생문제 수정 기능
- [ ] 파생문제 삭제 기능 (체크박스)
- [ ] 일괄 처리 기능

#### 3.3 UI 최적화
- [ ] 관리 모드 전용 스타일링
- [ ] 반응형 레이아웃 적용
- [ ] 사용자 피드백 개선

### Phase 4: 저장/업로드 기능 (30분)
**목표**: QGENERATOR의 저장/업로드 로직 재사용

#### 4.1 저장 기능
- [ ] QGENERATOR의 저장 로직 그대로 사용
- [ ] 임시 저장 (localStorage)
- [ ] 최종 저장 (JSON 파일)

#### 4.2 업로드 기능
- [ ] QGENERATOR의 업로드 로직 그대로 사용
- [ ] 기존 데이터와 병합
- [ ] 백업 및 롤백 기능

#### 4.3 에러 처리
- [ ] 저장 실패 시 에러 처리
- [ ] 업로드 실패 시 에러 처리
- [ ] 사용자 피드백 메시지

### Phase 5: 통합 및 테스트 (1시간)
**목표**: 전체 시스템 통합 및 검증

#### 5.1 통합 테스트
- [ ] 생성 모드 → 관리 모드 전환 테스트
- [ ] 관리 모드 → 생성 모드 전환 테스트
- [ ] 저장/업로드 기능 테스트

#### 5.2 실제 데이터 테스트
- [ ] 실제 기출문제 데이터 로딩 테스트
- [ ] 실제 파생문제 데이터 로딩 테스트
- [ ] 데이터 매핑 검증

#### 5.3 시뮬레이션 테스트
- [ ] 기출문제 선택 시나리오 테스트
- [ ] 파생문제 생성 시나리오 테스트
- [ ] 파생문제 수정 시나리오 테스트
- [ ] 파생문제 삭제 시나리오 테스트

### Phase 6: 디버깅 및 최적화 (30분)
**목표**: 문제 해결 및 성능 최적화

#### 6.1 디버깅
- [ ] 콘솔 로그 분석
- [ ] 에러 메시지 확인
- [ ] 문제점 식별 및 해결

#### 6.2 성능 최적화
- [ ] 데이터 로딩 최적화
- [ ] UI 반응성 개선
- [ ] 메모리 사용량 최적화

#### 6.3 사용성 개선
- [ ] 사용자 피드백 반영
- [ ] UI/UX 개선
- [ ] 접근성 향상

### Phase 7: 문서화 (30분)
**목표**: 개발 완료 보고서 작성

#### 7.1 개발 완료 보고서
- [ ] 개발 현황 요약
- [ ] 구현된 기능 목록
- [ ] 테스트 결과 요약
- [ ] 성능 지표

#### 7.2 사용자 매뉴얼
- [ ] 시스템 사용법
- [ ] 주요 기능 설명
- [ ] 문제 해결 가이드

---

## 🛠️ 개발 세부 절차

### 1단계: QGENERATOR 코드 복사 및 기본 설정

#### 1.1 디렉토리 생성
```bash
mkdir qmanager
mkdir qmanager/js
```

#### 1.2 QGENERATOR 파일 복사
```bash
cp qgenerator/index.html qmanager/index.html
cp qgenerator/styles.css qmanager/styles.css
cp qgenerator/js/qgenerator.js qmanager/js/qmanager.js
```

#### 1.3 Flask 라우팅 추가
`app.py`에 다음 라우팅 추가:
```python
@app.route('/admin/qmanager')
def qmanager():
    return send_from_directory('qmanager', 'index.html')

@app.route('/admin/qmanager/<path:filename>')
def qmanager_static(filename):
    return send_from_directory('qmanager', filename)

@app.route('/admin/qmanager/js/<path:filename>')
def qmanager_js(filename):
    return send_from_directory('qmanager/js', filename)
```

### 2단계: 라디오 버튼 추가

#### 2.1 HTML 수정
```html
<!-- 기출문제 목록에 라디오 버튼 추가 -->
<div class="original-question-item">
    <input type="radio" name="selectedOriginal" value="ABAA-01" id="ABAA-01">
    <label for="ABAA-01">ABAA-01 | 20회 관계법령 1번</label>
</div>
```

#### 2.2 CSS 스타일 추가
```css
.original-question-item input[type="radio"] {
    margin-right: 8px;
}

.original-question-item.selected {
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
}
```

#### 2.3 JavaScript 이벤트 리스너
```javascript
// 라디오 버튼 이벤트 리스너
document.querySelectorAll('input[name="selectedOriginal"]').forEach(radio => {
    radio.addEventListener('change', () => {
        this.selectOriginalQuestion(radio.value);
    });
});
```

### 3단계: 조건부 로직 구현

#### 3.1 파생문제 확인 함수
```javascript
getDerivedQuestions(sourceQCODE) {
    return this.derivedQuestions.filter(q => q.SOURCE_QCODE === sourceQCODE);
}
```

#### 3.2 조건부 UI 전환
```javascript
async selectOriginalQuestion(qcode) {
    // 1. QCODE 명확히 인식
    this.selectedQCODE = qcode;
    
    // 2. 파생문제 존재 여부 확인
    const derivedQuestions = this.getDerivedQuestions(qcode);
    
    if (derivedQuestions.length > 0) {
        // 3a. 파생문제 있음 → 관리 모드
        this.showManagementMode(qcode, derivedQuestions);
    } else {
        // 3b. 파생문제 없음 → 생성 모드 (QGENERATOR 재사용)
        this.showGenerationMode(qcode);
    }
}
```

#### 3.3 관리 모드 구현
```javascript
showManagementMode(qcode, derivedQuestions) {
    // 기존 파생문제 표시
    this.renderExistingQuestions(derivedQuestions);
    // 추가 생성 버튼
    this.addNewQuestionButton();
    // 수정/삭제 기능
    this.enableEditMode();
}
```

#### 3.4 생성 모드 구현 (QGENERATOR 재사용)
```javascript
showGenerationMode(qcode) {
    // QGENERATOR의 기존 로직 그대로 사용
    this.renderQuestionGenerator();
    this.setupGenerationMode();
}
```

### 4단계: 저장/업로드 기능 (QGENERATOR 재사용)

#### 4.1 저장 기능
```javascript
// QGENERATOR의 저장 로직 그대로 사용
async saveQuestions() {
    // 기존 QGENERATOR 로직
}
```

#### 4.2 업로드 기능
```javascript
// QGENERATOR의 업로드 로직 그대로 사용
async uploadQuestions() {
    // 기존 QGENERATOR 로직
}
```

---

## 🧪 테스트 계획

### 1. 단위 테스트
- [ ] 데이터 로딩 테스트
- [ ] 파생문제 확인 로직 테스트
- [ ] 조건부 UI 전환 테스트
- [ ] 저장/업로드 기능 테스트

### 2. 통합 테스트
- [ ] 전체 워크플로우 테스트
- [ ] 생성 모드 → 관리 모드 전환 테스트
- [ ] 관리 모드 → 생성 모드 전환 테스트

### 3. 실제 데이터 테스트
- [ ] 실제 기출문제 데이터 로딩
- [ ] 실제 파생문제 데이터 로딩
- [ ] 데이터 매핑 검증
- [ ] JSON 파일 실제 생성/수정/삭제

### 4. 사용자 시나리오 테스트
- [ ] 시나리오 1: 기존 파생문제가 있는 기출문제 선택
- [ ] 시나리오 2: 기존 파생문제가 없는 기출문제 선택
- [ ] 시나리오 3: 새로운 파생문제 생성
- [ ] 시나리오 4: 기존 파생문제 수정
- [ ] 시나리오 5: 기존 파생문제 삭제

---

## 📊 성공 지표

### 1. 기능 완성도
- **기출문제별 파생문제 검토**: 100%
- **조건부 UI 전환**: 100%
- **파생문제 관리 기능**: 100%
- **저장/업로드 기능**: 100%

### 2. 성능 지표
- **데이터 로딩 시간**: < 2초
- **UI 반응성**: < 100ms
- **메모리 사용량**: < 50MB
- **에러 발생률**: < 1%

### 3. 코드 재사용률
- **QGENERATOR 코드 재사용**: > 90%
- **신규 개발 코드**: < 10%
- **일관성 유지**: 100%

---

## 🔧 리스크 관리

### 1. 기술적 리스크
- **QGENERATOR 코드 변경**: 기존 QGENERATOR에 영향 없도록 독립적 개발
- **데이터 무결성**: 백업 및 롤백 기능 구현
- **성능 저하**: 최적화된 데이터 처리 로직 구현

### 2. 개발 리스크
- **일정 지연**: 단계별 완성도 확인 후 다음 단계 진행
- **품질 저하**: 지속적인 테스트 및 검증
- **사용자 경험**: 일관된 UI/UX 유지

### 3. 대응 방안
- **롤백 계획**: 문제 발생 시 이전 버전으로 복원
- **단계별 검증**: 각 Phase 완료 후 검증
- **지속적 테스트**: 개발 과정에서 지속적인 테스트

---

## 📝 결론

이 개발계획서는 이전 실패 경험을 바탕으로 한 개선된 접근법을 제시합니다. QGENERATOR의 검증된 코드를 최대한 재활용하여 개발 시간을 단축하고, 안정성을 높이는 것이 핵심입니다.

**예상 개발 시간**: 총 4시간 (이전 10-12시간 대비 70% 단축)
**예상 성공률**: 95% 이상 (검증된 코드 재사용으로 인한 안정성 향상)
**예상 품질**: 높음 (일관된 코드베이스로 인한 유지보수성 향상)
