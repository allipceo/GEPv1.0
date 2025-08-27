/**
 * QManager - 진위형 문제 관리 시스템
 * 핵심 로직 및 데이터 관리
 */

class QManager {
    constructor() {
        this.originalQuestions = [];
        this.derivedQuestions = [];
        this.questionMappings = {};
        this.selectedOriginal = null;
        this.changes = {
            added: [],
            modified: [],
            deleted: []
        };
        this.isLoading = false;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    async init() {
        try {
            this.showLoading(true);
            await this.loadData();
            this.setupEventListeners();
            this.renderUI();
            this.updateStatistics();
            this.showNotification('QManager가 성공적으로 로드되었습니다.', 'success');
        } catch (error) {
            console.error('QManager 초기화 실패:', error);
            this.showNotification('데이터 로딩 중 오류가 발생했습니다.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * 데이터 로딩
     */
    async loadData() {
        try {
            // 기출문제 로딩
            const originalResponse = await fetch('/static/data/gep_master_v1.0.json');
            if (!originalResponse.ok) {
                throw new Error('기출문제 데이터 로딩 실패');
            }
            const originalData = await originalResponse.json();
            this.originalQuestions = originalData.questions || [];
            
            // 파생문제 로딩
            const derivedResponse = await fetch('/api/get-questions');
            if (!derivedResponse.ok) {
                throw new Error('파생문제 데이터 로딩 실패');
            }
            const derivedData = await derivedResponse.json();
            this.derivedQuestions = derivedData.questions || [];
            
            // 데이터 매핑 생성
            this.createQuestionMappings();
            
            console.log(`데이터 로딩 완료: 기출문제 ${this.originalQuestions.length}개, 파생문제 ${this.derivedQuestions.length}개`);
        } catch (error) {
            console.error('데이터 로딩 오류:', error);
            throw error;
        }
    }
    
    /**
     * 데이터 매핑 생성
     */
    createQuestionMappings() {
        this.questionMappings = {};
        
        // 기출문제별로 파생문제 그룹화
        this.derivedQuestions.forEach(derived => {
            const sourceQCODE = derived.SOURCE_QCODE;
            if (!this.questionMappings[sourceQCODE]) {
                const original = this.findOriginalQuestion(sourceQCODE);
                this.questionMappings[sourceQCODE] = {
                    original: original,
                    derived: []
                };
            }
            this.questionMappings[sourceQCODE].derived.push(derived);
        });
        
        console.log(`데이터 매핑 완료: ${Object.keys(this.questionMappings).length}개 기출문제에 파생문제 매핑됨`);
    }
    
    /**
     * 기출문제 찾기
     */
    findOriginalQuestion(qcode) {
        return this.originalQuestions.find(q => q.QCODE === qcode);
    }
    
    /**
     * 파생문제 찾기
     */
    findDerivedQuestion(qcode) {
        return this.derivedQuestions.find(q => q.QCODE === qcode);
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 검색 및 필터링
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // 필터 변경 시 자동 검색
        document.getElementById('roundFilter').addEventListener('change', () => this.handleSearch());
        document.getElementById('layerFilter').addEventListener('change', () => this.handleSearch());
        
        // 액션 버튼들
        document.getElementById('addNewBtn').addEventListener('click', () => this.addNewQuestion());
        document.getElementById('selectAllBtn').addEventListener('click', () => this.selectAllQuestions());
        document.getElementById('deselectAllBtn').addEventListener('click', () => this.deselectAllQuestions());
        document.getElementById('saveBtn').addEventListener('click', () => this.handleSave());
        document.getElementById('resetBtn').addEventListener('click', () => this.handleReset());
    }
    
    /**
     * 검색 처리
     */
    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedRound = document.getElementById('roundFilter').value;
        const selectedLayer = document.getElementById('layerFilter').value;
        
        let filteredQuestions = this.originalQuestions;
        
        // 회차 필터링
        if (selectedRound) {
            filteredQuestions = filteredQuestions.filter(question => 
                Math.floor(question.EROUND).toString() === selectedRound
            );
        }
        
        // 레이어 필터링
        if (selectedLayer) {
            filteredQuestions = filteredQuestions.filter(question => 
                question.LAYER1 === selectedLayer
            );
        }
        
        // 검색어 필터링
        if (searchTerm) {
            filteredQuestions = filteredQuestions.filter(question => 
                question.QUESTION.toLowerCase().includes(searchTerm) ||
                question.QCODE.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderOriginalQuestions(filteredQuestions);
    }
    
    /**
     * 기출문제 렌더링
     */
    renderOriginalQuestions(questions) {
        const container = document.getElementById('originalQuestionList');
        
        if (questions.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">검색 결과가 없습니다.</div>';
            return;
        }
        
        container.innerHTML = questions.map(question => `
            <div class="original-question-item p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" 
                 data-qcode="${question.QCODE}">
                <div class="text-sm text-gray-600 mb-1">
                    ${question.QCODE} | ${Math.floor(question.EROUND)}회 ${question.LAYER1} ${question.QNUM || question.QNUMBER}번
                </div>
                <div class="text-sm text-gray-800 line-clamp-2">
                    ${question.QUESTION}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    파생문제: ${this.questionMappings[question.QCODE]?.derived.length || 0}개
                </div>
            </div>
        `).join('');
        
        // 클릭 이벤트 추가
        container.querySelectorAll('.original-question-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectOriginalQuestion(item.dataset.qcode);
            });
        });
    }
    
    /**
     * 기출문제 선택
     */
    selectOriginalQuestion(qcode) {
        // 이전 선택 해제
        document.querySelectorAll('.original-question-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 현재 선택 강조
        const selectedItem = document.querySelector(`[data-qcode="${qcode}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        this.selectedOriginal = this.questionMappings[qcode];
        this.renderSelectedOriginalInfo();
        this.renderDerivedQuestions();
        this.updateStatistics();
    }
    
    /**
     * 선택된 기출문제 정보 렌더링
     */
    renderSelectedOriginalInfo() {
        const infoDiv = document.getElementById('selectedOriginalInfo');
        
        if (!this.selectedOriginal || !this.selectedOriginal.original) {
            infoDiv.innerHTML = '<p class="text-sm text-gray-600">기출문제를 선택해주세요</p>';
            return;
        }
        
        const original = this.selectedOriginal.original;
        const derivedCount = this.selectedOriginal.derived.length;
        
        infoDiv.innerHTML = `
            <div class="grid grid-cols-2 gap-4 mb-3">
                <div><strong>🔑 QCODE:</strong> ${original.QCODE}</div>
                <div><strong>📚 출처:</strong> ${Math.floor(original.EROUND)}회 ${original.LAYER1} ${original.QNUM || original.QNUMBER}번</div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-3">
                <div><strong>✅ 정답:</strong> ${original.ANSWER}</div>
                <div><strong>📝 파생문제:</strong> ${derivedCount}개</div>
            </div>
            <div class="bg-white p-3 rounded border">
                <strong>📝 원본 문제:</strong><br>
                ${original.QUESTION}
            </div>
        `;
    }
    
    /**
     * 파생문제 렌더링
     */
    renderDerivedQuestions() {
        const container = document.getElementById('derivedQuestionsContainer');
        
        if (!this.selectedOriginal) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8"><p>기출문제를 선택하면 파생문제들이 여기에 표시됩니다</p></div>';
            return;
        }
        
        const derived = this.selectedOriginal.derived;
        
        if (derived.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <p>이 기출문제에는 파생문제가 없습니다.</p>
                    <button class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onclick="qManager.addNewQuestion()">
                        + 첫 번째 파생문제 추가
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = derived.map((question, index) => `
            <div class="derived-question-item" data-qcode="${question.QCODE}">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="question-checkbox" data-qcode="${question.QCODE}" checked>
                        <span class="text-sm font-medium text-gray-700">문제 ${index + 1}</span>
                        <span class="text-xs text-gray-500">(${question.QCODE})</span>
                    </div>
                    <button class="text-red-600 hover:text-red-800 text-sm" onclick="qManager.deleteQuestion('${question.QCODE}')">
                        삭제
                    </button>
                </div>
                <textarea class="question-input" data-qcode="${question.QCODE}" placeholder="진위형 문제를 입력하세요...">${question.QUESTION}</textarea>
                <div class="answer-options">
                    <label>
                        <input type="radio" name="answer-${question.QCODE}" value="O" ${question.ANSWER === 'O' ? 'checked' : ''}>
                        O (맞음)
                    </label>
                    <label>
                        <input type="radio" name="answer-${question.QCODE}" value="X" ${question.ANSWER === 'X' ? 'checked' : ''}>
                        X (틀림)
                    </label>
                </div>
            </div>
        `).join('');
        
        // 이벤트 리스너 추가
        this.setupDerivedQuestionEventListeners();
    }
    
    /**
     * 파생문제 이벤트 리스너 설정
     */
    setupDerivedQuestionEventListeners() {
        // 체크박스 이벤트
        document.querySelectorAll('.question-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateQuestionStatus(checkbox.dataset.qcode, checkbox.checked);
            });
        });
        
        // 텍스트 입력 이벤트
        document.querySelectorAll('.question-input').forEach(input => {
            input.addEventListener('input', () => {
                this.markQuestionAsModified(input.dataset.qcode);
            });
        });
        
        // 라디오 버튼 이벤트
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.markQuestionAsModified(radio.name.replace('answer-', ''));
            });
        });
    }
    
    /**
     * 새 문제 추가
     */
    addNewQuestion() {
        if (!this.selectedOriginal) {
            this.showNotification('먼저 기출문제를 선택해주세요.', 'warning');
            return;
        }
        
        const original = this.selectedOriginal.original;
        const newQCODE = this.generateNewQCODE(original.QCODE);
        
        const newQuestion = {
            QCODE: newQCODE,
            QUESTION: '',
            ANSWER: 'O',
            QTYPE: 'B',
            SOURCE_QCODE: original.QCODE,
            PARENT_INFO: {
                QCODE: original.QCODE,
                EROUND: original.EROUND,
                LAYER1: original.LAYER1,
                ETITLE: original.ETITLE,
                ECLASS: original.ECLASS
            },
            CREATED_AT: new Date().toISOString(),
            STATUS: 'ACTIVE'
        };
        
        // 파생문제 목록에 추가
        this.selectedOriginal.derived.push(newQuestion);
        this.derivedQuestions.push(newQuestion);
        
        // UI 업데이트
        this.renderDerivedQuestions();
        this.updateStatistics();
        this.showNotification('새로운 파생문제가 추가되었습니다.', 'success');
    }
    
    /**
     * 새 QCODE 생성
     */
    generateNewQCODE(sourceQCODE) {
        const existingDerived = this.selectedOriginal.derived;
        const maxNumber = existingDerived.length > 0 
            ? Math.max(...existingDerived.map(q => {
                const match = q.QCODE.match(/-B(\d+)$/);
                return match ? parseInt(match[1]) : 0;
            }))
            : 0;
        
        return `${sourceQCODE}-B${maxNumber + 1}`;
    }
    
    /**
     * 문제 삭제
     */
    deleteQuestion(qcode) {
        if (confirm('이 파생문제를 삭제하시겠습니까?')) {
            // 파생문제 목록에서 제거
            this.selectedOriginal.derived = this.selectedOriginal.derived.filter(q => q.QCODE !== qcode);
            this.derivedQuestions = this.derivedQuestions.filter(q => q.QCODE !== qcode);
            
            // UI 업데이트
            this.renderDerivedQuestions();
            this.updateStatistics();
            this.showNotification('파생문제가 삭제되었습니다.', 'success');
        }
    }
    
    /**
     * 문제 상태 업데이트
     */
    updateQuestionStatus(qcode, isActive) {
        const question = this.findDerivedQuestion(qcode);
        if (question) {
            question.STATUS = isActive ? 'ACTIVE' : 'INACTIVE';
        }
        this.updateStatistics();
    }
    
    /**
     * 문제 수정 표시
     */
    markQuestionAsModified(qcode) {
        const questionItem = document.querySelector(`[data-qcode="${qcode}"]`);
        if (questionItem) {
            questionItem.classList.add('modified');
        }
        this.updateStatistics();
    }
    
    /**
     * 전체 선택
     */
    selectAllQuestions() {
        document.querySelectorAll('.question-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            this.updateQuestionStatus(checkbox.dataset.qcode, true);
        });
        this.updateStatistics();
    }
    
    /**
     * 전체 해제
     */
    deselectAllQuestions() {
        document.querySelectorAll('.question-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            this.updateQuestionStatus(checkbox.dataset.qcode, false);
        });
        this.updateStatistics();
    }
    
    /**
     * 통계 업데이트
     */
    updateStatistics() {
        const totalOriginal = this.originalQuestions.length;
        const totalDerived = this.derivedQuestions.length;
        
        // 헤더 통계
        document.getElementById('totalOriginalCount').textContent = `기출문제: ${totalOriginal}개`;
        document.getElementById('totalDerivedCount').textContent = `파생문제: ${totalDerived}개`;
        
        // 선택된 파생문제 수
        const selectedCount = document.querySelectorAll('.question-checkbox:checked').length;
        document.getElementById('selectedCount').textContent = `선택됨: ${selectedCount}개`;
        
        // 수정된 문제 수
        const modifiedCount = document.querySelectorAll('.derived-question-item.modified').length;
        document.getElementById('modifiedCount').textContent = `수정됨: ${modifiedCount}개`;
    }
    
    /**
     * UI 렌더링
     */
    renderUI() {
        // 회차 필터 옵션 생성
        const roundFilter = document.getElementById('roundFilter');
        const rounds = [...new Set(this.originalQuestions.map(q => Math.floor(q.EROUND)))].sort((a, b) => a - b);
        
        rounds.forEach(round => {
            const option = document.createElement('option');
            option.value = round.toString();
            option.textContent = `${round}회`;
            roundFilter.appendChild(option);
        });
        
        // 초기 기출문제 목록 렌더링
        this.renderOriginalQuestions(this.originalQuestions);
    }
    
    /**
     * 저장 처리
     */
    async handleSave() {
        try {
            this.showLoading(true);
            
            // 변경사항 수집
            const changes = this.collectChanges();
            
            if (changes.added.length === 0 && changes.modified.length === 0 && changes.deleted.length === 0) {
                this.showNotification('저장할 변경사항이 없습니다.', 'warning');
                return;
            }
            
            // 백업 생성
            await this.createBackup();
            
            // 변경사항 적용
            await this.applyChanges(changes);
            
            // 파일 저장
            await this.saveToFile();
            
            this.showNotification('변경사항이 성공적으로 저장되었습니다.', 'success');
            this.changes = { added: [], modified: [], deleted: [] };
            
        } catch (error) {
            console.error('저장 실패:', error);
            this.showNotification('저장 중 오류가 발생했습니다.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * 변경사항 수집
     */
    collectChanges() {
        const changes = {
            added: [],
            modified: [],
            deleted: []
        };
        
        // 체크박스 해제된 문제들 (삭제 대상)
        document.querySelectorAll('.question-checkbox:not(:checked)').forEach(checkbox => {
            changes.deleted.push(checkbox.dataset.qcode);
        });
        
        // 수정된 문제들
        document.querySelectorAll('.question-input').forEach(input => {
            const qcode = input.dataset.qcode;
            const originalQuestion = this.findDerivedQuestion(qcode);
            if (originalQuestion && originalQuestion.QUESTION !== input.value) {
                changes.modified.push({
                    qcode: qcode,
                    question: input.value,
                    answer: this.getSelectedAnswer(qcode)
                });
            }
        });
        
        return changes;
    }
    
    /**
     * 선택된 답안 가져오기
     */
    getSelectedAnswer(qcode) {
        const radio = document.querySelector(`input[name="answer-${qcode}"]:checked`);
        return radio ? radio.value : 'O';
    }
    
    /**
     * 백업 생성
     */
    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupData = {
            timestamp: timestamp,
            originalQuestions: this.originalQuestions,
            derivedQuestions: this.derivedQuestions
        };
        
        // 로컬 스토리지에 백업 저장
        localStorage.setItem(`qmanager_backup_${timestamp}`, JSON.stringify(backupData));
        console.log('백업 생성 완료:', timestamp);
    }
    
    /**
     * 변경사항 적용
     */
    async applyChanges(changes) {
        // 삭제된 문제들 처리
        changes.deleted.forEach(qcode => {
            this.derivedQuestions = this.derivedQuestions.filter(q => q.QCODE !== qcode);
        });
        
        // 수정된 문제들 처리
        changes.modified.forEach(change => {
            const question = this.findDerivedQuestion(change.qcode);
            if (question) {
                question.QUESTION = change.question;
                question.ANSWER = change.answer;
                question.UPDATED_AT = new Date().toISOString();
            }
        });
        
        console.log('변경사항 적용 완료:', changes);
    }
    
    /**
     * 파일 저장
     */
    async saveToFile() {
        const saveData = {
            metadata: {
                version: "QManager V1.0",
                total_original_questions: this.originalQuestions.length,
                total_derived_questions: this.derivedQuestions.length,
                last_update: new Date().toISOString()
            },
            questions: this.derivedQuestions
        };
        
        const response = await fetch('/api/save-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });
        
        if (!response.ok) {
            throw new Error('파일 저장 실패');
        }
        
        console.log('파일 저장 완료');
    }
    
    /**
     * 초기화 처리
     */
    handleReset() {
        if (confirm('모든 변경사항을 취소하고 초기 상태로 되돌리시겠습니까?')) {
            location.reload();
        }
    }
    
    /**
     * 로딩 표시
     */
    showLoading(show) {
        this.isLoading = show;
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }
    
    /**
     * 알림 메시지 표시
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        const iconEl = document.getElementById('notificationIcon');
        
        messageEl.textContent = message;
        
        // 아이콘 설정
        let icon = '';
        switch (type) {
            case 'success':
                icon = '✅';
                notification.classList.add('success');
                break;
            case 'error':
                icon = '❌';
                notification.classList.add('error');
                break;
            case 'warning':
                icon = '⚠️';
                notification.classList.add('warning');
                break;
            default:
                icon = 'ℹ️';
        }
        
        iconEl.textContent = icon;
        notification.classList.remove('hidden');
        
        // 3초 후 자동 숨김
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
}

// 전역 인스턴스 생성
let qManager;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    qManager = new QManager();
});
