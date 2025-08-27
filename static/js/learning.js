/**
 * GEP 학습 시스템
 * 실제 문제 풀이 기능 구현
 * 
 * @author 서대리
 * @version 1.0
 * @date 2025-08-26
 */

class LearningSystem {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.quizResults = [];
        this.isQuizActive = false;
        this.isPaused = false;
        this.selectedSession = null;
        this.allQuestions = []; // 전체 문제 데이터
        
        this.initialize();
    }

    /**
     * 시스템 초기화
     */
    async initialize() {
        console.log('🚀 학습 시스템 초기화 시작...');
        
        try {
            // 데이터 로드
            await this.loadQuestions();
            
            // 이벤트 리스너 설정
            this.setupEventListeners();
            
            // 대문에서 선택된 회차 확인
            const selectedSession = localStorage.getItem('selected_session');
            const skipStartScreen = localStorage.getItem('skip_start_screen');
            
            if (selectedSession) {
                // 선택된 회차가 있으면 바로 해당 회차로 시작
                this.selectedSession = selectedSession;
                this.filterQuestionsBySession(selectedSession);
                this.startQuizWithSession();
                // 선택된 회차 정보 삭제 (한 번만 사용)
                localStorage.removeItem('selected_session');
                localStorage.removeItem('skip_start_screen');
            } else {
                // 초기 화면 설정
                this.updateStartScreen();
            }
            
            console.log('✅ 학습 시스템 초기화 완료');
            
        } catch (error) {
            console.error('❌ 학습 시스템 초기화 실패:', error);
            this.showError('데이터 로드에 실패했습니다.');
        }
    }

    /**
     * 문제 데이터 로드
     */
    async loadQuestions() {
        try {
            const response = await fetch('/static/data/gep_master_v1.0.json');
            const data = await response.json();
            
            if (data && data.questions && Array.isArray(data.questions)) {
                this.allQuestions = data.questions; // 전체 문제 저장
                this.questions = data.questions; // 기본값으로 전체 문제 설정
                console.log(`📚 ${this.questions.length}개의 문제 로드 완료`);
            } else {
                throw new Error('문제 데이터 형식이 올바르지 않습니다.');
            }
            
        } catch (error) {
            console.error('문제 데이터 로드 실패:', error);
            throw error;
        }
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 학습 시작 버튼
        document.getElementById('startLearning').addEventListener('click', () => {
            this.showSessionSelect();
        });

        // 회차 선택 버튼들
        document.querySelectorAll('.session-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectSession(btn.dataset.session);
            });
        });

        // 뒤로 가기 버튼
        document.getElementById('backToStart').addEventListener('click', () => {
            this.showStartScreen();
        });

        // 선택한 회차로 시작 버튼
        document.getElementById('startWithSession').addEventListener('click', () => {
            this.startQuizWithSession();
        });

        // 4지선다형 옵션 버튼들
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`option${i}`).addEventListener('click', () => {
                this.selectOption(i.toString());
            });
        }

        // 이전 문제 버튼
        document.getElementById('prevQuestion').addEventListener('click', () => {
            this.prevQuestion();
        });

        // 정답 확인 버튼
        document.getElementById('checkAnswer').addEventListener('click', () => {
            this.checkAnswer();
        });

        // 다음 문제 버튼
        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.nextQuestion();
        });

        // 다시 시작 버튼
        document.getElementById('restartQuiz').addEventListener('click', () => {
            this.restartQuiz();
        });

        // 홈으로 버튼
        document.getElementById('goHome').addEventListener('click', () => {
            window.location.href = '/';
        });

        // 회차 간 이동 버튼들
        document.querySelectorAll('.session-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchToSession(btn.dataset.session);
            });
        });
    }

    /**
     * 회차 선택 화면 표시
     */
    showSessionSelect() {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('sessionSelectScreen').classList.remove('hidden');
        document.getElementById('questionContainer').classList.add('hidden');
        document.getElementById('resultScreen').classList.add('hidden');
    }

    /**
     * 회차 선택
     */
    selectSession(sessionNumber) {
        // 이전 선택 해제
        document.querySelectorAll('.session-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 새 선택 표시
        const selectedButton = document.querySelector(`[data-session="${sessionNumber}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
        
        this.selectedSession = sessionNumber;
        
        // 선택된 회차의 문제 필터링
        this.filterQuestionsBySession(sessionNumber);
        
        // 선택 정보 표시
        this.showSelectedSessionInfo();
        
        // 시작 버튼 활성화
        document.getElementById('startWithSession').disabled = false;
    }

    /**
     * 회차별 문제 필터링
     */
    filterQuestionsBySession(sessionNumber) {
        console.log(`🔍 ${sessionNumber}회 필터링 시작...`);
        console.log(`전체 문제 수: ${this.allQuestions.length}`);
        
        // EROUND 값을 문자열로 변환하여 정확히 비교 (예: "21.0")
        const targetRound = sessionNumber.toString() + '.0';
        
        this.questions = this.allQuestions.filter(question => {
            return question.EROUND === targetRound;
        });
        
        console.log(`📚 ${sessionNumber}회 문제: ${this.questions.length}개`);
        
        // 예상 문제 수와 비교
        let expectedCount;
        if (sessionNumber === 22) {
            expectedCount = 159; // 22회는 159개
        } else if (sessionNumber <= 22) {
            expectedCount = 160; // 20~21회는 160개
        } else {
            expectedCount = 120; // 23~30회는 120개
        }
        
        if (this.questions.length !== expectedCount) {
            console.warn(`⚠️ 예상 문제 수(${expectedCount})와 실제 문제 수(${this.questions.length})가 다릅니다.`);
        }
        
        // 필터링된 문제들의 정보 확인
        if (this.questions.length > 0) {
            console.log('필터링된 문제들의 정보:', this.questions.slice(0, 3).map(q => ({
                INDEX: q.INDEX,
                EROUND: q.EROUND
            })));
        } else {
            console.log('❌ 필터링된 문제가 없습니다!');
        }
    }

    /**
     * 선택된 회차 정보 표시
     */
    showSelectedSessionInfo() {
        const infoContainer = document.getElementById('selectedSessionInfo');
        const sessionText = document.getElementById('selectedSessionText');
        const sessionCount = document.getElementById('selectedSessionCount');
        
        sessionText.textContent = `${this.selectedSession}회`;
        sessionCount.textContent = this.questions.length;
        
        infoContainer.classList.remove('hidden');
    }

    /**
     * 선택한 회차로 학습 시작
     */
    startQuizWithSession() {
        if (!this.selectedSession || this.questions.length === 0) {
            this.showError('회차를 선택해주세요.');
            return;
        }

        this.isQuizActive = true;
        this.currentQuestionIndex = 0;
        this.quizResults = [];
        this.selectedAnswer = null;

        // 화면 전환
        this.showQuestionScreen();
        
        // 첫 번째 문제 표시
        this.displayCurrentQuestion();
        
        console.log(`🎯 ${this.selectedSession}회 학습 시작`);
    }

    /**
     * 학습 시작 (기존 메서드 - 호환성 유지)
     */
    startQuiz() {
        this.startQuizWithSession();
    }

    /**
     * 일시정지 토글 (더 이상 사용되지 않음)
     */
    togglePause() {
        // 이 메서드는 더 이상 사용되지 않습니다
        console.log('일시정지 기능은 제거되었습니다.');
    }

    /**
     * 현재 문제 표시
     */
    displayCurrentQuestion() {
        console.log(`📖 문제 ${this.currentQuestionIndex + 1} 표시 시작...`);
        
        if (this.currentQuestionIndex >= this.questions.length) {
            console.log('🏁 모든 문제 완료 - 학습 종료');
            this.finishQuiz();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        console.log(`📝 문제 정보: ${question.ETITLE} ${question.EROUND} ${question.LAYER1} ${question.QNUMBER}`);
        
        // 문제 번호 업데이트
        const questionNumber = document.getElementById('questionNumber');
        if (questionNumber) {
            questionNumber.textContent = `문제 ${this.currentQuestionIndex + 1}`;
            console.log('✅ 문제 번호 업데이트');
        }
        
        // 문제 출처 메타 표시 (예: 손해보험중개사 제30회 공통 1번)
        const etitle = question.ETITLE || '';
        // EROUND에서 .0 제거하여 정수만 표시
        const eroundValue = question.EROUND ? parseFloat(question.EROUND) : null;
        const eround = eroundValue ? `제${eroundValue}회` : '';
        const layer1 = question.LAYER1 || '';
        const qnumber = question.QNUMBER ? `${question.QNUMBER}번` : '';
        const parts = [etitle, eround, layer1, qnumber].filter(Boolean).join(' ');
        
        const questionMeta = document.getElementById('questionMeta');
        if (questionMeta) {
            questionMeta.textContent = parts || '출처 정보 없음';
            console.log('✅ 문제 출처 메타 업데이트');
        }
        
        // 문제 텍스트 업데이트
        const questionText = document.getElementById('questionText');
        if (questionText) {
            questionText.textContent = question.QUESTION || '문제 내용이 없습니다.';
            console.log('✅ 문제 텍스트 업데이트');
        }
        
        // 옵션 생성
        this.createOptions(question);
        
        // 진행률 업데이트
        this.updateProgress();
        
        // 버튼 상태 초기화
        this.resetButtonStates();
        
        console.log(`✅ 문제 ${this.currentQuestionIndex + 1} 표시 완료`);
    }

    /**
     * 옵션 생성
     */
    createOptions(question) {
        // 숫자 버튼만 사용하므로 별도 텍스트 설정 불필요
        // 향후 도우미 텍스트가 필요하면 여기서 처리
    }

    /**
     * 옵션 선택
     */
    selectOption(option) {
        console.log(`🎯 옵션 ${option} 선택됨`);
        
        // 이전 선택 해제
        const allOptions = document.querySelectorAll('.option-btn');
        allOptions.forEach(btn => btn.classList.remove('selected'));
        
        // 새 선택 표시
        const selectedButton = document.getElementById(`option${option}`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
            console.log(`✅ 옵션 ${option} 버튼 선택 상태 설정`);
        } else {
            console.error(`❌ 옵션 ${option} 버튼을 찾을 수 없습니다`);
        }
        
        this.selectedAnswer = option;
        
        // 정답 확인 버튼 활성화
        const checkButton = document.getElementById('checkAnswer');
        if (checkButton) {
            checkButton.disabled = false;
            console.log('✅ 정답 확인 버튼 활성화');
        } else {
            console.error('❌ 정답 확인 버튼을 찾을 수 없습니다');
        }
    }

    /**
     * 정답 확인
     */
    checkAnswer() {
        console.log('🔍 정답 확인 시작...');
        
        if (!this.selectedAnswer) {
            this.showError('답안을 선택해주세요.');
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const correctAnswer = question.ANSWER;
        const isCorrect = this.selectedAnswer === correctAnswer;

        console.log(`📝 사용자 답안: ${this.selectedAnswer}, 정답: ${correctAnswer}, 결과: ${isCorrect ? '정답' : '오답'}`);

        // 결과 저장
        this.quizResults.push({
            questionIndex: this.currentQuestionIndex,
            questionId: question.QCODE,
            userAnswer: this.selectedAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        });

        // 옵션 색상 변경 및 결과 표시
        this.showAnswerResult(correctAnswer, isCorrect);

        // 다음 문제 버튼 활성화
        const nextButton = document.getElementById('nextQuestion');
        const checkButton = document.getElementById('checkAnswer');
        
        if (nextButton) {
            nextButton.disabled = false;
            console.log('✅ 다음 문제 버튼 활성화');
        }
        
        if (checkButton) {
            checkButton.disabled = true;
            console.log('✅ 정답 확인 버튼 비활성화');
        }

        console.log(`✅ 정답 확인 완료: ${this.selectedAnswer} (정답: ${correctAnswer}, ${isCorrect ? '정답' : '오답'})`);
    }

    /**
     * 정답 결과 표시
     */
    showAnswerResult(correctAnswer, isCorrect) {
        const allOptions = document.querySelectorAll('.option-btn');
        
        // 모든 옵션 버튼 비활성화
        allOptions.forEach(button => {
            button.disabled = true;
        });

        // 정답 표시
        const correctButton = document.getElementById(`option${correctAnswer}`);
        if (correctButton) {
            correctButton.classList.add('correct');
        }

        // 오답 표시 (사용자가 선택했지만 틀린 경우)
        if (!isCorrect) {
            const selectedButton = document.getElementById(`option${this.selectedAnswer}`);
            if (selectedButton) {
                selectedButton.classList.add('incorrect');
            }
        }

        // 결과 메시지 표시
        this.showResultMessage(isCorrect, correctAnswer);
    }

    /**
     * 결과 메시지 표시
     */
    showResultMessage(isCorrect, correctAnswer) {
        const resultContainer = document.getElementById('answerResult');
        const resultIcon = document.getElementById('resultIcon');
        const resultMessage = document.getElementById('resultMessage');
        const correctAnswerText = document.getElementById('correctAnswerText');

        if (isCorrect) {
            resultContainer.className = 'mt-4 p-4 rounded-lg bg-green-50 border border-green-200';
            resultIcon.className = 'fas fa-check-circle text-green-500 text-3xl mr-3';
            resultMessage.textContent = '정답입니다!';
            resultMessage.className = 'font-extrabold text-green-700 text-3xl';
            correctAnswerText.textContent = '';
        } else {
            resultContainer.className = 'mt-4 p-4 rounded-lg bg-red-50 border border-red-200';
            resultIcon.className = 'fas fa-times-circle text-red-500 text-3xl mr-3';
            resultMessage.textContent = '틀렸습니다';
            resultMessage.className = 'font-extrabold text-red-700 text-3xl';
            correctAnswerText.textContent = `정답: ${correctAnswer}번`;
            correctAnswerText.className = 'text-lg text-red-600 mt-2';
        }

        resultContainer.classList.remove('hidden');
    }

    /**
     * 이전 문제
     */
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.selectedAnswer = null;
            this.displayCurrentQuestion();
        }
    }

    /**
     * 다음 문제
     */
    nextQuestion() {
        console.log('⏭️ 다음 문제로 이동...');
        
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        
        console.log(`📊 현재 문제 인덱스: ${this.currentQuestionIndex}, 총 문제 수: ${this.questions.length}`);
        
        if (this.currentQuestionIndex >= this.questions.length) {
            console.log('🏁 마지막 문제 완료 - 학습 종료');
            this.finishQuiz();
        } else {
            console.log(`📖 ${this.currentQuestionIndex + 1}번 문제 표시`);
            this.displayCurrentQuestion();
        }
    }

    /**
     * 학습 완료
     */
    finishQuiz() {
        this.isQuizActive = false;
        
        // 결과 계산
        const correctCount = this.quizResults.filter(result => result.isCorrect).length;
        const totalCount = this.quizResults.length;
        const correctRate = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

        // 결과 화면 업데이트
        document.getElementById('finalCorrect').textContent = correctCount;
        document.getElementById('finalIncorrect').textContent = totalCount - correctCount;
        document.getElementById('finalRate').textContent = `${correctRate}%`;

        // 결과 저장
        this.saveResults();

        // 결과 화면 표시
        this.showResultScreen();
        
        console.log(`학습 완료: ${correctCount}/${totalCount} (${correctRate}%)`);
    }

    /**
     * 결과 저장
     */
    saveResults() {
        try {
            // localStorage에 결과 저장
            const existingResults = JSON.parse(localStorage.getItem('gep_quiz_results') || '[]');
            const newResults = {
                date: new Date().toISOString(),
                session: this.selectedSession, // 회차 정보 추가
                results: this.quizResults,
                summary: {
                    total: this.quizResults.length,
                    correct: this.quizResults.filter(r => r.isCorrect).length,
                    incorrect: this.quizResults.filter(r => !r.isCorrect).length
                }
            };
            
            existingResults.push(newResults);
            localStorage.setItem('gep_quiz_results', JSON.stringify(existingResults));
            
            // 회차별 진행 상황 저장
            this.saveSessionProgress();
            
            console.log('결과 저장 완료');
        } catch (error) {
            console.error('결과 저장 실패:', error);
        }
    }

    /**
     * 회차별 진행 상황 저장
     */
    saveSessionProgress() {
        try {
            const sessionProgress = JSON.parse(localStorage.getItem('gep_session_progress') || '{}');
            
            // 현재 회차의 진행 상황 업데이트
            const currentProgress = sessionProgress[this.selectedSession] || {
                lastQuestionIndex: 0,
                totalAnswered: 0,
                totalCorrect: 0
            };
            
            // 마지막 문제 인덱스 업데이트
            currentProgress.lastQuestionIndex = this.currentQuestionIndex;
            currentProgress.totalAnswered += this.quizResults.length;
            currentProgress.totalCorrect += this.quizResults.filter(r => r.isCorrect).length;
            
            sessionProgress[this.selectedSession] = currentProgress;
            localStorage.setItem('gep_session_progress', JSON.stringify(sessionProgress));
            
            console.log(`${this.selectedSession}회 진행 상황 저장: ${currentProgress.lastQuestionIndex + 1}번 문제까지`);
        } catch (error) {
            console.error('진행 상황 저장 실패:', error);
        }
    }

    /**
     * 회차별 진행 상황 로드
     */
    loadSessionProgress(sessionNumber) {
        try {
            const sessionProgress = JSON.parse(localStorage.getItem('gep_session_progress') || '{}');
            return sessionProgress[sessionNumber] || {
                lastQuestionIndex: 0,
                totalAnswered: 0,
                totalCorrect: 0
            };
        } catch (error) {
            console.error('진행 상황 로드 실패:', error);
            return {
                lastQuestionIndex: 0,
                totalAnswered: 0,
                totalCorrect: 0
            };
        }
    }

    /**
     * 학습 재시작
     */
    restartQuiz() {
        this.showStartScreen();
    }

    /**
     * 진행률 업데이트
     */
    updateProgress() {
        // 진행률 표시 요소들이 제거되었으므로 콘솔에만 표시
        const progress = this.questions.length > 0 ? 
            ((this.currentQuestionIndex + 1) / this.questions.length) * 100 : 0;
        
        console.log(`진행률: ${this.currentQuestionIndex + 1}/${this.questions.length} (${Math.round(progress)}%)`);
    }

    /**
     * 버튼 상태 초기화
     */
    resetButtonStates() {
        console.log('🔄 버튼 상태 초기화 시작...');
        
        // 옵션 버튼 초기화
        const allOptions = document.querySelectorAll('.option-btn');
        allOptions.forEach(button => {
            button.classList.remove('selected', 'correct', 'incorrect');
            button.disabled = false;
        });
        console.log(`✅ ${allOptions.length}개 옵션 버튼 초기화 완료`);

        // 정답 결과 숨기기
        const answerResult = document.getElementById('answerResult');
        if (answerResult) {
            answerResult.classList.add('hidden');
            console.log('✅ 정답 결과 숨김');
        }

        // 컨트롤 버튼 상태 설정
        const checkButton = document.getElementById('checkAnswer');
        const nextButton = document.getElementById('nextQuestion');
        const prevButton = document.getElementById('prevQuestion');
        
        if (checkButton) checkButton.disabled = true;
        if (nextButton) nextButton.disabled = true;
        if (prevButton) prevButton.disabled = this.currentQuestionIndex === 0;
        
        console.log('✅ 컨트롤 버튼 상태 설정 완료');

        // 선택된 답안 초기화
        this.selectedAnswer = null;
        console.log('✅ 선택된 답안 초기화 완료');
    }

    /**
     * 시작 화면 표시
     */
    showStartScreen() {
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('questionContainer').classList.add('hidden');
        document.getElementById('resultScreen').classList.add('hidden');
        
        this.updateStartScreen();
    }

    /**
     * 문제 화면 표시
     */
    showQuestionScreen() {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('questionContainer').classList.remove('hidden');
        document.getElementById('resultScreen').classList.add('hidden');
        
        // 회차 간 이동 UI 표시
        document.getElementById('sessionNavigation').classList.remove('hidden');
        this.updateSessionNavigation();
    }

    /**
     * 회차 간 이동 UI 업데이트
     */
    updateSessionNavigation() {
        document.querySelectorAll('.session-nav-btn').forEach(btn => {
            const sessionNumber = btn.dataset.session;
            const progress = this.loadSessionProgress(sessionNumber);
            const totalQuestions = this.getTotalQuestions(sessionNumber);
            
            // 현재 회차 표시
            if (sessionNumber === this.selectedSession) {
                btn.classList.add('current');
            } else {
                btn.classList.remove('current');
            }
            
            // 진행 상황 표시
            if (progress.totalAnswered > 0) {
                btn.textContent = `${sessionNumber}회 (${progress.totalAnswered}/${totalQuestions})`;
                btn.classList.add('has-progress');
            } else {
                btn.textContent = `${sessionNumber}회`;
                btn.classList.remove('has-progress');
            }
        });
    }

    /**
     * 다른 회차로 이동
     */
    switchToSession(sessionNumber) {
        if (sessionNumber === this.selectedSession) {
            return; // 같은 회차면 무시
        }

        // 현재 진행 상황 저장
        this.saveSessionProgress();
        
        // 새 회차로 전환
        this.selectedSession = sessionNumber;
        this.filterQuestionsBySession(sessionNumber);
        
        // 이어풀기: 마지막 문제 다음부터 시작
        const progress = this.loadSessionProgress(sessionNumber);
        this.currentQuestionIndex = progress.lastQuestionIndex;
        
        // 문제 표시
        this.displayCurrentQuestion();
        
        // UI 업데이트
        this.updateSessionNavigation();
        
        console.log(`${sessionNumber}회로 이동 (${this.currentQuestionIndex + 1}번 문제부터)`);
    }

    /**
     * 총 문제 수 반환
     */
    getTotalQuestions(sessionNumber) {
        const sessionNum = parseInt(sessionNumber);
        if (sessionNum <= 22) return 160;  // 20~22회는 모두 160개
        return 120;  // 23~30회는 120개
    }

    /**
     * 결과 화면 표시
     */
    showResultScreen() {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('questionContainer').classList.add('hidden');
        document.getElementById('resultScreen').classList.remove('hidden');
    }

    /**
     * 시작 화면 업데이트
     */
    updateStartScreen() {
        // 기존 결과 로드
        const existingResults = JSON.parse(localStorage.getItem('gep_quiz_results') || '[]');
        const totalCompleted = existingResults.reduce((sum, result) => sum + result.summary.total, 0);
        const totalCorrect = existingResults.reduce((sum, result) => sum + result.summary.correct, 0);
        const overallRate = totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0;

        document.getElementById('totalQuestionsDisplay').textContent = this.questions.length.toLocaleString();
        document.getElementById('completedQuestions').textContent = totalCompleted.toLocaleString();
        document.getElementById('correctRate').textContent = `${overallRate}%`;
    }

    /**
     * 오류 표시
     */
    showError(message) {
        // 간단한 알림 표시
        alert(message);
    }
}

// 학습 시스템 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.learningSystem = new LearningSystem();
});

console.log('📚 학습 시스템 로드 완료');
