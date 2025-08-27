/**
 * GEP CentralDataManager
 * 4-axis DB 구조를 관리하는 핵심 데이터 관리자
 * ACIU S4 경험을 기반으로 GEP용으로 확장
 * 
 * @author 서대리
 * @version 1.0
 * @date 2025-08-26
 */

class GEPCentralDataManager {
    constructor() {
        this.isInitialized = false;
        this.eventListeners = new Map();
        this.syncQueue = [];
        this.isSyncing = false;
        this.lastSyncTime = null;
        
        // 4-axis DB 구조
        this.data = {
            Problem: {},    // 문제 데이터 (Static DB)
            User: {},       // 사용자 데이터 (User DB)
            Event: {},      // 이벤트 데이터 (Event DB)
            Statistics: {}  // 통계 데이터 (Dynamic DB)
        };
        
        this.initialize();
    }

    /**
     * 초기화
     */
    initialize() {
        console.log('=== GEP 중앙 데이터 관리자 초기화 ===');
        
        // 데이터 구조 확인 및 초기화
        this.ensureDataStructure();
        
        // 초기 문제 데이터 로드
        this.loadProblemData();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 전역 함수 노출
        this.exposeGlobalFunctions();
        
        this.isInitialized = true;
        console.log('✅ GEP 중앙 데이터 관리자 초기화 완료');
    }

    /**
     * 데이터 구조 확인 및 초기화
     */
    ensureDataStructure() {
        // GEP 데이터 구조 확인
        let gepData = localStorage.getItem('gep_data');
        if (!gepData) {
            console.log('⚠️ gep_data가 없어 초기화합니다.');
            this.initializeGEPData();
        }

        // 사용자 데이터 구조 확인
        let userData = localStorage.getItem('gep_user_data');
        if (!userData) {
            console.log('⚠️ gep_user_data가 없어 초기화합니다.');
            this.initializeUserData();
        }

        // 이벤트 데이터 구조 확인
        let eventData = localStorage.getItem('gep_event_data');
        if (!eventData) {
            console.log('⚠️ gep_event_data가 없어 초기화합니다.');
            this.initializeEventData();
        }

        // 통계 데이터 구조 확인
        let statisticsData = localStorage.getItem('gep_statistics_data');
        if (!statisticsData) {
            console.log('⚠️ gep_statistics_data가 없어 초기화합니다.');
            this.initializeStatisticsData();
        }
    }

    /**
     * GEP 데이터 초기화
     */
    initializeGEPData() {
        const gepData = {
            Problem: {},
            User: {},
            Event: {},
            Statistics: {},
            metadata: {
                version: 'GEP V1.0',
                created_date: new Date().toISOString(),
                last_updated: new Date().toISOString()
            }
        };
        localStorage.setItem('gep_data', JSON.stringify(gepData));
        console.log('✅ GEP 데이터 초기화 완료');
    }

    /**
     * 사용자 데이터 초기화
     */
    initializeUserData() {
        const userData = {
            current_user: null,
            users: {},
            session: {
                start_time: new Date().toISOString(),
                current_question: null,
                study_mode: 'basic'
            }
        };
        localStorage.setItem('gep_user_data', JSON.stringify(userData));
        console.log('✅ 사용자 데이터 초기화 완료');
    }

    /**
     * 이벤트 데이터 초기화
     */
    initializeEventData() {
        const eventData = {
            events: {},
            event_counter: 0,
            last_event_time: new Date().toISOString()
        };
        localStorage.setItem('gep_event_data', JSON.stringify(eventData));
        console.log('✅ 이벤트 데이터 초기화 완료');
    }

    /**
     * 통계 데이터 초기화
     */
    initializeStatisticsData() {
        const statisticsData = {
            overall: {
                total_questions: 0,
                solved_questions: 0,
                correct_answers: 0,
                accuracy: 0,
                study_time: 0
            },
            by_category: {
                "관계법령": { total: 0, solved: 0, correct: 0, accuracy: 0 },
                "손보1부": { total: 0, solved: 0, correct: 0, accuracy: 0 },
                "손보2부": { total: 0, solved: 0, correct: 0, accuracy: 0 }
            },
            by_exam_type: {
                "보험중개사": { total: 0, solved: 0, correct: 0, accuracy: 0 },
                "보험심사역": { total: 0, solved: 0, correct: 0, accuracy: 0 },
                "손해사정사": { total: 0, solved: 0, correct: 0, accuracy: 0 }
            },
            daily_progress: {},
            last_updated: new Date().toISOString()
        };
        localStorage.setItem('gep_statistics_data', JSON.stringify(statisticsData));
        console.log('✅ 통계 데이터 초기화 완료');
    }

    /**
     * 문제 데이터 로드 (gep_master_v1.0.json)
     */
    async loadProblemData() {
        try {
            const response = await fetch('/static/data/gep_master_v1.0.json');
            const problemData = await response.json();
            
            // 문제 데이터를 인덱스로 구성
            this.data.Problem = {};
            problemData.questions.forEach(question => {
                this.data.Problem[question.QCODE] = question;
            });
            
            console.log(`✅ 문제 데이터 로드 완료: ${Object.keys(this.data.Problem).length}개`);
            
            // localStorage에 저장
            this.saveToStorage();
            
        } catch (error) {
            console.error('❌ 문제 데이터 로드 오류:', error);
        }
    }

    /**
     * localStorage에서 데이터 로드
     */
    loadFromStorage() {
        try {
            const storedData = localStorage.getItem('gep_data');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                this.data = { ...this.data, ...parsedData };
                console.log('✅ localStorage에서 데이터 로드 완료');
            }
        } catch (error) {
            console.error('❌ localStorage 로드 오류:', error);
        }
    }

    /**
     * localStorage에 데이터 저장
     */
    saveToStorage() {
        try {
            localStorage.setItem('gep_data', JSON.stringify(this.data));
            this.lastSyncTime = new Date();
        } catch (error) {
            console.error('❌ localStorage 저장 오류:', error);
        }
    }

    /**
     * 문제 데이터 CRUD 작업
     */
    
    // 문제 조회
    getQuestion(qcode) {
        return this.data.Problem[qcode] || null;
    }

    // 문제 목록 조회 (필터링 지원)
    getQuestions(filter = {}) {
        let questions = Object.values(this.data.Problem);
        
        // 필터 적용
        if (filter.ETITLE) {
            questions = questions.filter(q => q.ETITLE === filter.ETITLE);
        }
        if (filter.ECLASS) {
            questions = questions.filter(q => q.ECLASS === filter.ECLASS);
        }
        if (filter.LAYER1) {
            questions = questions.filter(q => q.LAYER1 === filter.LAYER1);
        }
        if (filter.QTYPE) {
            questions = questions.filter(q => q.QTYPE === filter.QTYPE);
        }
        
        return questions;
    }

    // 문제 추가
    addQuestion(question) {
        if (question.QCODE && !this.data.Problem[question.QCODE]) {
            this.data.Problem[question.QCODE] = question;
            this.queueSync('Problem', 'add', question.QCODE);
            return true;
        }
        return false;
    }

    // 문제 수정
    updateQuestion(qcode, updates) {
        if (this.data.Problem[qcode]) {
            this.data.Problem[qcode] = { ...this.data.Problem[qcode], ...updates };
            this.queueSync('Problem', 'update', qcode);
            return true;
        }
        return false;
    }

    // 문제 삭제
    deleteQuestion(qcode) {
        if (this.data.Problem[qcode]) {
            delete this.data.Problem[qcode];
            this.queueSync('Problem', 'delete', qcode);
            return true;
        }
        return false;
    }

    /**
     * 사용자 데이터 CRUD 작업
     */
    
    // 사용자 조회
    getUser(userId) {
        return this.data.User[userId] || null;
    }

    // 사용자 추가/수정
    saveUser(userId, userData) {
        this.data.User[userId] = {
            ...this.data.User[userId],
            ...userData,
            lastModified: new Date().toISOString()
        };
        this.queueSync('User', 'save', userId);
        return true;
    }

    // 사용자 삭제
    deleteUser(userId) {
        if (this.data.User[userId]) {
            delete this.data.User[userId];
            this.queueSync('User', 'delete', userId);
            return true;
        }
        return false;
    }

    /**
     * 이벤트 데이터 CRUD 작업
     */
    
    // 이벤트 추가
    addEvent(eventData) {
        const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.data.Event[eventId] = {
            id: eventId,
            timestamp: new Date().toISOString(),
            ...eventData
        };
        this.queueSync('Event', 'add', eventId);
        return eventId;
    }

    // 이벤트 조회
    getEvents(filter = {}) {
        let events = Object.values(this.data.Event);
        
        if (filter.userId) {
            events = events.filter(e => e.userId === filter.userId);
        }
        if (filter.type) {
            events = events.filter(e => e.type === filter.type);
        }
        if (filter.startDate) {
            events = events.filter(e => new Date(e.timestamp) >= new Date(filter.startDate));
        }
        if (filter.endDate) {
            events = events.filter(e => new Date(e.timestamp) <= new Date(filter.endDate));
        }
        
        return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    /**
     * 통계 데이터 CRUD 작업
     */
    
    // 통계 조회
    getStatistics(userId) {
        return this.data.Statistics[userId] || {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            accuracy: 0,
            lastStudyDate: null,
            studyTime: 0
        };
    }

    // 통계 업데이트
    updateStatistics(userId, stats) {
        this.data.Statistics[userId] = {
            ...this.getStatistics(userId),
            ...stats,
            lastUpdated: new Date().toISOString()
        };
        this.queueSync('Statistics', 'update', userId);
    }

    // 정답률 계산
    calculateAccuracy(userId) {
        const stats = this.getStatistics(userId);
        if (stats.totalQuestions > 0) {
            return (stats.correctAnswers / stats.totalQuestions * 100).toFixed(2);
        }
        return 0;
    }

    /**
     * 문제 풀이 결과 저장 (ACIU S4 스타일)
     */
    saveQuizResult(quizData) {
        const eventData = {
            type: 'quiz_result',
            userId: quizData.userId || 'guest',
            qcode: quizData.qcode,
            question: quizData.question,
            userAnswer: quizData.userAnswer,
            correctAnswer: quizData.correctAnswer,
            isCorrect: quizData.isCorrect,
            timestamp: new Date().toISOString(),
            studyTime: quizData.studyTime || 0
        };

        // 이벤트 추가
        this.addEvent(eventData);

        // 통계 업데이트
        this.updateQuizStatistics(quizData);

        console.log(`✅ 문제 풀이 결과 저장: ${quizData.qcode} - ${quizData.isCorrect ? '정답' : '오답'}`);
    }

    /**
     * 퀴즈 통계 업데이트
     */
    updateQuizStatistics(quizData) {
        const userId = quizData.userId || 'guest';
        const currentStats = this.getStatistics(userId);

        const updatedStats = {
            ...currentStats,
            totalQuestions: currentStats.totalQuestions + 1,
            correctAnswers: currentStats.correctAnswers + (quizData.isCorrect ? 1 : 0),
            wrongAnswers: currentStats.wrongAnswers + (quizData.isCorrect ? 0 : 1),
            studyTime: currentStats.studyTime + (quizData.studyTime || 0),
            lastStudyDate: new Date().toISOString()
        };

        updatedStats.accuracy = this.calculateAccuracy(userId);
        this.updateStatistics(userId, updatedStats);
    }

    /**
     * 동기화 시스템
     */
    
    // 동기화 큐에 추가
    queueSync(axis, action, id) {
        this.syncQueue.push({
            axis,
            action,
            id,
            timestamp: new Date().toISOString()
        });
        
        // 자동 저장
        this.saveToStorage();
        
        // 동기화 실행
        this.processSyncQueue();
    }

    // 동기화 큐 처리
    async processSyncQueue() {
        if (this.isSyncing || this.syncQueue.length === 0) {
            return;
        }

        this.isSyncing = true;
        
        try {
            while (this.syncQueue.length > 0) {
                const syncItem = this.syncQueue.shift();
                await this.performSync(syncItem);
            }
        } catch (error) {
            console.error('❌ 동기화 처리 오류:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    // 개별 동기화 수행
    async performSync(syncItem) {
        try {
            // 실제 서버 동기화 로직 (향후 구현)
            console.log(`🔄 동기화 수행: ${syncItem.axis} - ${syncItem.action} - ${syncItem.id}`);
            
            // 성공 시 이벤트 발생
            this.triggerEvent('sync', {
                axis: syncItem.axis,
                action: syncItem.action,
                id: syncItem.id,
                success: true
            });
            
        } catch (error) {
            console.error('❌ 동기화 실패:', error);
            
            // 실패 시 재시도 큐에 추가
            this.syncQueue.push(syncItem);
        }
    }

    /**
     * 이벤트 시스템
     */
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 페이지 언로드 시 저장
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
        
        // 온라인 상태 변경 시 동기화
        window.addEventListener('online', () => {
            this.processSyncQueue();
        });

        // GEP 데이터 변경 이벤트 리스너
        window.addEventListener('gepDataChange', (event) => {
            this.handleDataChange(event.detail);
        });
    }

    // 데이터 변경 처리
    handleDataChange(changeData) {
        console.log('📊 GEP 데이터 변경 감지:', changeData);
        
        // UI 업데이트 이벤트 발생
        this.triggerEvent('ui_update', changeData);
    }

    // 이벤트 발생
    triggerEvent(eventType, data) {
        const event = new CustomEvent('gepDataChange', {
            detail: {
                type: eventType,
                data: data,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * 전역 함수 노출
     */
    exposeGlobalFunctions() {
        // 전역 GEP 데이터 관리자 인스턴스
        window.GEPDataManager = this;
        
        // 편의 함수들
        window.GEP = {
            getQuestion: (qcode) => this.getQuestion(qcode),
            getQuestions: (filter) => this.getQuestions(filter),
            saveQuizResult: (data) => this.saveQuizResult(data),
            getStatistics: (userId) => this.getStatistics(userId),
            getStats: () => this.getStats()
        };
        
        console.log('✅ 전역 함수 노출 완료');
    }

    /**
     * 유틸리티 메서드
     */
    
    // 데이터 백업
    backup() {
        const backup = {
            data: this.data,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem('gep_backup', JSON.stringify(backup));
        return backup;
    }

    // 데이터 복원
    restore(backupData) {
        if (backupData && backupData.data) {
            this.data = backupData.data;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // 데이터 초기화
    clear() {
        this.data = {
            Problem: {},
            User: {},
            Event: {},
            Statistics: {}
        };
        this.syncQueue = [];
        this.saveToStorage();
    }

    // 통계 정보
    getStats() {
        return {
            totalProblems: Object.keys(this.data.Problem).length,
            totalUsers: Object.keys(this.data.User).length,
            totalEvents: Object.keys(this.data.Event).length,
            totalStatistics: Object.keys(this.data.Statistics).length,
            syncQueueLength: this.syncQueue.length,
            lastSyncTime: this.lastSyncTime,
            isInitialized: this.isInitialized
        };
    }

    /**
     * 시뮬레이션 및 테스트 메서드
     */
    
    // 시뮬레이션 문제 풀이
    simulateQuizResult(qcode, isCorrect, userId = 'test_user') {
        const question = this.getQuestion(qcode);
        if (!question) {
            console.error('❌ 문제를 찾을 수 없습니다:', qcode);
            return false;
        }

        const quizData = {
            userId: userId,
            qcode: qcode,
            question: question.QUESTION,
            userAnswer: isCorrect ? question.ANSWER : this.getRandomAnswer(question.ANSWER),
            correctAnswer: question.ANSWER,
            isCorrect: isCorrect,
            studyTime: Math.floor(Math.random() * 60) + 30 // 30-90초
        };

        this.saveQuizResult(quizData);
        return true;
    }

    // 랜덤 답안 생성
    getRandomAnswer(correctAnswer) {
        const answers = ['1', '2', '3', '4'];
        const wrongAnswers = answers.filter(a => a !== correctAnswer);
        return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    }

    // 대량 시뮬레이션
    simulateBatchQuizResults(results) {
        console.log(`=== 대량 시뮬레이션 시작: ${results.length}문제 ===`);
        
        results.forEach((result, index) => {
            setTimeout(() => {
                this.simulateQuizResult(result.qcode, result.isCorrect, result.userId);
            }, index * 100); // 100ms 간격으로 실행
        });
        
        console.log('✅ 대량 시뮬레이션 완료');
    }
}

// 전역 인스턴스 생성
window.GEPDataManager = new GEPCentralDataManager();

// 개발용 디버깅
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.GEPDataManagerDebug = {
        getStats: () => window.GEPDataManager.getStats(),
        backup: () => window.GEPDataManager.backup(),
        clear: () => window.GEPDataManager.clear(),
        getQuestions: (filter) => window.GEPDataManager.getQuestions(filter),
        getQuestion: (qcode) => window.GEPDataManager.getQuestion(qcode),
        simulateQuiz: (qcode, isCorrect) => window.GEPDataManager.simulateQuizResult(qcode, isCorrect),
        simulateBatch: (results) => window.GEPDataManager.simulateBatchQuizResults(results)
    };
    console.log('🔧 GEP DataManager 디버깅 모드 활성화');
}
