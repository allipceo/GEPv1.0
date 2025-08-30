/**
 * 과목별 문제 필터링 클래스
 * @class SubjectFilter
 * @description 선택된 과목의 기출문제만 필터링하는 기능을 제공
 */
class SubjectFilter {
    constructor() {
        this.masterData = []; // 전체 문제 데이터
        this.filteredQuestions = []; // 필터링된 문제
        this.subjectStats = {}; // 과목별 통계 정보
        
        this.init();
    }
    
    /**
     * 초기화
     */
    async init() {
        await this.loadMasterData();
        this.calculateSubjectStats();
    }
    
    /**
     * 마스터 데이터 로드
     */
    async loadMasterData() {
        try {
            // 실제 데이터가 없을 경우 시뮬레이션 데이터 사용
            if (this.hasRealData()) {
                const response = await fetch('/static/data/gep_master_v1.0.json');
                const data = await response.json();
                this.masterData = data.questions || [];
            } else {
                // 시뮬레이션 데이터 사용
                this.masterData = this.getSimulationData();
            }
            
            console.log(`마스터 데이터 로드 완료: ${this.masterData.length}개 문제`);
        } catch (error) {
            console.error('마스터 데이터 로드 실패:', error);
            // 시뮬레이션 데이터로 대체
            this.masterData = this.getSimulationData();
        }
    }
    
    /**
     * 실제 데이터 존재 여부 확인
     * @returns {boolean} 실제 데이터 존재 여부
     */
    hasRealData() {
        // 실제 데이터 파일 존재 여부 확인 로직
        // 실제 데이터 파일이 존재하므로 true 반환
        return true;
    }
    
    /**
     * 시뮬레이션 데이터 생성
     * @returns {Array} 시뮬레이션 문제 데이터
     */
    getSimulationData() {
        return [
            {
                "QCODE": "AB20AA-01",
                "ETITLE": "보험중개사",
                "ECLASS": "손해보험",
                "LAYER1": "관계법령",
                "LAYER2": "보험업법",
                "QTYPE": "A",
                "QUESTION": "보험업법의 내용과 관련하여 타당하지 않은 것은?",
                "ANSWER": "2",
                "EROUND": "20.0"
            },
            {
                "QCODE": "AB20AA-02",
                "ETITLE": "보험중개사",
                "ECLASS": "손해보험",
                "LAYER1": "관계법령",
                "LAYER2": "보험업법",
                "QTYPE": "A",
                "QUESTION": "보험업법상 보험업의 정의에 해당하지 않는 것은?",
                "ANSWER": "1",
                "EROUND": "20.0"
            },
            {
                "QCODE": "AB21AA-01",
                "ETITLE": "보험중개사",
                "ECLASS": "손해보험",
                "LAYER1": "관계법령",
                "LAYER2": "상법보험편",
                "QTYPE": "A",
                "QUESTION": "상법보험편상 보험계약의 성립에 관한 설명으로 옳은 것은?",
                "ANSWER": "3",
                "EROUND": "21.0"
            },
            {
                "QCODE": "AB21AA-02",
                "ETITLE": "보험중개사",
                "ECLASS": "손해보험",
                "LAYER1": "관계법령",
                "LAYER2": "자동차보험",
                "QTYPE": "A",
                "QUESTION": "자동차보험의 특징에 관한 설명으로 옳은 것은?",
                "ANSWER": "2",
                "EROUND": "21.0"
            },
            {
                "QCODE": "AB22AA-01",
                "ETITLE": "보험중개사",
                "ECLASS": "손해보험",
                "LAYER1": "관계법령",
                "LAYER2": "화재보험",
                "QTYPE": "A",
                "QUESTION": "화재보험의 보험사고에 해당하지 않는 것은?",
                "ANSWER": "4",
                "EROUND": "22.0"
            }
        ];
    }
    
    /**
     * 과목별 문제 필터링
     * @param {string} subject - 필터링할 과목명 (LAYER2 값)
     * @returns {Array} 필터링된 문제 배열
     */
    filterBySubject(subject) {
        console.log(`과목 필터링 시작: ${subject}`);
        
        // QUESTION 필드 절대 노터치 원칙 준수
        // LAYER2와 QTYPE만으로 필터링
        this.filteredQuestions = this.masterData.filter(question => 
            question.LAYER2 === subject && 
            question.QTYPE === 'A'  // 기출문제만
        );
        
        console.log(`필터링 완료: ${this.filteredQuestions.length}개 문제`);
        return this.filteredQuestions;
    }
    
    /**
     * 과목별 통계 정보 계산
     */
    calculateSubjectStats() {
        const subjects = [
            "보험업법", "상법보험편", "자동차보험", "화재보험", 
            "해상보험", "재해보험", "보험계리", "보험경영",
            "보험마케팅", "보험심사", "보험사고처리", "보험계약관리"
        ];
        
        subjects.forEach(subject => {
            const questions = this.filterBySubject(subject);
            this.subjectStats[subject] = {
                totalQuestions: questions.length,
                rounds: this.getUniqueRounds(questions),
                layer1Breakdown: this.getLayer1Breakdown(questions)
            };
        });
        
        console.log('과목별 통계 계산 완료:', this.subjectStats);
        
        // SubjectSelector에 통계 정보 전달
        if (window.subjectSelector) {
            window.subjectSelector.setSubjectStats(this.subjectStats);
        }
    }
    
    /**
     * 고유한 회차 목록 추출
     * @param {Array} questions - 문제 배열
     * @returns {Array} 고유한 회차 목록
     */
    getUniqueRounds(questions) {
        const rounds = questions.map(q => q.EROUND);
        return [...new Set(rounds)].sort((a, b) => parseFloat(a) - parseFloat(b));
    }
    
    /**
     * LAYER1별 분포 계산
     * @param {Array} questions - 문제 배열
     * @returns {Object} LAYER1별 분포
     */
    getLayer1Breakdown(questions) {
        const breakdown = {};
        questions.forEach(q => {
            const layer1 = q.LAYER1;
            breakdown[layer1] = (breakdown[layer1] || 0) + 1;
        });
        return breakdown;
    }
    
    /**
     * 과목별 통계 정보 반환
     * @param {string} subject - 과목명
     * @returns {Object} 과목별 통계 정보
     */
    getSubjectStats(subject) {
        return this.subjectStats[subject] || {
            totalQuestions: 0,
            rounds: [],
            layer1Breakdown: {}
        };
    }
    
    /**
     * 필터링된 문제 반환
     * @returns {Array} 필터링된 문제 배열
     */
    getFilteredQuestions() {
        return this.filteredQuestions;
    }
    
    /**
     * 전체 문제 수 반환
     * @returns {number} 전체 문제 수
     */
    getTotalQuestions() {
        return this.masterData.length;
    }
    
    /**
     * 기출문제 수 반환 (QTYPE 'A')
     * @returns {number} 기출문제 수
     */
    getOriginalQuestionsCount() {
        return this.masterData.filter(q => q.QTYPE === 'A').length;
    }
    
    /**
     * 데이터 무결성 검증
     * @returns {Object} 검증 결과
     */
    validateDataIntegrity() {
        const checks = {
            hasQCODE: this.masterData.every(q => q.QCODE),
            hasLAYER2: this.masterData.every(q => q.LAYER2),
            hasQTYPE: this.masterData.every(q => q.QTYPE),
            hasQUESTION: this.masterData.every(q => q.QUESTION), // QUESTION 필드 존재 확인만
            hasANSWER: this.masterData.every(q => q.ANSWER),
            totalCount: this.masterData.length,
            originalQuestionsCount: this.getOriginalQuestionsCount()
        };
        
        console.log('데이터 무결성 검증 결과:', checks);
        return checks;
    }
    
    /**
     * 성능 모니터링
     * @param {string} operation - 작업명
     * @param {Function} callback - 실행할 함수
     * @returns {*} 함수 실행 결과
     */
    monitorPerformance(operation, callback) {
        const startTime = performance.now();
        const result = callback();
        const endTime = performance.now();
        
        console.log(`성능 측정 [${operation}]: ${(endTime - startTime).toFixed(2)}ms`);
        return result;
    }
}

// 전역 인스턴스 생성
window.subjectFilter = new SubjectFilter();

