/**
 * 문제 풀이 인터페이스 클래스
 * @class QuestionSolver
 * @description 필터링된 문제를 풀 수 있는 인터페이스를 제공
 */
class QuestionSolver {
    constructor() {
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = {};
        this.selectedAnswer = null;
        
        // DOM 요소
        this.questionText = document.getElementById('question-text');
        this.answerOptions = document.getElementById('answer-options');
        this.progressText = document.getElementById('progress-text');
        this.progressBar = document.getElementById('progress-bar');
        this.submitButton = document.getElementById('submit-answer');
        this.prevButton = document.getElementById('prev-question');
        this.nextButton = document.getElementById('next-question');
        this.resultContainer = document.getElementById('result-container');
        this.resultMessage = document.getElementById('result-message');
        this.correctAnswer = document.getElementById('correct-answer');
        this.continueButton = document.getElementById('continue-question');
        
        this.bindEvents();
    }
    
    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 답안 제출 버튼
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => {
                this.submitAnswer();
            });
        }
        
        // 이전 문제 버튼
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.previousQuestion();
            });
        }
        
        // 다음 문제 버튼
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextQuestion();
            });
        }
        
        // 계속하기 버튼
        if (this.continueButton) {
            this.continueButton.addEventListener('click', () => {
                this.hideResult();
                this.nextQuestion();
            });
        }
    }
    
    /**
     * 문제 로드
     * @param {Array} questions - 문제 배열
     */
    loadQuestions(questions) {
        console.log(`문제 로드: ${questions.length}개 문제`);
        
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.selectedAnswer = null;
        
        if (this.questions.length > 0) {
            this.renderCurrentQuestion();
            this.updateProgress();
        } else {
            this.showNoQuestionsMessage();
        }
    }
    
    /**
     * 현재 문제 렌더링
     */
    renderCurrentQuestion() {
        if (this.questions.length === 0 || this.currentQuestionIndex >= this.questions.length) {
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        
        // QUESTION 필드 절대 노터치 원칙 준수
        // QUESTION 필드는 그대로 표시만 함
        if (this.questionText) {
            this.questionText.textContent = question.QUESTION;
        }
        
        // 선택지 렌더링
        this.renderAnswerOptions();
        
        // 버튼 상태 업데이트
        this.updateButtonStates();
        
        // 결과 숨기기
        this.hideResult();
        
        console.log(`문제 렌더링 완료: ${question.QCODE}`);
    }
    
    /**
     * 선택지 렌더링
     */
    renderAnswerOptions() {
        if (!this.answerOptions) return;
        
        this.answerOptions.innerHTML = '';
        
        // 4개 선택지 생성 (1, 2, 3, 4)
        for (let i = 1; i <= 4; i++) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors';
            optionDiv.dataset.answer = i.toString();
            
            optionDiv.innerHTML = `
                <div class="flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full mr-3">
                    <span class="text-sm font-medium text-gray-700">${i}</span>
                </div>
                <span class="text-gray-700">선택지 ${i}</span>
            `;
            
            // 선택 이벤트
            optionDiv.addEventListener('click', () => {
                this.selectAnswer(i.toString());
            });
            
            this.answerOptions.appendChild(optionDiv);
        }
    }
    
    /**
     * 답안 선택
     * @param {string} answer - 선택된 답안
     */
    selectAnswer(answer) {
        this.selectedAnswer = answer;
        
        // 모든 선택지에서 선택 상태 제거
        const options = this.answerOptions.querySelectorAll('[data-answer]');
        options.forEach(option => {
            option.classList.remove('bg-blue-50', 'border-blue-500');
            option.classList.add('border-gray-300');
            
            const circle = option.querySelector('div');
            circle.classList.remove('bg-blue-500', 'border-blue-500');
            circle.classList.add('border-gray-300');
        });
        
        // 선택된 답안 하이라이트
        const selectedOption = this.answerOptions.querySelector(`[data-answer="${answer}"]`);
        if (selectedOption) {
            selectedOption.classList.remove('border-gray-300');
            selectedOption.classList.add('bg-blue-50', 'border-blue-500');
            
            const circle = selectedOption.querySelector('div');
            circle.classList.remove('border-gray-300');
            circle.classList.add('bg-blue-500', 'border-blue-500');
        }
        
        // 제출 버튼 활성화
        if (this.submitButton) {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    /**
     * 답안 제출
     */
    submitAnswer() {
        if (!this.selectedAnswer) {
            alert('답안을 선택해주세요.');
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const questionId = question.QCODE;
        
        // 답안 저장
        this.userAnswers[questionId] = {
            answer: this.selectedAnswer,
            isCorrect: this.checkAnswer(this.selectedAnswer, question.ANSWER),
            timestamp: new Date().toISOString()
        };
        
        // 결과 표시
        this.showResult();
        
        console.log(`답안 제출: ${questionId} - ${this.selectedAnswer}`);
    }
    
    /**
     * 답안 정답 여부 확인
     * @param {string} userAnswer - 사용자 답안
     * @param {string} correctAnswer - 정답
     * @returns {boolean} 정답 여부
     */
    checkAnswer(userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    }
    
    /**
     * 결과 표시
     */
    showResult() {
        if (!this.resultContainer) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[question.QCODE];
        
        // 결과 메시지
        if (this.resultMessage) {
            if (userAnswer.isCorrect) {
                this.resultMessage.textContent = '정답입니다! 🎉';
                this.resultMessage.className = 'text-lg font-semibold mb-4 text-green-600';
            } else {
                this.resultMessage.textContent = '틀렸습니다. 😔';
                this.resultMessage.className = 'text-lg font-semibold mb-4 text-red-600';
            }
        }
        
        // 정답 표시
        if (this.correctAnswer) {
            this.correctAnswer.innerHTML = `
                <strong>정답:</strong> ${question.ANSWER}번
                ${!userAnswer.isCorrect ? `<br><span class="text-gray-500">(선택하신 답안: ${userAnswer.answer}번)</span>` : ''}
            `;
        }
        
        // 결과 컨테이너 표시
        this.resultContainer.classList.remove('hidden');
        
        // 제출 버튼 비활성화
        if (this.submitButton) {
            this.submitButton.disabled = true;
        }
    }
    
    /**
     * 결과 숨기기
     */
    hideResult() {
        if (this.resultContainer) {
            this.resultContainer.classList.add('hidden');
        }
    }
    
    /**
     * 이전 문제로 이동
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.selectedAnswer = null;
            this.renderCurrentQuestion();
            this.updateProgress();
        }
    }
    
    /**
     * 다음 문제로 이동
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.selectedAnswer = null;
            this.renderCurrentQuestion();
            this.updateProgress();
        } else {
            this.showCompletionMessage();
        }
    }
    
    /**
     * 진행률 업데이트
     */
    updateProgress() {
        const current = this.currentQuestionIndex + 1;
        const total = this.questions.length;
        const percentage = (current / total) * 100;
        
        if (this.progressText) {
            this.progressText.textContent = `${current} / ${total}`;
        }
        
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }
    }
    
    /**
     * 버튼 상태 업데이트
     */
    updateButtonStates() {
        // 이전 버튼
        if (this.prevButton) {
            this.prevButton.disabled = this.currentQuestionIndex === 0;
        }
        
        // 다음 버튼
        if (this.nextButton) {
            this.nextButton.disabled = this.currentQuestionIndex === this.questions.length - 1;
        }
        
        // 제출 버튼
        if (this.submitButton) {
            this.submitButton.disabled = !this.selectedAnswer;
        }
    }
    
    /**
     * 문제 없음 메시지 표시
     */
    showNoQuestionsMessage() {
        if (this.questionText) {
            this.questionText.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-gray-500 text-lg mb-4">선택한 과목에 문제가 없습니다.</div>
                    <button onclick="window.subjectSelector.showSubjectSelection()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        다른 과목 선택하기
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * 완료 메시지 표시
     */
    showCompletionMessage() {
        if (this.questionText) {
            const correctCount = Object.values(this.userAnswers).filter(answer => answer.isCorrect).length;
            const totalCount = this.questions.length;
            const accuracy = ((correctCount / totalCount) * 100).toFixed(1);
            
            this.questionText.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-2xl font-bold text-gray-900 mb-4">학습 완료! 🎉</div>
                    <div class="text-lg text-gray-700 mb-6">
                        총 ${totalCount}문제 중 ${correctCount}문제 정답<br>
                        정답률: ${accuracy}%
                    </div>
                    <div class="space-x-4">
                        <button onclick="window.questionSolver.restart()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                            다시 풀기
                        </button>
                        <button onclick="window.subjectSelector.showSubjectSelection()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
                            다른 과목 선택
                        </button>
                    </div>
                </div>
            `;
        }
        
        // 버튼들 숨기기
        if (this.submitButton) this.submitButton.style.display = 'none';
        if (this.prevButton) this.prevButton.style.display = 'none';
        if (this.nextButton) this.nextButton.style.display = 'none';
    }
    
    /**
     * 다시 시작
     */
    restart() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.selectedAnswer = null;
        
        // 버튼들 다시 표시
        if (this.submitButton) this.submitButton.style.display = 'block';
        if (this.prevButton) this.prevButton.style.display = 'block';
        if (this.nextButton) this.nextButton.style.display = 'block';
        
        this.renderCurrentQuestion();
        this.updateProgress();
    }
    
    /**
     * 사용자 답안 반환
     * @returns {Object} 사용자 답안 객체
     */
    getUserAnswers() {
        return this.userAnswers;
    }
    
    /**
     * 정답률 계산
     * @returns {number} 정답률 (0-100)
     */
    getAccuracy() {
        if (Object.keys(this.userAnswers).length === 0) return 0;
        
        const correctCount = Object.values(this.userAnswers).filter(answer => answer.isCorrect).length;
        return (correctCount / Object.keys(this.userAnswers).length) * 100;
    }
}

// 전역 인스턴스 생성
window.questionSolver = new QuestionSolver();

