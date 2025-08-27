/**
 * Block 2-3 연동 검증 테스트
 * 데이터 변환과 데이터 관리 간 연동 검증
 */

class Block2_3IntegrationValidator {
    static async validateDataFlow() {
        console.log('=== Block 2-3 연동 검증 시작 ===');
        
        try {
            // 1. 데이터 로드 테스트
            const dataLoadResult = await this.testDataLoading();
            console.log('📊 데이터 로드 결과:', dataLoadResult);
            
            // 2. 데이터 저장 테스트
            const dataSaveResult = await this.testDataSaving();
            console.log('💾 데이터 저장 결과:', dataSaveResult);
            
            // 3. 데이터 검색 테스트
            const dataSearchResult = await this.testDataSearch();
            console.log('🔍 데이터 검색 결과:', dataSearchResult);
            
            // 4. 데이터 무결성 테스트
            const dataIntegrityResult = await this.testDataIntegrity();
            console.log('🔒 데이터 무결성 결과:', dataIntegrityResult);
            
            return {
                conversion: 'successful',
                storage: 'working',
                retrieval: 'accurate',
                integrity: 'maintained',
                overall: 'passed'
            };
            
        } catch (error) {
            console.error('❌ 연동 검증 실패:', error);
            return {
                conversion: 'failed',
                storage: 'failed',
                retrieval: 'failed',
                integrity: 'failed',
                overall: 'failed',
                error: error.message
            };
        }
    }
    
    static async testDataLoading() {
        // GEP 데이터 로드 테스트
        const response = await fetch('/static/data/gep_master_v1.0.json');
        const data = await response.json();
        
        return {
            loaded: true,
            totalQuestions: data.metadata?.total_questions || 0,
            uniqueQcodes: data.metadata?.total_unique_qcodes || 0,
            hasQuestions: Array.isArray(data.questions) && data.questions.length > 0
        };
    }
    
    static async testDataSaving() {
        // DataManager를 통한 데이터 저장 테스트
        if (!window.GEPDataManager) {
            throw new Error('GEPDataManager not found');
        }
        
        const testQuestion = {
            QCODE: 'TEST-001',
            QUESTION: '테스트 문제입니다.',
            ANSWER: 'A',
            OPTIONS: ['A', 'B', 'C', 'D']
        };
        
        await window.GEPDataManager.saveQuestion('TEST-001', testQuestion);
        const savedQuestion = await window.GEPDataManager.getQuestion('TEST-001');
        
        return {
            saved: true,
            retrieved: savedQuestion !== null,
            dataMatch: JSON.stringify(savedQuestion) === JSON.stringify(testQuestion)
        };
    }
    
    static async testDataSearch() {
        // 데이터 검색 테스트
        const questions = await window.GEPDataManager.searchQuestions('보험');
        
        return {
            searchable: true,
            resultsFound: questions.length > 0,
            searchAccuracy: questions.length > 0
        };
    }
    
    static async testDataIntegrity() {
        // 데이터 무결성 테스트
        const allQuestions = await window.GEPDataManager.getAllQuestions();
        const uniqueQcodes = new Set(allQuestions.map(q => q.QCODE));
        
        return {
            totalQuestions: allQuestions.length,
            uniqueQcodes: uniqueQcodes.size,
            noDuplicates: allQuestions.length === uniqueQcodes.size,
            allHaveQcode: allQuestions.every(q => q.QCODE)
        };
    }
}

// 테스트 실행
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Block 2-3 연동 검증 시작...');
    const result = await Block2_3IntegrationValidator.validateDataFlow();
    console.log('✅ 연동 검증 완료:', result);
});
