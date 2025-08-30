/**
 * 3단계 과목별 기출문제 풀기 기능 메인 통합 스크립트
 * @description 모든 모듈을 연결하고 초기화를 담당
 */
class SubjectLearningManager {
    constructor() {
        this.isInitialized = false;
        this.modules = {
            subjectSelector: null,
            subjectFilter: null,
            questionSolver: null
        };
        
        this.init();
    }
    
    /**
     * 초기화
     */
    async init() {
        console.log('3단계 과목별 기출문제 풀기 기능 초기화 시작...');
        
        try {
            // 모듈 초기화 대기
            await this.waitForModules();
            
            // 모듈 연결
            this.connectModules();
            
            // 초기 상태 설정
            this.setInitialState();
            
            // 이벤트 리스너 등록
            this.bindGlobalEvents();
            
            this.isInitialized = true;
            console.log('3단계 과목별 기출문제 풀기 기능 초기화 완료!');
            
        } catch (error) {
            console.error('초기화 실패:', error);
        }
    }
    
    /**
     * 모듈 로드 대기
     */
    async waitForModules() {
        const maxWaitTime = 5000; // 5초
        const checkInterval = 100; // 100ms마다 체크
        let elapsedTime = 0;
        
        while (elapsedTime < maxWaitTime) {
            if (window.subjectSelector && window.subjectFilter && window.questionSolver) {
                this.modules.subjectSelector = window.subjectSelector;
                this.modules.subjectFilter = window.subjectFilter;
                this.modules.questionSolver = window.questionSolver;
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, checkInterval));
            elapsedTime += checkInterval;
        }
        
        throw new Error('모듈 로드 시간 초과');
    }
    
    /**
     * 모듈 연결
     */
    connectModules() {
        console.log('모듈 연결 중...');
        
        // SubjectFilter의 통계 계산 완료 후 SubjectSelector 업데이트
        if (this.modules.subjectFilter && this.modules.subjectSelector) {
            // SubjectFilter의 통계 정보를 SubjectSelector에 전달
            const stats = this.modules.subjectFilter.subjectStats;
            this.modules.subjectSelector.setSubjectStats(stats);
        }
        
        console.log('모듈 연결 완료');
    }
    
    /**
     * 초기 상태 설정
     */
    setInitialState() {
        // 과목 선택 화면 표시
        if (this.modules.subjectSelector) {
            this.modules.subjectSelector.showSubjectSelection();
        }
        
        // 로딩 숨기기
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
    
    /**
     * 전역 이벤트 리스너 등록
     */
    bindGlobalEvents() {
        // 페이지 로드 완료 이벤트
        window.addEventListener('load', () => {
            console.log('페이지 로드 완료');
            this.onPageLoad();
        });
        
        // 페이지 언로드 이벤트 (데이터 저장)
        window.addEventListener('beforeunload', () => {
            this.saveUserProgress();
        });
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    /**
     * 페이지 로드 완료 처리
     */
    onPageLoad() {
        // 데이터 무결성 검증
        if (this.modules.subjectFilter) {
            const integrityCheck = this.modules.subjectFilter.validateDataIntegrity();
            console.log('데이터 무결성 검증:', integrityCheck);
        }
        
        // 성능 모니터링 시작
        this.startPerformanceMonitoring();
    }
    
    /**
     * 성능 모니터링 시작
     */
    startPerformanceMonitoring() {
        // 페이지 로드 시간 측정
        const loadTime = performance.now();
        console.log(`페이지 로드 시간: ${loadTime.toFixed(2)}ms`);
        
        // 메모리 사용량 모니터링 (가능한 경우)
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                console.log(`메모리 사용량: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            }, 30000); // 30초마다 체크
        }
    }
    
    /**
     * 키보드 단축키 처리
     * @param {KeyboardEvent} e - 키보드 이벤트
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: 과목 선택으로 돌아가기
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (this.modules.subjectSelector) {
                this.modules.subjectSelector.showSubjectSelection();
            }
        }
        
        // 숫자 키 1-4: 답안 선택
        if (e.key >= '1' && e.key <= '4') {
            if (this.modules.questionSolver) {
                this.modules.questionSolver.selectAnswer(e.key);
            }
        }
        
        // Enter: 답안 제출
        if (e.key === 'Enter') {
            if (this.modules.questionSolver) {
                this.modules.questionSolver.submitAnswer();
            }
        }
        
        // 화살표 키: 문제 이동
        if (e.key === 'ArrowLeft') {
            if (this.modules.questionSolver) {
                this.modules.questionSolver.previousQuestion();
            }
        }
        
        if (e.key === 'ArrowRight') {
            if (this.modules.questionSolver) {
                this.modules.questionSolver.nextQuestion();
            }
        }
    }
    
    /**
     * 사용자 진행 상황 저장
     */
    saveUserProgress() {
        try {
            const progress = {
                timestamp: new Date().toISOString(),
                selectedSubject: this.modules.subjectSelector?.getSelectedSubject(),
                userAnswers: this.modules.questionSolver?.getUserAnswers(),
                accuracy: this.modules.questionSolver?.getAccuracy()
            };
            
            localStorage.setItem('gep_subject_learning_progress', JSON.stringify(progress));
            console.log('사용자 진행 상황 저장 완료');
        } catch (error) {
            console.error('진행 상황 저장 실패:', error);
        }
    }
    
    /**
     * 사용자 진행 상황 복원
     */
    loadUserProgress() {
        try {
            const savedProgress = localStorage.getItem('gep_subject_learning_progress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                console.log('저장된 진행 상황:', progress);
                
                // 24시간 이내 데이터만 복원
                const savedTime = new Date(progress.timestamp);
                const now = new Date();
                const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    return progress;
                } else {
                    localStorage.removeItem('gep_subject_learning_progress');
                }
            }
        } catch (error) {
            console.error('진행 상황 복원 실패:', error);
        }
        
        return null;
    }
    
    /**
     * 디버그 정보 출력
     */
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            modules: {
                subjectSelector: !!this.modules.subjectSelector,
                subjectFilter: !!this.modules.subjectFilter,
                questionSolver: !!this.modules.questionSolver
            },
            data: {
                totalQuestions: this.modules.subjectFilter?.getTotalQuestions(),
                originalQuestionsCount: this.modules.subjectFilter?.getOriginalQuestionsCount(),
                selectedSubject: this.modules.subjectSelector?.getSelectedSubject(),
                currentQuestionIndex: this.modules.questionSolver?.currentQuestionIndex,
                userAnswersCount: Object.keys(this.modules.questionSolver?.getUserAnswers() || {}).length
            }
        };
    }
    
    /**
     * 시스템 상태 체크
     */
    checkSystemStatus() {
        const status = {
            modules: {
                subjectSelector: '정상',
                subjectFilter: '정상',
                questionSolver: '정상'
            },
            data: '정상',
            performance: '정상'
        };
        
        // 모듈 상태 체크
        if (!this.modules.subjectSelector) status.modules.subjectSelector = '오류';
        if (!this.modules.subjectFilter) status.modules.subjectFilter = '오류';
        if (!this.modules.questionSolver) status.modules.questionSolver = '오류';
        
        // 데이터 상태 체크
        if (this.modules.subjectFilter?.getTotalQuestions() === 0) {
            status.data = '데이터 없음';
        }
        
        console.log('시스템 상태:', status);
        return status;
    }
}

// 전역 인스턴스 생성 및 초기화
window.subjectLearningManager = new SubjectLearningManager();

// 개발용 디버그 함수들
window.debugSubjectLearning = {
    getInfo: () => window.subjectLearningManager.getDebugInfo(),
    checkStatus: () => window.subjectLearningManager.checkSystemStatus(),
    getModules: () => window.subjectLearningManager.modules
};

console.log('3단계 과목별 기출문제 풀기 기능 스크립트 로드 완료');

