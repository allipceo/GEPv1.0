/**
 * QGENERATOR 디버깅 스크립트
 * 데이터 로딩 및 필터링 문제 해결
 */

// 디버깅 함수들
function debugDataLoading() {
    console.log('🔍 데이터 로딩 디버깅 시작...');
    
    if (window.qGenerator) {
        console.log('✅ QGenerator 인스턴스 확인됨');
        console.log(`📊 마스터 데이터: ${window.qGenerator.masterData ? window.qGenerator.masterData.length : '없음'}개`);
        console.log(`📋 기출문제: ${window.qGenerator.originalQuestions ? window.qGenerator.originalQuestions.length : '없음'}개`);
        
        if (window.qGenerator.originalQuestions && window.qGenerator.originalQuestions.length > 0) {
            console.log('📝 첫 번째 문제 예시:');
            console.log(window.qGenerator.originalQuestions[0]);
        }
    } else {
        console.log('❌ QGenerator 인스턴스를 찾을 수 없음');
    }
}

function debugFiltering() {
    console.log('🔍 필터링 디버깅 시작...');
    
    if (window.qGenerator && window.qGenerator.originalQuestions) {
        const questions = window.qGenerator.originalQuestions;
        
        // 회차별 통계
        const roundStats = {};
        questions.forEach(q => {
            const round = q.EROUND;
            if (!roundStats[round]) roundStats[round] = 0;
            roundStats[round]++;
        });
        
        console.log('📊 회차별 문제 수:');
        Object.entries(roundStats).forEach(([round, count]) => {
            console.log(`   ${round}: ${count}개`);
        });
        
        // LAYER1별 통계
        const layerStats = {};
        questions.forEach(q => {
            const layer = q.LAYER1;
            if (!layerStats[layer]) layerStats[layer] = 0;
            layerStats[layer]++;
        });
        
        console.log('📊 LAYER1별 문제 수:');
        Object.entries(layerStats).forEach(([layer, count]) => {
            console.log(`   ${layer}: ${count}개`);
        });
    }
}

function testFiltering(round, layer) {
    console.log(`🔍 필터링 테스트: ${round}회, ${layer}`);
    
    if (window.qGenerator && window.qGenerator.originalQuestions) {
        const questions = window.qGenerator.originalQuestions;
        
        // 필터링 테스트
        let filtered = questions;
        
        if (round) {
            filtered = filtered.filter(q => q.EROUND === round + '.0');
            console.log(`📊 ${round}회 필터링 후: ${filtered.length}개`);
        }
        
        if (layer) {
            filtered = filtered.filter(q => q.LAYER1 === layer);
            console.log(`📊 ${layer} 필터링 후: ${filtered.length}개`);
        }
        
        if (filtered.length > 0) {
            console.log('📝 필터링된 문제 예시:');
            filtered.slice(0, 3).forEach((q, index) => {
                console.log(`   ${index + 1}. ${q.QCODE} - ${q.QUESTION.substring(0, 50)}...`);
            });
        }
        
        return filtered;
    }
    
    return [];
}

function forceRenderQuestionList() {
    console.log('🔄 문제 목록 강제 렌더링...');
    
    if (window.qGenerator) {
        window.qGenerator.renderQuestionList();
        console.log('✅ 문제 목록 렌더링 완료');
    }
}

function testSpecificFilter() {
    console.log('🧪 특정 필터 테스트...');
    
    // 21회 관계법령 테스트
    const filtered = testFiltering('21', '관계법령');
    
    if (filtered.length > 0) {
        console.log('✅ 필터링 성공! 문제 목록 렌더링 시도...');
        forceRenderQuestionList();
    } else {
        console.log('❌ 필터링된 문제가 없음');
    }
}

// 전역 함수로 노출
window.debugQGData = debugDataLoading;
window.debugQGFilter = debugFiltering;
window.testQGFilter = testFiltering;
window.forceQGRender = forceRenderQuestionList;
window.testQGSpecific = testSpecificFilter;

// 자동 디버깅 실행
setTimeout(() => {
    console.log('🚀 QGENERATOR 디버깅 스크립트 로드됨');
    console.log('💡 사용 가능한 함수:');
    console.log('   - window.debugQGData()');
    console.log('   - window.debugQGFilter()');
    console.log('   - window.testQGFilter(회차, LAYER)');
    console.log('   - window.forceQGRender()');
    console.log('   - window.testQGSpecific()');
    
    // 자동 디버깅 실행
    debugDataLoading();
    debugFiltering();
}, 2000);
