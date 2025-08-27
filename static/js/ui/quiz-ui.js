/**
 * GEP 문제 풀이 UI
 * 문제 로드, 답안 선택, 결과 처리, 진행률 관리
 */

class QuizUI {
    constructor() {
        this.currentQuestion = null;
        this.questions = [];
        this.currentIndex = 0;
        this.answers = [];
        this.timer = null;
        this.startTime = null;
        this.isPaused = false;
        this.settings = {
            autoSubmit: false,
            showTimer: true,
            questionTypes: ['A', 'B'], // 객관식, 진위형
            difficulties: ['EASY', 'MEDIUM', 'HARD']
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.loadQuestions();
        this.startTimer();
        console.log('✅ QuizUI 초기화 완료');
    }

    // ===== 설정 관리 =====
    loadSettings() {
        const savedSettings = localStorage.getItem('gep_quiz_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('gep_quiz_settings', JSON.stringify(this.settings));
    }

    applySettings() {
        // 자동 제출 설정
        const autoSubmitCheckbox = document.getElementById('auto-submit');
        if (autoSubmitCheckbox) {
            autoSubmitCheckbox.checked = this.settings.autoSubmit;
        }

        // 타이머 표시 설정
        const showTimerCheckbox = document.getElementById('show-timer');
        if (showTimerCheckbox) {
            showTimerCheckbox.checked = this.settings.showTimer;
            this.toggleTimerDisplay();
        }
    }

    // ===== 이벤트 리스너 =====
    setupEventListeners() {
        // 답안 선택
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-option')) {
                this.selectAnswer(e.target.closest('.answer-option'));
            }
        });

        // 버튼 이벤트
        document.getElementById('next-btn')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-btn')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('submit-btn')?.addEventListener('click', () => this.submitAnswer());
        document.getElementById('clear-btn')?.addEventListener('click', () => this.clearAnswer());
        document.getElementById('pause-btn')?.addEventListener('click', () => this.pauseQuiz());
        document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeQuiz());
        document.getElementById('exit-btn')?.addEventListener('click', () => this.exitQuiz());
        document.getElementById('continue-btn')?.addEventListener('click', () => this.continueQuiz());
        document.getElementById('review-btn')?.addEventListener('click', () => this.reviewQuestion());

        // 북마크 및 플래그
        document.getElementById('bookmark-btn')?.addEventListener('click', () => this.toggleBookmark());
        document.getElementById('flag-btn')?.addEventListener('click', () => this.toggleFlag());

        // 설정 변경
        document.getElementById('auto-submit')?.addEventListener('change', (e) => {
            this.settings.autoSubmit = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('show-timer')?.addEventListener('change', (e) => {
            this.settings.showTimer = e.target.checked;
            this.toggleTimerDisplay();
            this.saveSettings();
        });

        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // 페이지 언로드 시 경고
        window.addEventListener('beforeunload', (e) => {
            if (this.answers.length > 0) {
                e.preventDefault();
                e.returnValue = '문제 풀이 중입니다. 정말 나가시겠습니까?';
            }
        });
    }

    // ===== 문제 로드 =====
    async loadQuestions() {
        showLoading('문제를 불러오는 중...');
        
        try {
            // URL 파라미터 확인
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode') || 'basic';
            const type = urlParams.get('type') || 'broker';
            const demo = urlParams.get('demo') === 'true';

            // DataManager에서 문제 로드
            const questions = await this.getQuestionsByMode(mode, type);
            
            if (questions.length === 0) {
                showToast('문제를 찾을 수 없습니다.', 'error');
                hideLoading();
                return;
            }

            this.questions = questions;
            this.answers = new Array(questions.length).fill(null);
            
            // 첫 번째 문제 로드
            this.loadQuestion(0);
            
            // 진행률 업데이트
            this.updateProgress();
            
            hideLoading();
            showToast(`${questions.length}개의 문제가 로드되었습니다.`, 'success');
            
        } catch (error) {
            console.error('문제 로드 실패:', error);
            showToast('문제 로드에 실패했습니다.', 'error');
            hideLoading();
        }
    }

    async getQuestionsByMode(mode, type) {
        const filter = {};
        
        // 시험 유형 필터
        if (type === 'broker') {
            filter.SUBJECT = '보험중개사';
        } else if (type === 'assessor') {
            filter.SUBJECT = '보험심사역';
        } else if (type === 'adjuster') {
            filter.SUBJECT = '손해사정사';
        }

        // 모드별 필터
        switch (mode) {
            case 'random':
                // 랜덤 모드: 모든 문제 중 랜덤 선택
                break;
            case 'wrong':
                // 틀린 문제 모드: 사용자가 틀린 문제만
                const userStats = await window.GEPDataManager.getStatistics('current');
                if (userStats && userStats.wrongQuestions) {
                    filter.QCODE = { $in: userStats.wrongQuestions };
                }
                break;
            case 'exam':
                // 시험 모드: 시간 제한, 결과 저장
                this.settings.examMode = true;
                break;
            default:
                // 기본 모드: 순차적 문제 풀이
                break;
        }

        // 문제 유형 및 난이도 필터 적용
        if (this.settings.questionTypes.length > 0) {
            filter.QTYPE = { $in: this.settings.questionTypes };
        }
        
        if (this.settings.difficulties.length > 0) {
            filter.DIFFICULTY = { $in: this.settings.difficulties };
        }

        const questions = await window.GEPDataManager.getQuestions(filter);
        
        // 랜덤 모드인 경우 셔플
        if (mode === 'random') {
            return this.shuffleArray(questions);
        }
        
        return questions;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ===== 문제 표시 =====
    loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.currentIndex = index;
        this.currentQuestion = this.questions[index];
        
        // 문제 정보 업데이트
        this.updateQuestionDisplay();
        
        // 답안 옵션 생성
        this.createAnswerOptions();
        
        // 이전 답안 복원
        this.restoreAnswer();
        
        // 버튼 상태 업데이트
        this.updateButtonStates();
        
        // 북마크 및 플래그 상태 업데이트
        this.updateBookmarkAndFlag();
    }

    updateQuestionDisplay() {
        const question = this.currentQuestion;
        
        // 문제 번호
        document.getElementById('question-number').textContent = `문제 ${this.currentIndex + 1}`;
        
        // 문제 유형
        const questionType = question.QTYPE === 'A' ? '객관식' : '진위형';
        document.getElementById('question-type').textContent = questionType;
        
        // 문제 텍스트
        document.getElementById('question-text').textContent = question.QUESTION;
        
        // 문제 이미지 (있는 경우)
        const imageContainer = document.getElementById('question-image');
        if (question.IMAGE_URL) {
            const img = imageContainer.querySelector('img');
            img.src = question.IMAGE_URL;
            imageContainer.classList.remove('hidden');
        } else {
            imageContainer.classList.add('hidden');
        }
        
        // 문제 설명 (있는 경우)
        const descriptionContainer = document.getElementById('question-description');
        if (question.DESCRIPTION) {
            document.getElementById('description-text').textContent = question.DESCRIPTION;
            descriptionContainer.classList.remove('hidden');
        } else {
            descriptionContainer.classList.add('hidden');
        }
    }

    createAnswerOptions() {
        const container = document.getElementById('answer-options');
        container.innerHTML = '';
        
        const question = this.currentQuestion;
        const options = ['A', 'B', 'C', 'D'];
        
        options.forEach((option, index) => {
            const optionText = question[`OPTION${option}`];
            if (!optionText) return; // 옵션이 없는 경우 건너뛰기
            
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option gep-answer-option cursor-pointer p-4 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200';
            optionElement.dataset.option = option;
            
            optionElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 font-medium text-gray-700">
                        ${option}
                    </div>
                    <span class="text-gray-900">${optionText}</span>
                </div>
            `;
            
            container.appendChild(optionElement);
        });
    }

    // ===== 답안 선택 =====
    selectAnswer(optionElement) {
        const selectedOption = optionElement.dataset.option;
        
        // 이전 선택 해제
        document.querySelectorAll('.answer-option').forEach(el => {
            el.classList.remove('selected', 'border-blue-500', 'bg-blue-50');
        });
        
        // 새 선택 표시
        optionElement.classList.add('selected', 'border-blue-500', 'bg-blue-50');
        
        // 답안 저장
        this.answers[this.currentIndex] = selectedOption;
        
        // 선택한 답안 표시
        document.getElementById('selected-answer').textContent = selectedOption;
        
        // 자동 제출 설정이 켜져 있으면 자동 제출
        if (this.settings.autoSubmit) {
            setTimeout(() => {
                this.submitAnswer();
            }, 500);
        }
        
        // 다음 버튼 활성화
        document.getElementById('next-btn').disabled = false;
    }

    clearAnswer() {
        // 선택 해제
        document.querySelectorAll('.answer-option').forEach(el => {
            el.classList.remove('selected', 'border-blue-500', 'bg-blue-50');
        });
        
        // 답안 삭제
        this.answers[this.currentIndex] = null;
        
        // 선택한 답안 표시 초기화
        document.getElementById('selected-answer').textContent = '-';
        
        // 다음 버튼 비활성화
        document.getElementById('next-btn').disabled = true;
    }

    restoreAnswer() {
        const savedAnswer = this.answers[this.currentIndex];
        if (savedAnswer) {
            const optionElement = document.querySelector(`[data-option="${savedAnswer}"]`);
            if (optionElement) {
                optionElement.classList.add('selected', 'border-blue-500', 'bg-blue-50');
                document.getElementById('selected-answer').textContent = savedAnswer;
                document.getElementById('next-btn').disabled = false;
            }
        } else {
            document.getElementById('selected-answer').textContent = '-';
            document.getElementById('next-btn').disabled = true;
        }
    }

    // ===== 문제 네비게이션 =====
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentIndex + 1);
            this.updateProgress();
        } else {
            // 마지막 문제인 경우 제출 버튼 표시
            this.showSubmitButton();
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.loadQuestion(this.currentIndex - 1);
            this.updateProgress();
        }
    }

    // ===== 답안 제출 =====
    async submitAnswer() {
        const selectedAnswer = this.answers[this.currentIndex];
        if (!selectedAnswer) {
            showToast('답안을 선택해주세요.', 'warning');
            return;
        }

        const question = this.currentQuestion;
        const isCorrect = selectedAnswer === question.ANSWER;
        
        // 결과 표시
        this.showResult(isCorrect, selectedAnswer, question.ANSWER);
        
        // 결과 저장
        await this.saveResult(isCorrect);
        
        // 통계 업데이트
        this.updateStatistics(isCorrect);
    }

    showResult(isCorrect, selectedAnswer, correctAnswer) {
        const resultSection = document.getElementById('result-section');
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        
        // 결과 스타일 설정
        if (isCorrect) {
            resultIcon.className = 'w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4';
            resultIcon.innerHTML = '<i class="fas fa-check text-2xl text-white"></i>';
            resultTitle.textContent = '정답입니다!';
            resultTitle.className = 'text-lg font-semibold mb-2 text-green-600';
            resultMessage.textContent = '훌륭합니다! 정답을 맞추셨습니다.';
        } else {
            resultIcon.className = 'w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4';
            resultIcon.innerHTML = '<i class="fas fa-times text-2xl text-white"></i>';
            resultTitle.textContent = '틀렸습니다.';
            resultTitle.className = 'text-lg font-semibold mb-2 text-red-600';
            resultMessage.textContent = `선택한 답안: ${selectedAnswer}, 정답: ${correctAnswer}`;
        }
        
        // 해설 표시 (있는 경우)
        const explanation = document.getElementById('explanation');
        if (this.currentQuestion.EXPLANATION) {
            document.getElementById('explanation-text').textContent = this.currentQuestion.EXPLANATION;
            explanation.classList.remove('hidden');
        } else {
            explanation.classList.add('hidden');
        }
        
        // 결과 모달 표시
        resultSection.classList.remove('hidden');
    }

    async saveResult(isCorrect) {
        const quizData = {
            qcode: this.currentQuestion.QCODE,
            isCorrect: isCorrect,
            selectedAnswer: this.answers[this.currentIndex],
            correctAnswer: this.currentQuestion.ANSWER,
            timeSpent: this.getTimeSpent(),
            timestamp: new Date().toISOString()
        };
        
        try {
            await window.GEPDataManager.saveQuizResult(quizData);
        } catch (error) {
            console.error('결과 저장 실패:', error);
        }
    }

    // ===== 진행률 관리 =====
    updateProgress() {
        const current = this.currentIndex + 1;
        const total = this.questions.length;
        const progress = (current / total) * 100;
        
        // 진행률 텍스트
        document.getElementById('current-question').textContent = current;
        document.getElementById('total-questions').textContent = total;
        
        // 진행률 바
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        // 버튼 상태 업데이트
        this.updateButtonStates();
    }

    updateButtonStates() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // 이전 버튼
        prevBtn.disabled = this.currentIndex === 0;
        
        // 다음/제출 버튼
        if (this.currentIndex === this.questions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    showSubmitButton() {
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    }

    // ===== 타이머 관리 =====
    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (this.isPaused) return;
        
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }

    getTimeSpent() {
        return Date.now() - this.startTime;
    }

    toggleTimerDisplay() {
        const timerElement = document.getElementById('timer');
        const timerContainer = timerElement?.parentElement;
        
        if (this.settings.showTimer) {
            timerContainer?.classList.remove('hidden');
        } else {
            timerContainer?.classList.add('hidden');
        }
    }

    // ===== 일시정지 기능 =====
    pauseQuiz() {
        this.isPaused = true;
        document.getElementById('pause-modal').classList.remove('hidden');
    }

    resumeQuiz() {
        this.isPaused = false;
        document.getElementById('pause-modal').classList.add('hidden');
    }

    exitQuiz() {
        if (confirm('정말 나가시겠습니까? 현재까지의 진행 상황이 저장되지 않습니다.')) {
            window.location.href = '/';
        }
    }

    // ===== 북마크 및 플래그 =====
    toggleBookmark() {
        const bookmarkBtn = document.getElementById('bookmark-btn');
        const icon = bookmarkBtn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            bookmarkBtn.classList.add('text-yellow-500');
            showToast('북마크에 추가되었습니다.', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            bookmarkBtn.classList.remove('text-yellow-500');
            showToast('북마크에서 제거되었습니다.', 'info');
        }
    }

    toggleFlag() {
        const flagBtn = document.getElementById('flag-btn');
        const icon = flagBtn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            flagBtn.classList.add('text-red-500');
            showToast('문제가 플래그되었습니다.', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            flagBtn.classList.remove('text-red-500');
            showToast('플래그가 제거되었습니다.', 'info');
        }
    }

    updateBookmarkAndFlag() {
        // 북마크 및 플래그 상태 복원 (실제로는 서버에서 가져와야 함)
        // 여기서는 기본 상태로 초기화
        const bookmarkBtn = document.getElementById('bookmark-btn');
        const flagBtn = document.getElementById('flag-btn');
        
        bookmarkBtn.classList.remove('text-yellow-500');
        flagBtn.classList.remove('text-red-500');
        
        bookmarkBtn.querySelector('i').className = 'far fa-bookmark';
        flagBtn.querySelector('i').className = 'far fa-flag';
    }

    // ===== 키보드 단축키 =====
    handleKeyboard(e) {
        if (this.isPaused) return;
        
        switch (e.key) {
            case '1':
            case 'a':
            case 'A':
                this.selectAnswerByKey('A');
                break;
            case '2':
            case 'b':
            case 'B':
                this.selectAnswerByKey('B');
                break;
            case '3':
            case 'c':
            case 'C':
                this.selectAnswerByKey('C');
                break;
            case '4':
            case 'd':
            case 'D':
                this.selectAnswerByKey('D');
                break;
            case 'Enter':
                e.preventDefault();
                this.submitAnswer();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextQuestion();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prevQuestion();
                break;
            case ' ':
                e.preventDefault();
                this.pauseQuiz();
                break;
        }
    }

    selectAnswerByKey(option) {
        const optionElement = document.querySelector(`[data-option="${option}"]`);
        if (optionElement) {
            this.selectAnswer(optionElement);
        }
    }

    // ===== 통계 업데이트 =====
    updateStatistics(isCorrect) {
        // 실시간 통계 업데이트
        const totalAnswered = this.answers.filter(answer => answer !== null).length;
        const correctCount = this.answers.filter((answer, index) => {
            if (answer === null) return false;
            return answer === this.questions[index].ANSWER;
        }).length;
        
        const accuracy = totalAnswered > 0 ? (correctCount / totalAnswered * 100).toFixed(1) : 0;
        
        // 통계를 화면에 표시 (선택적)
        console.log(`정답률: ${accuracy}% (${correctCount}/${totalAnswered})`);
    }

    // ===== 유틸리티 메서드 =====
    continueQuiz() {
        document.getElementById('result-section').classList.add('hidden');
        this.nextQuestion();
    }

    reviewQuestion() {
        document.getElementById('result-section').classList.add('hidden');
        // 현재 문제를 다시 표시 (결과 없이)
    }

    // ===== 완료 처리 =====
    async finishQuiz() {
        const totalQuestions = this.questions.length;
        const answeredQuestions = this.answers.filter(answer => answer !== null).length;
        const correctAnswers = this.answers.filter((answer, index) => {
            if (answer === null) return false;
            return answer === this.questions[index].ANSWER;
        }).length;
        
        const accuracy = (correctAnswers / totalQuestions * 100).toFixed(1);
        const timeSpent = this.getTimeSpent();
        
        // 최종 결과 저장
        const finalResult = {
            totalQuestions,
            answeredQuestions,
            correctAnswers,
            accuracy: parseFloat(accuracy),
            timeSpent,
            answers: this.answers,
            completedAt: new Date().toISOString()
        };
        
        try {
            await window.GEPDataManager.saveQuizResult(finalResult);
            showToast('퀴즈가 완료되었습니다!', 'success');
            
            // 결과 페이지로 이동
            setTimeout(() => {
                window.location.href = `/dashboard.html?result=${encodeURIComponent(JSON.stringify(finalResult))}`;
            }, 2000);
            
        } catch (error) {
            console.error('최종 결과 저장 실패:', error);
            showToast('결과 저장에 실패했습니다.', 'error');
        }
    }
}

// 전역 인스턴스 생성
window.quizUI = new QuizUI();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 GEP 문제 풀이 페이지 로드 완료');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (window.quizUI && window.quizUI.timer) {
        clearInterval(window.quizUI.timer);
    }
});

