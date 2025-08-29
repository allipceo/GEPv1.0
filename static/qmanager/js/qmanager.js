/**
 * QManager - 진위형 문제 관리 시스템
 * 8개 고정 슬롯 시스템 기반
 */

class QManager {
    constructor() {
        this.masterData = [];           // 기출문제 데이터
        this.qmanagerData = {};         // QManager 진위형 문제 데이터
        this.selectedQuestion = null;   // 현재 선택된 기출문제
        this.isLoading = false;         // 로딩 상태
        
        // DOM 요소들
        this.elements = {
            loadingSpinner: document.getElementById('loading-spinner'),
            statusIndicator: document.getElementById('status-indicator'),
            saveBtn: document.getElementById('save-btn'),
            uploadBtn: document.getElementById('upload-btn'),
            searchInput: document.getElementById('search-input'),
            masterQuestionsList: document.getElementById('master-questions-list'),
            selectedQuestion: document.getElementById('selected-question'),
            selectedQuestionInfo: document.getElementById('selected-question-info'),
            questionDetails: document.getElementById('question-details'),
            slotsContainer: document.getElementById('slots-container'),
            filledSlots: document.getElementById('filled-slots'),
            emptySlots: document.getElementById('empty-slots'),
            progressBar: document.getElementById('progress-bar'),
            totalMaster: document.getElementById('total-master'),
            totalDerived: document.getElementById('total-derived'),
            notificationModal: document.getElementById('notification-modal'),
            modalIcon: document.getElementById('modal-icon'),
            modalTitle: document.getElementById('modal-title'),
            modalMessage: document.getElementById('modal-message'),
            modalClose: document.getElementById('modal-close')
        };
        
        this.init();
    }
    
    /**
     * 초기화
     */
    async init() {
        try {
            this.showLoading(true);
            this.updateStatus('데이터 로딩 중...');
            
            // 데이터 로드
            await this.loadData();
            
            // UI 초기화
            this.initializeUI();
            
            // 이벤트 리스너 등록
            this.bindEvents();
            
            this.updateStatus('준비 완료');
            this.showNotification('success', 'QManager가 성공적으로 로드되었습니다.');
            
        } catch (error) {
            console.error('QManager 초기화 오류:', error);
            this.showNotification('error', 'QManager 초기화 중 오류가 발생했습니다.');
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * 데이터 로드
     */
    async loadData() {
        try {
            // 기출문제 데이터 로드
            const masterResponse = await fetch('/api/qmanager/master-questions');
            if (!masterResponse.ok) throw new Error('기출문제 데이터 로드 실패');
            const masterResult = await masterResponse.json();
            this.masterData = masterResult.questions || [];
            
            // QManager 진위형 문제 데이터 로드
            const qmanagerResponse = await fetch('/api/qmanager/qmanager-questions');
            if (!qmanagerResponse.ok) throw new Error('QManager 데이터 로드 실패');
            const qmanagerResult = await qmanagerResponse.json();
            this.qmanagerData = qmanagerResult.questions || {};
            
            console.log(`📊 데이터 로드 완료: 기출문제 ${this.masterData.length}개, QManager 데이터 ${Object.keys(this.qmanagerData).length}개`);
            
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            throw error;
        }
    }
    
    /**
     * UI 초기화
     */
    initializeUI() {
        this.renderMasterQuestionsList();
        this.updateStatistics();
        this.createSlotsContainer();
    }
    
    /**
     * 이벤트 리스너 등록
     */
    bindEvents() {
        // 검색 기능
        this.elements.searchInput.addEventListener('input', (e) => {
            this.filterMasterQuestions(e.target.value);
        });
        
        // 저장 버튼
        this.elements.saveBtn.addEventListener('click', () => {
            this.handleSave();
        });
        
        // 업로드 버튼
        this.elements.uploadBtn.addEventListener('click', () => {
            this.handleUpload();
        });
        
        // 모달 닫기
        this.elements.modalClose.addEventListener('click', () => {
            this.hideNotification();
        });
        
        // 모달 배경 클릭 시 닫기
        this.elements.notificationModal.addEventListener('click', (e) => {
            if (e.target === this.elements.notificationModal) {
                this.hideNotification();
            }
        });
    }
    
    /**
     * 기출문제 목록 렌더링
     */
    renderMasterQuestionsList() {
        const container = this.elements.masterQuestionsList;
        container.innerHTML = '';
        
        this.masterData.forEach(question => {
            const hasDerived = this.qmanagerData[question.QCODE] && 
                              Object.values(this.qmanagerData[question.QCODE].slots).some(slot => slot.exists);
            
            const item = document.createElement('div');
            item.className = `question-item ${hasDerived ? 'has-derived' : ''}`;
            item.dataset.qcode = question.QCODE;
            
            item.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="font-medium text-gray-900">${question.QCODE}</div>
                        <div class="text-sm text-gray-600 line-clamp-2">${question.QUESTION}</div>
                        <div class="text-xs text-gray-500 mt-1">
                            답: ${question.ANSWER} | 회차: ${question.EROUND} | 분야: ${question.LAYER1}
                        </div>
                    </div>
                    ${hasDerived ? '<span class="text-green-500 text-xs">✓</span>' : ''}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectMasterQuestion(question.QCODE);
            });
            
            container.appendChild(item);
        });
    }
    
    /**
     * 기출문제 검색 필터링
     */
    filterMasterQuestions(searchTerm) {
        const items = this.elements.masterQuestionsList.querySelectorAll('.question-item');
        
        items.forEach(item => {
            const qcode = item.dataset.qcode;
            const question = this.masterData.find(q => q.QCODE === qcode);
            
            if (!question) return;
            
            const searchText = `${qcode} ${question.QUESTION} ${question.LAYER1}`.toLowerCase();
            const matches = searchText.includes(searchTerm.toLowerCase());
            
            item.style.display = matches ? 'block' : 'none';
        });
    }
    
    /**
     * 기출문제 선택
     */
    selectMasterQuestion(qcode) {
        // 이전 선택 해제
        const prevSelected = this.elements.masterQuestionsList.querySelector('.question-item.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        
        // 새 선택 표시
        const newSelected = this.elements.masterQuestionsList.querySelector(`[data-qcode="${qcode}"]`);
        if (newSelected) {
            newSelected.classList.add('selected');
        }
        
        this.selectedQuestion = this.masterData.find(q => q.QCODE === qcode);
        this.elements.selectedQuestion.textContent = qcode;
        
        // 기출문제 정보 표시
        this.showSelectedQuestionInfo();
        
        // 슬롯 업데이트
        this.updateSlots();
        
        console.log(`📝 기출문제 선택: ${qcode}`);
    }
    
    /**
     * 선택된 기출문제 정보 표시
     */
    showSelectedQuestionInfo() {
        if (!this.selectedQuestion) return;
        
        const info = this.selectedQuestion;
        this.elements.questionDetails.innerHTML = `
            <div class="space-y-2">
                <div><strong>문제:</strong> ${info.QUESTION}</div>
                <div><strong>답안:</strong> ${info.ANSWER}</div>
                <div><strong>회차:</strong> ${info.EROUND}</div>
                <div><strong>분야:</strong> ${info.LAYER1}</div>
            </div>
        `;
        
        this.elements.selectedQuestionInfo.classList.remove('hidden');
    }
    
    /**
     * 8개 슬롯 컨테이너 생성
     */
    createSlotsContainer() {
        const container = this.elements.slotsContainer;
        container.innerHTML = '';
        
        // 8개 슬롯 생성
        for (let i = 1; i <= 8; i++) {
            const slotName = `B${i}`;
            const slot = document.createElement('div');
            slot.className = 'slot-card empty';
            slot.dataset.slot = slotName;
            
            slot.innerHTML = `
                <div class="slot-header">
                    <div class="flex items-center space-x-2">
                        <span class="slot-number ${slotName}">${i}</span>
                        <span class="slot-title">문제 ${i}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="slot-status empty">빈 슬롯</span>
                        <button class="delete-btn" disabled onclick="qmanager.deleteSlot('${slotName}')">
                            🗑️ 삭제
                        </button>
                    </div>
                </div>
                <textarea class="question-input" placeholder="진위형 문제를 입력하세요..." disabled></textarea>
                <div class="answer-options">
                    <label class="answer-option">
                        <input type="radio" name="answer-${slotName}" value="O" class="answer-radio" disabled>
                        <span class="answer-label">O (정답)</span>
                    </label>
                    <label class="answer-option">
                        <input type="radio" name="answer-${slotName}" value="X" class="answer-radio" disabled>
                        <span class="answer-label">X (오답)</span>
                    </label>
                </div>
            `;
            
            container.appendChild(slot);
        }
    }
    
    /**
     * 슬롯 업데이트
     */
    updateSlots() {
        if (!this.selectedQuestion) {
            this.createSlotsContainer();
            return;
        }
        
        const qcode = this.selectedQuestion.QCODE;
        const questionData = this.qmanagerData[qcode];
        
        // 각 슬롯 업데이트
        for (let i = 1; i <= 8; i++) {
            const slotName = `B${i}`;
            const slotElement = this.elements.slotsContainer.querySelector(`[data-slot="${slotName}"]`);
            
            if (!slotElement) continue;
            
            const slotData = questionData?.slots?.[slotName];
            const hasData = slotData && slotData.exists;
            
            // 슬롯 상태 업데이트
            slotElement.className = `slot-card ${hasData ? 'filled' : 'empty'}`;
            
            // 상태 표시 업데이트
            const statusElement = slotElement.querySelector('.slot-status');
            statusElement.className = `slot-status ${hasData ? 'filled' : 'empty'}`;
            statusElement.textContent = hasData ? '문제 있음' : '빈 슬롯';
            
            // 입력 필드 업데이트
            const textarea = slotElement.querySelector('.question-input');
            const radioO = slotElement.querySelector('input[value="O"]');
            const radioX = slotElement.querySelector('input[value="X"]');
            const deleteBtn = slotElement.querySelector('.delete-btn');
            
            if (hasData) {
                // 데이터가 있는 경우
                textarea.value = slotData.question;
                textarea.disabled = false;
                radioO.disabled = false;
                radioX.disabled = false;
                deleteBtn.disabled = false;
                
                if (slotData.answer === 'O') radioO.checked = true;
                else if (slotData.answer === 'X') radioX.checked = true;
            } else {
                // 빈 슬롯인 경우
                textarea.value = '';
                textarea.disabled = false;
                radioO.disabled = false;
                radioX.disabled = false;
                deleteBtn.disabled = true;
                radioO.checked = false;
                radioX.checked = false;
            }
            
            // 이벤트 리스너 등록
            this.bindSlotEvents(slotElement, slotName);
        }
        
        // 통계 업데이트
        this.updateSlotStatistics();
    }
    
    /**
     * 슬롯 이벤트 리스너 등록
     */
    bindSlotEvents(slotElement, slotName) {
        const textarea = slotElement.querySelector('.question-input');
        const radioO = slotElement.querySelector('input[value="O"]');
        const radioX = slotElement.querySelector('input[value="X"]');
        
        // 문제 입력 이벤트
        textarea.addEventListener('input', () => {
            this.updateSlotData(slotName, 'question', textarea.value);
        });
        
        // 답안 선택 이벤트
        [radioO, radioX].forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.updateSlotData(slotName, 'answer', radio.value);
                }
            });
        });
    }
    
    /**
     * 슬롯 데이터 업데이트
     */
    updateSlotData(slotName, field, value) {
        if (!this.selectedQuestion) return;
        
        const qcode = this.selectedQuestion.QCODE;
        
        // QManager 데이터 구조 초기화
        if (!this.qmanagerData[qcode]) {
            this.qmanagerData[qcode] = {
                source_qcode: qcode,
                slots: this.createEmptySlots(),
                metadata: {
                    total_slots: 8,
                    filled_slots: 0,
                    last_updated: new Date().toISOString()
                }
            };
        }
        
        // 슬롯 데이터 업데이트
        if (!this.qmanagerData[qcode].slots[slotName]) {
            this.qmanagerData[qcode].slots[slotName] = {
                question: '',
                answer: '',
                exists: false,
                created_date: null,
                modified_date: null
            };
        }
        
        this.qmanagerData[qcode].slots[slotName][field] = value;
        this.qmanagerData[qcode].slots[slotName].modified_date = new Date().toISOString();
        
        // exists 상태 업데이트
        const slotData = this.qmanagerData[qcode].slots[slotName];
        const hasContent = slotData.question.trim() && slotData.answer;
        slotData.exists = hasContent;
        
        if (hasContent && !slotData.created_date) {
            slotData.created_date = new Date().toISOString();
        }
        
        // 메타데이터 업데이트
        this.updateQuestionMetadata(qcode);
        
        // UI 업데이트
        this.updateSlotStatistics();
        this.updateSlotUI(slotName);
        
        console.log(`📝 슬롯 업데이트: ${qcode}-${slotName} ${field} = ${value}`);
    }
    
    /**
     * 빈 슬롯 구조 생성
     */
    createEmptySlots() {
        const slots = {};
        for (let i = 1; i <= 8; i++) {
            slots[`B${i}`] = {
                question: '',
                answer: '',
                exists: false,
                created_date: null,
                modified_date: null
            };
        }
        return slots;
    }
    
    /**
     * 기출문제 메타데이터 업데이트
     */
    updateQuestionMetadata(qcode) {
        if (!this.qmanagerData[qcode]) return;
        
        const slots = this.qmanagerData[qcode].slots;
        const filledSlots = Object.values(slots).filter(slot => slot.exists).length;
        
        this.qmanagerData[qcode].metadata = {
            total_slots: 8,
            filled_slots: filledSlots,
            last_updated: new Date().toISOString()
        };
    }
    
    /**
     * 슬롯 UI 업데이트
     */
    updateSlotUI(slotName) {
        const slotElement = this.elements.slotsContainer.querySelector(`[data-slot="${slotName}"]`);
        if (!slotElement || !this.selectedQuestion) return;
        
        const qcode = this.selectedQuestion.QCODE;
        const slotData = this.qmanagerData[qcode]?.slots[slotName];
        const hasData = slotData && slotData.exists;
        
        // 슬롯 상태 업데이트
        slotElement.className = `slot-card ${hasData ? 'filled' : 'empty'}`;
        
        // 상태 표시 업데이트
        const statusElement = slotElement.querySelector('.slot-status');
        statusElement.className = `slot-status ${hasData ? 'filled' : 'empty'}`;
        statusElement.textContent = hasData ? '문제 있음' : '빈 슬롯';
        
        // 삭제 버튼 상태 업데이트
        const deleteBtn = slotElement.querySelector('.delete-btn');
        deleteBtn.disabled = !hasData;
    }
    
    /**
     * 슬롯 삭제
     */
    deleteSlot(slotName) {
        if (!this.selectedQuestion) return;
        
        const qcode = this.selectedQuestion.QCODE;
        
        if (this.qmanagerData[qcode]?.slots[slotName]) {
            // 슬롯 데이터 초기화
            this.qmanagerData[qcode].slots[slotName] = {
                question: '',
                answer: '',
                exists: false,
                created_date: null,
                modified_date: null
            };
            
            // 메타데이터 업데이트
            this.updateQuestionMetadata(qcode);
            
            // UI 업데이트
            this.updateSlots();
            
            console.log(`🗑️ 슬롯 삭제: ${qcode}-${slotName}`);
            this.showNotification('success', `${slotName} 슬롯이 삭제되었습니다.`);
        }
    }
    
    /**
     * 슬롯 통계 업데이트
     */
    updateSlotStatistics() {
        if (!this.selectedQuestion) {
            this.elements.filledSlots.textContent = '0';
            this.elements.emptySlots.textContent = '8';
            this.elements.progressBar.style.width = '0%';
            return;
        }
        
        const qcode = this.selectedQuestion.QCODE;
        const questionData = this.qmanagerData[qcode];
        
        if (!questionData) {
            this.elements.filledSlots.textContent = '0';
            this.elements.emptySlots.textContent = '8';
            this.elements.progressBar.style.width = '0%';
            return;
        }
        
        const filledSlots = questionData.metadata.filled_slots;
        const emptySlots = 8 - filledSlots;
        const progressPercent = (filledSlots / 8) * 100;
        
        this.elements.filledSlots.textContent = filledSlots;
        this.elements.emptySlots.textContent = emptySlots;
        this.elements.progressBar.style.width = `${progressPercent}%`;
    }
    
    /**
     * 전체 통계 업데이트
     */
    updateStatistics() {
        this.elements.totalMaster.textContent = this.masterData.length;
        
        const totalDerived = Object.values(this.qmanagerData).reduce((total, question) => {
            return total + question.metadata.filled_slots;
        }, 0);
        
        this.elements.totalDerived.textContent = totalDerived;
    }
    
    /**
     * 저장 처리
     */
    async handleSave() {
        if (!this.selectedQuestion) {
            this.showNotification('warning', '먼저 기출문제를 선택해주세요.');
            return;
        }
        
        try {
            this.updateStatus('저장 중...');
            
            // 현재 선택된 기출문제의 데이터만 저장
            const qcode = this.selectedQuestion.QCODE;
            const questionData = this.qmanagerData[qcode];
            
            if (!questionData) {
                this.showNotification('warning', '저장할 데이터가 없습니다.');
                return;
            }
            
            // 전체 QManager 데이터 구조로 저장
            const saveData = {
                metadata: {
                    version: "QManager Questions V1.0",
                    created_date: new Date().toISOString().split('T')[0],
                    description: "QManager로 관리되는 진위형 문제 데이터베이스",
                    total_questions: Object.values(this.qmanagerData).reduce((total, q) => total + q.metadata.filled_slots, 0),
                    last_update: new Date().toISOString()
                },
                questions: this.qmanagerData
            };
            
            const response = await fetch('/api/qmanager/save-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
            
            if (!response.ok) {
                throw new Error('저장 요청 실패');
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('success', `저장 완료! 총 ${result.total_questions}개 진위형 문제가 저장되었습니다.`);
                this.updateStatistics();
            } else {
                throw new Error(result.error || '저장 실패');
            }
            
        } catch (error) {
            console.error('저장 오류:', error);
            this.showNotification('error', `저장 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            this.updateStatus('준비 완료');
        }
    }
    
    /**
     * 업로드 처리
     */
    async handleUpload() {
        try {
            this.updateStatus('업로드 중...');
            
            // 현재 QManager 데이터를 JSON 파일로 다운로드
            const downloadData = {
                metadata: {
                    version: "QManager Questions V1.0",
                    created_date: new Date().toISOString().split('T')[0],
                    description: "QManager로 관리되는 진위형 문제 데이터베이스",
                    total_questions: Object.values(this.qmanagerData).reduce((total, q) => total + q.metadata.filled_slots, 0),
                    last_update: new Date().toISOString()
                },
                questions: this.qmanagerData
            };
            
            const blob = new Blob([JSON.stringify(downloadData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qmanager_questions_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('success', '업로드 완료! JSON 파일이 다운로드되었습니다.');
            
        } catch (error) {
            console.error('업로드 오류:', error);
            this.showNotification('error', `업로드 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            this.updateStatus('준비 완료');
        }
    }
    
    /**
     * 로딩 상태 표시
     */
    showLoading(show) {
        this.isLoading = show;
        this.elements.loadingSpinner.style.display = show ? 'flex' : 'none';
    }
    
    /**
     * 상태 업데이트
     */
    updateStatus(message) {
        this.elements.statusIndicator.textContent = message;
    }
    
    /**
     * 알림 표시
     */
    showNotification(type, message) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const titles = {
            success: '성공',
            error: '오류',
            warning: '경고',
            info: '알림'
        };
        
        this.elements.modalIcon.textContent = icons[type] || 'ℹ️';
        this.elements.modalTitle.textContent = titles[type] || '알림';
        this.elements.modalMessage.textContent = message;
        
        this.elements.notificationModal.classList.remove('hidden');
    }
    
    /**
     * 알림 숨기기
     */
    hideNotification() {
        this.elements.notificationModal.classList.add('hidden');
    }
}

// QManager 인스턴스 생성
let qmanager;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    qmanager = new QManager();
    // 초기화 후 전역에 노출
    window.qmanager = qmanager;
});
