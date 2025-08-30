/**
 * 과목 선택 UI 클래스
 * @class SubjectSelector
 * @description 사용자가 과목을 선택할 수 있는 직관적인 인터페이스를 제공
 */
class SubjectSelector {
    constructor() {
        // LAYER2 과목 목록 (AB20AA 체계 기준)
        this.subjects = [
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
        
        this.selectedSubject = null;
        this.subjectStats = {}; // 과목별 통계 정보
        
        // DOM 요소
        this.subjectGrid = document.getElementById('subject-grid');
        this.subjectSelection = document.getElementById('subject-selection');
        this.questionSolving = document.getElementById('question-solving');
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        this.renderSubjectList();
        this.bindEvents();
    }
    
    /**
     * 과목 목록 렌더링
     */
    renderSubjectList() {
        if (!this.subjectGrid) return;
        
        this.subjectGrid.innerHTML = '';
        
        this.subjects.forEach(subject => {
            const subjectCard = this.createSubjectCard(subject);
            this.subjectGrid.appendChild(subjectCard);
        });
    }
    
    /**
     * 과목 카드 생성
     * @param {string} subject - 과목명
     * @returns {HTMLElement} 과목 카드 요소
     */
    createSubjectCard(subject) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-300';
        card.dataset.subject = subject;
        
        const stats = this.subjectStats[subject] || { totalQuestions: 0, rounds: [] };
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">${subject}</h3>
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold">${subject.charAt(0)}</span>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">총 문제 수:</span>
                    <span class="font-semibold text-gray-900">${stats.totalQuestions}개</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">포함 회차:</span>
                    <span class="font-semibold text-gray-900">${stats.rounds.length > 0 ? stats.rounds.join(', ') : '확인 중'}</span>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                    학습 시작
                </button>
            </div>
        `;
        
        return card;
    }
    
    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        if (this.subjectGrid) {
            this.subjectGrid.addEventListener('click', (e) => {
                const card = e.target.closest('[data-subject]');
                if (card) {
                    const subject = card.dataset.subject;
                    this.handleSubjectSelection(subject);
                }
            });
        }
        
        // 과목 선택으로 돌아가기 버튼
        const backButton = document.getElementById('back-to-subjects');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showSubjectSelection();
            });
        }
    }
    
    /**
     * 과목 선택 이벤트 처리
     * @param {string} subject - 선택된 과목명
     */
    handleSubjectSelection(subject) {
        console.log('과목 선택:', subject);
        
        this.selectedSubject = subject;
        this.updateUI();
        
        // 과목별 문제 로드
        this.loadSubjectQuestions(subject);
    }
    
    /**
     * UI 업데이트
     */
    updateUI() {
        // 과목 선택 섹션 숨기기
        if (this.subjectSelection) {
            this.subjectSelection.classList.add('hidden');
        }
        
        // 문제 풀이 섹션 표시
        if (this.questionSolving) {
            this.questionSolving.classList.remove('hidden');
        }
        
        // 선택된 과목 제목 업데이트
        const titleElement = document.getElementById('selected-subject-title');
        if (titleElement) {
            titleElement.textContent = this.selectedSubject;
        }
        
        // 과목 통계 업데이트
        this.updateSubjectStats();
    }
    
    /**
     * 과목 통계 업데이트
     */
    updateSubjectStats() {
        const stats = this.subjectStats[this.selectedSubject];
        const statsElement = document.getElementById('subject-stats');
        
        if (statsElement && stats) {
            statsElement.textContent = `총 ${stats.totalQuestions}개 문제 | ${stats.rounds.length}개 회차`;
        }
    }
    
    /**
     * 과목 선택 화면 표시
     */
    showSubjectSelection() {
        if (this.subjectSelection) {
            this.subjectSelection.classList.remove('hidden');
        }
        
        if (this.questionSolving) {
            this.questionSolving.classList.add('hidden');
        }
        
        this.selectedSubject = null;
    }
    
    /**
     * 과목별 문제 로드
     * @param {string} subject - 과목명
     */
    loadSubjectQuestions(subject) {
        // 로딩 표시
        this.showLoading();
        
        // SubjectFilter를 통해 과목별 문제 필터링
        if (window.subjectFilter) {
            const filteredQuestions = window.subjectFilter.filterBySubject(subject);
            
            // QuestionSolver에 문제 전달
            if (window.questionSolver) {
                window.questionSolver.loadQuestions(filteredQuestions);
            }
            
            // 로딩 숨기기
            this.hideLoading();
        } else {
            console.error('SubjectFilter가 로드되지 않았습니다.');
            this.hideLoading();
        }
    }
    
    /**
     * 과목별 통계 정보 설정
     * @param {Object} stats - 과목별 통계 정보
     */
    setSubjectStats(stats) {
        this.subjectStats = stats;
        this.renderSubjectList(); // 통계 정보로 카드 업데이트
    }
    
    /**
     * 로딩 표시
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }
    
    /**
     * 로딩 숨기기
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
    
    /**
     * 선택된 과목 반환
     * @returns {string|null} 선택된 과목명
     */
    getSelectedSubject() {
        return this.selectedSubject;
    }
}

// 전역 인스턴스 생성
window.subjectSelector = new SubjectSelector();

