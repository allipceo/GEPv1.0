# G030 Block 4: UI 시스템 개발 작업계획서

## 📋 개요
- **작업 기간**: 2025년 8월 26일 ~ 8월 30일 (5일)
- **작업자**: 서대리
- **목표**: GEP 사용자 인터페이스 시스템 완전 구현
- **참조**: ACIU S4 UI 경험 기반 확장, Block 3 Core Data Manager 연동

---

## 🎯 개발 목표 및 범위

### **핵심 목표**
1. **대문 UI**: 메인 페이지 및 네비게이션 시스템
2. **문제 풀이 UI**: ACIU S4 경험 기반 문제 풀이 인터페이스
3. **통계 대시보드**: 사용자 학습 현황 및 통계 시각화
4. **사용자 관리 UI**: 회원가입, 로그인, 프로필 관리
5. **반응형 디자인**: 모바일/데스크톱 완전 지원

### **기술 스택**
- **프론트엔드**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **UI 프레임워크**: Tailwind CSS
- **아이콘**: Heroicons, Lucide Icons
- **차트**: Chart.js (통계 시각화)
- **애니메이션**: CSS Transitions, Framer Motion (선택적)

---

## 🏗️ 시스템 아키텍처

### **UI 컴포넌트 구조**
```
static/
├── css/
│   ├── main.css              # 메인 스타일시트
│   ├── components.css        # 컴포넌트별 스타일
│   └── responsive.css        # 반응형 스타일
├── js/
│   ├── core/                 # Block 3 완성품
│   │   ├── data-manager.js   # ✅ 완료
│   │   └── test-manager.js   # ✅ 완료
│   ├── ui/                   # Block 4 신규 개발
│   │   ├── navigation.js     # 네비게이션 관리
│   │   ├── quiz-ui.js        # 문제 풀이 UI
│   │   ├── dashboard.js      # 통계 대시보드
│   │   ├── auth-ui.js        # 사용자 인증 UI
│   │   └── components.js     # 공통 컴포넌트
│   └── utils/
│       ├── animations.js     # 애니메이션 유틸리티
│       └── validators.js     # 폼 검증 유틸리티
├── pages/
│   ├── index.html            # 대문 페이지
│   ├── quiz.html             # 문제 풀이 페이지
│   ├── dashboard.html        # 통계 대시보드
│   ├── auth.html             # 인증 페이지
│   └── profile.html          # 프로필 페이지
└── assets/
    ├── images/               # 이미지 리소스
    └── icons/                # 아이콘 리소스
```

---

## 📅 상세 개발 일정

### **Phase 1: 기반 UI 시스템 (Day 1)**
**목표**: 공통 컴포넌트 및 네비게이션 시스템 구축

#### **1.1 공통 컴포넌트 개발**
- **파일**: `static/js/ui/components.js`
- **기능**:
  - 모달 시스템 (Modal, Confirm, Alert)
  - 로딩 스피너 (Loading Spinner)
  - 토스트 알림 (Toast Notifications)
  - 버튼 컴포넌트 (Primary, Secondary, Danger)
  - 카드 컴포넌트 (Card, Card Header, Card Body)
  - 폼 컴포넌트 (Input, Select, Textarea, Checkbox)

#### **1.2 네비게이션 시스템**
- **파일**: `static/js/ui/navigation.js`
- **기능**:
  - 반응형 네비게이션 바
  - 사이드바 메뉴 (모바일)
  - 브레드크럼 네비게이션
  - 사용자 메뉴 드롭다운
  - 페이지 전환 애니메이션

#### **1.3 메인 스타일시트**
- **파일**: `static/css/main.css`
- **기능**:
  - Tailwind CSS 커스터마이징
  - 공통 색상 팔레트 정의
  - 타이포그래피 시스템
  - 그리드 시스템 확장

### **Phase 2: 대문 UI (Day 2)**
**목표**: 메인 페이지 및 랜딩 페이지 완성

#### **2.1 대문 페이지 구조**
- **파일**: `static/pages/index.html`
- **섹션**:
  - 헤더 (로고, 네비게이션, CTA 버튼)
  - 히어로 섹션 (메인 메시지, 시작 버튼)
  - 서비스 소개 (기능별 카드)
  - 통계 섹션 (사용자 수, 문제 수, 성공률)
  - 시험 유형 소개 (보험중개사, 보험심사역, 손해사정사)
  - 푸터 (연락처, 소셜 링크)

#### **2.2 대문 페이지 기능**
- **파일**: `static/js/ui/landing.js`
- **기능**:
  - 스크롤 애니메이션
  - 통계 카운터 애니메이션
  - 서비스 소개 카드 호버 효과
  - 반응형 이미지 최적화

### **Phase 3: 문제 풀이 UI (Day 3)**
**목표**: ACIU S4 경험 기반 문제 풀이 인터페이스

#### **3.1 문제 풀이 페이지**
- **파일**: `static/pages/quiz.html`
- **구조**:
  - 문제 표시 영역 (문제 텍스트, 이미지)
  - 답안 선택 영역 (4개 보기)
  - 제출/다음 버튼
  - 진행률 표시
  - 타이머 (선택적)

#### **3.2 문제 풀이 로직**
- **파일**: `static/js/ui/quiz-ui.js`
- **기능**:
  - 문제 로드 및 표시
  - 답안 선택 처리
  - 정답/오답 피드백
  - 진행률 업데이트
  - 결과 저장 (DataManager 연동)
  - 문제 필터링 (시험 유형, 난이도)

#### **3.3 문제 풀이 모드**
- **기본 모드**: 순차적 문제 풀이
- **랜덤 모드**: 무작위 문제 풀이
- **틀린 문제 모드**: 오답 문제만 풀이
- **시험 모드**: 시간 제한, 결과 저장

### **Phase 4: 통계 대시보드 (Day 4)**
**목표**: 사용자 학습 현황 및 통계 시각화

#### **4.1 대시보드 페이지**
- **파일**: `static/pages/dashboard.html`
- **구조**:
  - 전체 통계 카드 (총 문제 수, 정답률, 학습 시간)
  - 차트 영역 (정답률 변화, 카테고리별 성과)
  - 최근 활동 로그
  - 학습 목표 설정

#### **4.2 통계 시각화**
- **파일**: `static/js/ui/dashboard.js`
- **차트**:
  - 정답률 변화 라인 차트
  - 카테고리별 성과 바 차트
  - 학습 시간 분포 파이 차트
  - 월별 성과 히트맵

#### **4.3 통계 데이터 연동**
- **DataManager 연동**:
  - 사용자 통계 데이터 로드
  - 실시간 통계 업데이트
  - 필터링 (기간, 카테고리, 시험 유형)

### **Phase 5: 사용자 관리 UI (Day 5)**
**목표**: 회원가입, 로그인, 프로필 관리 시스템

#### **5.1 인증 페이지**
- **파일**: `static/pages/auth.html`
- **기능**:
  - 로그인 폼
  - 회원가입 폼
  - 비밀번호 재설정
  - 소셜 로그인 (선택적)

#### **5.2 인증 로직**
- **파일**: `static/js/ui/auth-ui.js`
- **기능**:
  - 폼 검증
  - 로그인/회원가입 처리
  - 세션 관리
  - 자동 로그인

#### **5.3 프로필 페이지**
- **파일**: `static/pages/profile.html`
- **기능**:
  - 사용자 정보 수정
  - 학습 설정 변경
  - 알림 설정
  - 계정 삭제

---

## 🔧 세부 개발 절차

### **1. 컴포넌트 우선 개발**
```javascript
// 1. 공통 컴포넌트 시스템 구축
class UIComponents {
    static showModal(content, options) { /* 모달 표시 */ }
    static showToast(message, type) { /* 토스트 알림 */ }
    static showLoading() { /* 로딩 표시 */ }
    static hideLoading() { /* 로딩 숨김 */ }
}

// 2. 네비게이션 시스템 구축
class NavigationManager {
    constructor() {
        this.currentPage = null;
        this.menuItems = [];
    }
    
    init() { /* 네비게이션 초기화 */ }
    navigateTo(page) { /* 페이지 이동 */ }
    updateBreadcrumb() { /* 브레드크럼 업데이트 */ }
}
```

### **2. 페이지별 개발 순서**
```javascript
// 1. 대문 페이지
class LandingPage {
    init() {
        this.setupHeroSection();
        this.setupStatistics();
        this.setupAnimations();
    }
}

// 2. 문제 풀이 페이지
class QuizPage {
    constructor() {
        this.currentQuestion = null;
        this.answers = [];
        this.timer = null;
    }
    
    async loadQuestion() { /* 문제 로드 */ }
    submitAnswer(answer) { /* 답안 제출 */ }
    showResult() { /* 결과 표시 */ }
}

// 3. 대시보드 페이지
class DashboardPage {
    constructor() {
        this.charts = {};
        this.stats = {};
    }
    
    async loadStatistics() { /* 통계 로드 */ }
    renderCharts() { /* 차트 렌더링 */ }
    updateRealTime() { /* 실시간 업데이트 */ }
}

// 4. 인증 페이지
class AuthPage {
    constructor() {
        this.currentMode = 'login'; // login, register, reset
    }
    
    switchMode(mode) { /* 모드 전환 */ }
    validateForm() { /* 폼 검증 */ }
    submitForm() { /* 폼 제출 */ }
}
```

### **3. DataManager 연동**
```javascript
// 모든 UI에서 DataManager 활용
class UIDataManager {
    static async getCurrentUser() {
        return window.GEPDataManager.getUser('current');
    }
    
    static async saveQuizResult(result) {
        return window.GEPDataManager.saveQuizResult(result);
    }
    
    static async getStatistics(userId) {
        return window.GEPDataManager.getStatistics(userId);
    }
    
    static async updateUserProfile(profile) {
        return window.GEPDataManager.saveUser('current', profile);
    }
}
```

---

## 🧪 검증 방법

### **1. 컴포넌트별 테스트**
```javascript
// 컴포넌트 테스트 시스템
class UITestManager {
    static testComponents() {
        // 모달 테스트
        UIComponents.showModal('테스트 모달');
        
        // 토스트 테스트
        UIComponents.showToast('테스트 메시지', 'success');
        
        // 로딩 테스트
        UIComponents.showLoading();
        setTimeout(() => UIComponents.hideLoading(), 2000);
    }
    
    static testNavigation() {
        // 네비게이션 테스트
        const nav = new NavigationManager();
        nav.init();
        nav.navigateTo('quiz');
    }
}
```

### **2. 페이지별 기능 테스트**
```javascript
// 페이지 기능 테스트
class PageTestManager {
    static async testLandingPage() {
        const landing = new LandingPage();
        landing.init();
        
        // 애니메이션 테스트
        // 통계 카운터 테스트
        // 반응형 테스트
    }
    
    static async testQuizPage() {
        const quiz = new QuizPage();
        
        // 문제 로드 테스트
        await quiz.loadQuestion();
        
        // 답안 제출 테스트
        quiz.submitAnswer('A');
        
        // 결과 저장 테스트
        // 진행률 업데이트 테스트
    }
    
    static async testDashboardPage() {
        const dashboard = new DashboardPage();
        
        // 통계 로드 테스트
        await dashboard.loadStatistics();
        
        // 차트 렌더링 테스트
        dashboard.renderCharts();
        
        // 실시간 업데이트 테스트
    }
    
    static async testAuthPage() {
        const auth = new AuthPage();
        
        // 모드 전환 테스트
        auth.switchMode('register');
        
        // 폼 검증 테스트
        const isValid = auth.validateForm();
        
        // 폼 제출 테스트
        await auth.submitForm();
    }
}
```

### **3. 통합 테스트**
```javascript
// 전체 UI 시스템 통합 테스트
class UIIntegrationTest {
    static async runAllTests() {
        console.log('=== UI 시스템 통합 테스트 시작 ===');
        
        // 1. 컴포넌트 테스트
        UITestManager.testComponents();
        
        // 2. 네비게이션 테스트
        UITestManager.testNavigation();
        
        // 3. 페이지별 테스트
        await PageTestManager.testLandingPage();
        await PageTestManager.testQuizPage();
        await PageTestManager.testDashboardPage();
        await PageTestManager.testAuthPage();
        
        // 4. DataManager 연동 테스트
        await this.testDataManagerIntegration();
        
        console.log('=== UI 시스템 통합 테스트 완료 ===');
    }
    
    static async testDataManagerIntegration() {
        // 사용자 데이터 연동 테스트
        const user = await UIDataManager.getCurrentUser();
        
        // 문제 풀이 결과 저장 테스트
        const result = await UIDataManager.saveQuizResult({
            qcode: 'ABAA-01',
            isCorrect: true,
            userId: 'test_user'
        });
        
        // 통계 데이터 연동 테스트
        const stats = await UIDataManager.getStatistics('test_user');
    }
}
```

### **4. 성능 테스트**
```javascript
// UI 성능 테스트
class UIPerformanceTest {
    static testPageLoadTime() {
        const startTime = performance.now();
        
        // 페이지 로드 시뮬레이션
        document.addEventListener('DOMContentLoaded', () => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            
            console.log(`페이지 로드 시간: ${loadTime.toFixed(2)}ms`);
        });
    }
    
    static testAnimationPerformance() {
        // 애니메이션 성능 테스트
        const animationStart = performance.now();
        
        // 애니메이션 실행
        setTimeout(() => {
            const animationEnd = performance.now();
            const animationTime = animationEnd - animationStart;
            
            console.log(`애니메이션 실행 시간: ${animationTime.toFixed(2)}ms`);
        }, 1000);
    }
    
    static testResponsiveDesign() {
        // 반응형 디자인 테스트
        const breakpoints = [320, 768, 1024, 1440];
        
        breakpoints.forEach(width => {
            // 뷰포트 크기 변경 시뮬레이션
            console.log(`${width}px 뷰포트 테스트 완료`);
        });
    }
}
```

---

## 📊 품질 보증 체계

### **1. 코드 품질**
- **ESLint**: JavaScript 코드 품질 검사
- **Prettier**: 코드 포맷팅 자동화
- **JSDoc**: 함수 및 클래스 문서화
- **TypeScript**: 타입 안정성 (선택적)

### **2. 브라우저 호환성**
- **Chrome**: 최신 버전 완전 지원
- **Firefox**: 최신 버전 완전 지원
- **Safari**: 최신 버전 완전 지원
- **Edge**: 최신 버전 완전 지원
- **모바일 브라우저**: iOS Safari, Chrome Mobile 완전 지원

### **3. 접근성 (A11y)**
- **WCAG 2.1 AA**: 웹 접근성 가이드라인 준수
- **키보드 네비게이션**: 완전한 키보드 지원
- **스크린 리더**: NVDA, JAWS 호환성
- **색상 대비**: 최소 4.5:1 대비율 유지

### **4. 성능 최적화**
- **이미지 최적화**: WebP 포맷 사용, lazy loading
- **CSS 최적화**: Critical CSS 인라인, 나머지 지연 로드
- **JavaScript 최적화**: 코드 분할, 지연 로드
- **캐싱 전략**: 브라우저 캐싱, Service Worker (선택적)

---

## 🚀 배포 준비

### **1. 빌드 프로세스**
```bash
# 개발 환경
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run test         # 테스트 실행
npm run lint         # 코드 품질 검사
```

### **2. 파일 최적화**
- **HTML**: 압축 및 최적화
- **CSS**: 압축 및 미니파이
- **JavaScript**: 압축 및 번들링
- **이미지**: WebP 변환 및 압축

### **3. 배포 체크리스트**
- [ ] 모든 페이지 로드 테스트
- [ ] 반응형 디자인 검증
- [ ] 브라우저 호환성 테스트
- [ ] 성능 최적화 검증
- [ ] 접근성 검증
- [ ] DataManager 연동 테스트

---

## 📈 성공 지표

### **1. 기능 완성도**
- ✅ **대문 UI**: 100% 완성
- ✅ **문제 풀이 UI**: 100% 완성
- ✅ **통계 대시보드**: 100% 완성
- ✅ **사용자 관리 UI**: 100% 완성
- ✅ **반응형 디자인**: 100% 완성

### **2. 성능 지표**
- **페이지 로드 시간**: < 2초
- **애니메이션 성능**: 60fps 유지
- **모바일 성능**: < 3초 로드
- **메모리 사용량**: < 50MB

### **3. 사용자 경험**
- **직관적 네비게이션**: 사용자 테스트 통과
- **반응형 디자인**: 모든 디바이스 완벽 지원
- **접근성**: WCAG 2.1 AA 준수
- **브라우저 호환성**: 주요 브라우저 100% 지원

---

## 🎯 다음 단계 준비

### **Block 5: 통합 및 최적화**
1. **전체 시스템 통합**: Block 1-4 완전 연동
2. **성능 최적화**: 로딩 속도, 메모리 사용량 최적화
3. **사용자 테스트**: 실제 사용자 피드백 수집 및 반영
4. **배포 준비**: 프로덕션 환경 배포 준비

### **기술적 준비사항**
- ✅ **Block 1**: 프로젝트 환경 설정 완료
- ✅ **Block 2**: 데이터 변환 시스템 완료
- ✅ **Block 3**: Core Data Manager 완료
- 🔄 **Block 4**: UI 시스템 개발 진행 중

---

## ✅ 결론

**Block 4: UI 시스템 개발**은 GEP 프로젝트의 사용자 인터페이스를 완전히 구현하는 핵심 단계입니다. ACIU S4의 검증된 UI 경험을 기반으로 하되, GEP의 특성에 맞게 확장하여 **완전한 사용자 경험**을 제공할 것입니다.

**5일간의 체계적인 개발**을 통해 **대문 UI**, **문제 풀이 UI**, **통계 대시보드**, **사용자 관리 UI**를 모두 완성하고, **완전한 테스트 및 검증 시스템**을 구축하여 **Block 5: 통합 및 최적화**를 위한 견고한 기반을 마련할 것입니다.

---

**작성자**: 서대리  
**작성일**: 2025년 8월 26일  
**문서 버전**: 1.0  
**상태**: 계획 완료
