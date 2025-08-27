/**
 * GEP Test Manager
 * CentralDataManager의 테스트 및 검증 시스템
 * 
 * @author 서대리
 * @version 1.0
 * @date 2025-08-26
 */

class GEPTestManager {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
    }

    /**
     * 전체 테스트 실행
     */
    async runAllTests() {
        console.log('=== GEP 전체 테스트 시작 ===');
        
        this.isRunning = true;
        this.testResults = [];

        try {
            // 1. 기본 기능 테스트
            await this.testBasicFunctions();
            
            // 2. 데이터 로드 테스트
            await this.testDataLoading();
            
            // 3. CRUD 작업 테스트
            await this.testCRUDOperations();
            
            // 4. 동기화 테스트
            await this.testSyncOperations();
            
            // 5. 성능 테스트
            await this.testPerformance();
            
            // 6. 시뮬레이션 테스트
            await this.testSimulation();
            
        } catch (error) {
            console.error('❌ 테스트 실행 중 오류:', error);
        } finally {
            this.isRunning = false;
        }

        this.generateTestReport();
    }

    /**
     * 기본 기능 테스트
     */
    async testBasicFunctions() {
        console.log('🔧 기본 기능 테스트 시작...');
        
        const tests = [
            {
                name: 'DataManager 초기화 확인',
                test: () => {
                    return window.GEPDataManager && window.GEPDataManager.isInitialized;
                }
            },
            {
                name: '전역 함수 노출 확인',
                test: () => {
                    return window.GEP && typeof window.GEP.getQuestion === 'function';
                }
            },
            {
                name: '4-axis DB 구조 확인',
                test: () => {
                    const dm = window.GEPDataManager;
                    return dm.data.Problem && dm.data.User && dm.data.Event && dm.data.Statistics;
                }
            }
        ];

        for (const test of tests) {
            const result = {
                name: test.name,
                passed: test.test(),
                timestamp: new Date().toISOString()
            };
            
            this.testResults.push(result);
            console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
        }
    }

    /**
     * 데이터 로드 테스트
     */
    async testDataLoading() {
        console.log('📊 데이터 로드 테스트 시작...');
        
        const tests = [
            {
                name: '문제 데이터 로드 확인',
                test: async () => {
                    const dm = window.GEPDataManager;
                    await dm.loadProblemData();
                    return Object.keys(dm.data.Problem).length > 0;
                }
            },
            {
                name: 'localStorage 저장/로드 확인',
                test: () => {
                    const dm = window.GEPDataManager;
                    dm.saveToStorage();
                    dm.loadFromStorage();
                    return true; // 오류가 없으면 성공
                }
            },
            {
                name: '문제 필터링 기능 확인',
                test: () => {
                    const questions = window.GEP.getQuestions({ ETITLE: '보험중개사' });
                    return Array.isArray(questions) && questions.length > 0;
                }
            }
        ];

        for (const test of tests) {
            const result = {
                name: test.name,
                passed: await test.test(),
                timestamp: new Date().toISOString()
            };
            
            this.testResults.push(result);
            console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
        }
    }

    /**
     * CRUD 작업 테스트
     */
    async testCRUDOperations() {
        console.log('🔄 CRUD 작업 테스트 시작...');
        
        const dm = window.GEPDataManager;
        const testUserId = 'test_user_' + Date.now();
        const testQcode = 'TEST-001';

        const tests = [
            {
                name: '사용자 CRUD 테스트',
                test: () => {
                    // Create
                    const userData = { name: '테스트 사용자', email: 'test@example.com' };
                    const createResult = dm.saveUser(testUserId, userData);
                    
                    // Read
                    const readResult = dm.getUser(testUserId);
                    
                    // Update
                    const updateResult = dm.saveUser(testUserId, { name: '업데이트된 사용자' });
                    
                    // Delete
                    const deleteResult = dm.deleteUser(testUserId);
                    
                    return createResult && readResult && updateResult && deleteResult;
                }
            },
            {
                name: '이벤트 CRUD 테스트',
                test: () => {
                    // Create
                    const eventData = { type: 'test', message: '테스트 이벤트' };
                    const eventId = dm.addEvent(eventData);
                    
                    // Read
                    const events = dm.getEvents({ type: 'test' });
                    
                    return eventId && events.length > 0;
                }
            },
            {
                name: '통계 CRUD 테스트',
                test: () => {
                    // Create/Update
                    const stats = { totalQuestions: 10, correctAnswers: 8 };
                    dm.updateStatistics(testUserId, stats);
                    
                    // Read
                    const readStats = dm.getStatistics(testUserId);
                    const accuracy = dm.calculateAccuracy(testUserId);
                    
                    return readStats.totalQuestions === 10 && accuracy === '80.00';
                }
            }
        ];

        for (const test of tests) {
            const result = {
                name: test.name,
                passed: test.test(),
                timestamp: new Date().toISOString()
            };
            
            this.testResults.push(result);
            console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
        }
    }

    /**
     * 동기화 테스트
     */
    async testSyncOperations() {
        console.log('🔄 동기화 테스트 시작...');
        
        const dm = window.GEPDataManager;

        const tests = [
            {
                name: '동기화 큐 테스트',
                test: () => {
                    const initialQueueLength = dm.syncQueue.length;
                    dm.queueSync('Test', 'test', 'test_id');
                    return dm.syncQueue.length > initialQueueLength;
                }
            },
            {
                name: '이벤트 발생 테스트',
                test: () => {
                    let eventReceived = false;
                    const listener = (event) => {
                        eventReceived = true;
                    };
                    
                    window.addEventListener('gepDataChange', listener);
                    dm.triggerEvent('test', { data: 'test' });
                    
                    // 이벤트 리스너 제거
                    setTimeout(() => {
                        window.removeEventListener('gepDataChange', listener);
                    }, 100);
                    
                    return eventReceived;
                }
            }
        ];

        for (const test of tests) {
            const result = {
                name: test.name,
                passed: test.test(),
                timestamp: new Date().toISOString()
            };
            
            this.testResults.push(result);
            console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
        }
    }

    /**
     * 성능 테스트
     */
    async testPerformance() {
        console.log('⚡ 성능 테스트 시작...');
        
        const dm = window.GEPDataManager;

        const tests = [
            {
                name: '문제 데이터 로드 성능',
                test: async () => {
                    const startTime = performance.now();
                    await dm.loadProblemData();
                    const endTime = performance.now();
                    const loadTime = endTime - startTime;
                    
                    console.log(`📊 문제 데이터 로드 시간: ${loadTime.toFixed(2)}ms`);
                    return loadTime < 3000; // 3초 이내
                }
            },
            {
                name: '필터링 성능',
                test: () => {
                    const startTime = performance.now();
                    const questions = dm.getQuestions({ ETITLE: '보험중개사' });
                    const endTime = performance.now();
                    const filterTime = endTime - startTime;
                    
                    console.log(`📊 필터링 시간: ${filterTime.toFixed(2)}ms (${questions.length}개 결과)`);
                    return filterTime < 100; // 100ms 이내
                }
            },
            {
                name: '메모리 사용량 확인',
                test: () => {
                    const stats = dm.getStats();
                    console.log(`📊 메모리 사용량: ${JSON.stringify(stats)}`);
                    return stats.totalProblems > 0;
                }
            }
        ];

        for (const test of tests) {
            const result = {
                name: test.name,
                passed: await test.test(),
                timestamp: new Date().toISOString()
            };
            
            this.testResults.push(result);
            console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
        }
    }

    /**
     * 시뮬레이션 테스트
     */
    async testSimulation() {
        console.log('🎮 시뮬레이션 테스트 시작...');
        
        const dm = window.GEPDataManager;

        const tests = [
            {
                name: '단일 문제 시뮬레이션',
                test: () => {
                    const testQcode = 'ABAA-01';
                    const result = dm.simulateQuizResult(testQcode, true, 'simulation_user');
                    return result;
                }
            },
            {
                name: '대량 시뮬레이션',
                test: () => {
                    const batchResults = [
                        { qcode: 'ABAA-01', isCorrect: true, userId: 'batch_user' },
                        { qcode: 'ABAA-02', isCorrect: false, userId: 'batch_user' },
                        { qcode: 'ABAA-03', isCorrect: true, userId: 'batch_user' }
                    ];
                    
                    dm.simulateBatchQuizResults(batchResults);
                    return true;
                }
            },
            {
                name: '통계 업데이트 확인',
                test: () => {
                    const stats = dm.getStatistics('simulation_user');
                    return stats.totalQuestions > 0;
                }
            }
        ];

        for (const test of tests) {
            const result = {
                name: test.name,
                passed: test.test(),
                timestamp: new Date().toISOString()
            };
            
            this.testResults.push(result);
            console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
        }
    }

    /**
     * 테스트 리포트 생성
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = ((passedTests / totalTests) * 100).toFixed(2);

        console.log('\n=== GEP 테스트 리포트 ===');
        console.log(`📊 총 테스트: ${totalTests}개`);
        console.log(`✅ 통과: ${passedTests}개`);
        console.log(`❌ 실패: ${failedTests}개`);
        console.log(`📈 성공률: ${successRate}%`);

        if (failedTests > 0) {
            console.log('\n❌ 실패한 테스트:');
            this.testResults
                .filter(r => !r.passed)
                .forEach(r => console.log(`  - ${r.name}`));
        }

        // 테스트 결과를 localStorage에 저장
        const report = {
            timestamp: new Date().toISOString(),
            totalTests,
            passedTests,
            failedTests,
            successRate,
            results: this.testResults
        };

        localStorage.setItem('gep_test_report', JSON.stringify(report));
        console.log('📄 테스트 리포트가 localStorage에 저장되었습니다.');
    }

    /**
     * 특정 테스트 실행
     */
    async runSpecificTest(testName) {
        console.log(`🔧 특정 테스트 실행: ${testName}`);
        
        switch (testName) {
            case 'basic':
                await this.testBasicFunctions();
                break;
            case 'data':
                await this.testDataLoading();
                break;
            case 'crud':
                await this.testCRUDOperations();
                break;
            case 'sync':
                await this.testSyncOperations();
                break;
            case 'performance':
                await this.testPerformance();
                break;
            case 'simulation':
                await this.testSimulation();
                break;
            default:
                console.error('❌ 알 수 없는 테스트:', testName);
        }
    }
}

// 전역 테스트 매니저 인스턴스 생성
window.GEPTestManager = new GEPTestManager();

// 개발용 디버깅
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.GEPTestDebug = {
        runAllTests: () => window.GEPTestManager.runAllTests(),
        runSpecificTest: (testName) => window.GEPTestManager.runSpecificTest(testName),
        getTestResults: () => window.GEPTestManager.testResults
    };
    console.log('🔧 GEP TestManager 디버깅 모드 활성화');
}
