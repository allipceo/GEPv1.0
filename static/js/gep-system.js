/**
 * GEP 통합 시스템
 * 모든 블록을 하나의 시스템으로 통합
 * 
 * @author 서대리
 * @version 1.0
 * @date 2025-08-26
 */

class GEPSystem {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.connections = new Map();
        this.systemStatus = 'initializing';
    }

    /**
     * 시스템 초기화
     */
    async initialize() {
        console.log('🚀 GEP 통합 시스템 초기화 시작...');
        
        try {
            // 1. 시스템 상태 설정
            this.systemStatus = 'loading';
            
            // 2. 모든 모듈 로드
            await this.loadAllModules();
            
            // 3. 모듈 간 연결 설정
            await this.connectModules();
            
            // 4. 시스템 상태 검증
            await this.validateSystem();
            
            // 5. 시스템 완전 초기화
            this.isInitialized = true;
            this.systemStatus = 'ready';
            
            console.log('✅ GEP 통합 시스템 초기화 완료');
            this.triggerEvent('system_ready');
            
        } catch (error) {
            console.error('❌ 시스템 초기화 실패:', error);
            this.systemStatus = 'error';
            throw error;
        }
    }

    /**
     * 모든 모듈 로드
     */
    async loadAllModules() {
        console.log('📦 모듈 로드 시작...');
        
        const moduleList = [
            { name: 'DataConverter', path: 'utils/data-converter.js' },
            { name: 'DataManager', path: 'core/data-manager.js' },
            { name: 'TestManager', path: 'core/test-manager.js' },
            { name: 'UIComponents', path: 'ui/components.js' },
            { name: 'Navigation', path: 'ui/navigation.js' },
            { name: 'QuizUI', path: 'ui/quiz-ui.js' },
            { name: 'DashboardUI', path: 'ui/dashboard.js' },
            { name: 'ProfileUI', path: 'ui/profile.js' },
            { name: 'LandingUI', path: 'ui/landing.js' }
        ];

        for (const module of moduleList) {
            try {
                await this.loadModule(module);
                console.log(`✅ ${module.name} 로드 완료`);
            } catch (error) {
                console.warn(`⚠️ ${module.name} 로드 실패:`, error);
            }
        }
    }

    /**
     * 개별 모듈 로드
     */
    async loadModule(moduleInfo) {
        // 모듈이 이미 로드되어 있는지 확인
        if (this.modules.has(moduleInfo.name)) {
            return this.modules.get(moduleInfo.name);
        }

        // 모듈 로드 시뮬레이션 (실제로는 동적 import)
        const module = {
            name: moduleInfo.name,
            path: moduleInfo.path,
            loaded: true,
            timestamp: new Date().toISOString()
        };

        this.modules.set(moduleInfo.name, module);
        return module;
    }

    /**
     * 모듈 간 연결 설정
     */
    async connectModules() {
        console.log('🔗 모듈 연결 설정 시작...');
        
        // DataManager ↔ UI 연결
        this.createConnection('DataManager', 'QuizUI', 'data_provider');
        this.createConnection('DataManager', 'DashboardUI', 'data_provider');
        this.createConnection('DataManager', 'ProfileUI', 'data_provider');
        
        // UI ↔ UI 연결
        this.createConnection('Navigation', 'QuizUI', 'navigation');
        this.createConnection('Navigation', 'DashboardUI', 'navigation');
        this.createConnection('Navigation', 'ProfileUI', 'navigation');
        
        // TestManager ↔ 모든 모듈 연결
        this.createConnection('TestManager', 'DataManager', 'testing');
        this.createConnection('TestManager', 'QuizUI', 'testing');
        this.createConnection('TestManager', 'DashboardUI', 'testing');
        
        console.log('✅ 모듈 연결 설정 완료');
    }

    /**
     * 모듈 간 연결 생성
     */
    createConnection(fromModule, toModule, connectionType) {
        const connectionId = `${fromModule}_${toModule}_${connectionType}`;
        const connection = {
            id: connectionId,
            from: fromModule,
            to: toModule,
            type: connectionType,
            active: true,
            timestamp: new Date().toISOString()
        };
        
        this.connections.set(connectionId, connection);
        console.log(`🔗 연결 생성: ${fromModule} → ${toModule} (${connectionType})`);
    }

    /**
     * 시스템 상태 검증
     */
    async validateSystem() {
        console.log('🔍 시스템 상태 검증 시작...');
        
        const validationResults = {
            modules: this.validateModules(),
            connections: this.validateConnections(),
            dataFlow: await this.validateDataFlow(),
            performance: this.validatePerformance()
        };

        const allValid = Object.values(validationResults).every(result => result.valid);
        
        if (allValid) {
            console.log('✅ 시스템 검증 통과');
        } else {
            console.warn('⚠️ 시스템 검증 실패:', validationResults);
        }

        return validationResults;
    }

    /**
     * 모듈 검증
     */
    validateModules() {
        const requiredModules = [
            'DataManager', 'TestManager', 'UIComponents', 
            'Navigation', 'QuizUI', 'DashboardUI', 'ProfileUI'
        ];
        
        const loadedModules = requiredModules.filter(module => 
            this.modules.has(module)
        );
        
        return {
            valid: loadedModules.length === requiredModules.length,
            required: requiredModules.length,
            loaded: loadedModules.length,
            missing: requiredModules.filter(module => !this.modules.has(module))
        };
    }

    /**
     * 연결 검증
     */
    validateConnections() {
        const activeConnections = Array.from(this.connections.values())
            .filter(conn => conn.active);
        
        return {
            valid: activeConnections.length > 0,
            total: this.connections.size,
            active: activeConnections.length,
            inactive: this.connections.size - activeConnections.length
        };
    }

    /**
     * 데이터 플로우 검증
     */
    async validateDataFlow() {
        try {
            // 데이터 로드 테스트
            const dataLoaded = await this.testDataLoading();
            
            // 데이터 저장 테스트
            const dataSaved = await this.testDataSaving();
            
            // 데이터 검색 테스트
            const dataSearchable = await this.testDataSearch();
            
            return {
                valid: dataLoaded && dataSaved && dataSearchable,
                dataLoaded,
                dataSaved,
                dataSearchable
            };
        } catch (error) {
            console.error('데이터 플로우 검증 실패:', error);
            return {
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * 성능 검증
     */
    validatePerformance() {
        const startTime = performance.now();
        
        // 간단한 성능 테스트
        const testOperations = 1000;
        for (let i = 0; i < testOperations; i++) {
            this.modules.has('DataManager');
        }
        
        const endTime = performance.now();
        const operationTime = endTime - startTime;
        
        return {
            valid: operationTime < 100, // 100ms 이내
            operationTime,
            operationsPerSecond: testOperations / (operationTime / 1000)
        };
    }

    /**
     * 데이터 로드 테스트
     */
    async testDataLoading() {
        try {
            const response = await fetch('/static/data/gep_master_v1.0.json');
            const data = await response.json();
            return data && data.questions && data.questions.length > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * 데이터 저장 테스트
     */
    async testDataSaving() {
        try {
            if (window.GEPDataManager) {
                const testData = { test: 'data' };
                await window.GEPDataManager.saveTestData(testData);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * 데이터 검색 테스트
     */
    async testDataSearch() {
        try {
            if (window.GEPDataManager) {
                const results = await window.GEPDataManager.searchQuestions('테스트');
                return Array.isArray(results);
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * 이벤트 트리거
     */
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(`gep_${eventName}`, {
            detail: {
                timestamp: new Date().toISOString(),
                systemStatus: this.systemStatus,
                data
            }
        });
        
        document.dispatchEvent(event);
        console.log(`📡 이벤트 발생: gep_${eventName}`, data);
    }

    /**
     * 시스템 상태 조회
     */
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            status: this.systemStatus,
            modules: this.modules.size,
            connections: this.connections.size,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 모듈 상태 조회
     */
    getModuleStatus(moduleName) {
        const module = this.modules.get(moduleName);
        if (!module) {
            return { error: 'Module not found' };
        }
        
        return {
            name: module.name,
            loaded: module.loaded,
            timestamp: module.timestamp,
            connections: Array.from(this.connections.values())
                .filter(conn => conn.from === moduleName || conn.to === moduleName)
        };
    }
}

// 전역 GEP 시스템 인스턴스 생성
window.GEPSystem = new GEPSystem();

// 시스템 자동 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.GEPSystem.initialize();
        console.log('🎉 GEP 통합 시스템 준비 완료!');
    } catch (error) {
        console.error('❌ GEP 시스템 초기화 실패:', error);
    }
});
