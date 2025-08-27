/**
 * QGENERATOR 시뮬레이션 데이터
 * 실제 사용 시나리오를 시뮬레이션하기 위한 데이터
 */

// 시뮬레이션 시나리오
const simulationScenarios = [
    {
        name: "30회 관계법령 문제 생성",
        originalQCODE: "ABAA-1321",
        description: "30회 관계법령 1번 문제에서 파생된 객관식 문제들",
        questions: [
            {
                questionText: "다음 중 보험업법상 손해보험상품에 해당하는 것은?",
                option1: "퇴직보험계약",
                option2: "날씨보험계약", 
                option3: "재보험계약",
                option4: "비용보험계약",
                correctAnswer: "2",
                explanation: "날씨보험은 손해보험상품에 해당합니다."
            },
            {
                questionText: "보험업법상 손해보험의 특징으로 올바른 것은?",
                option1: "사망보장이 주된 목적이다",
                option2: "재산상의 손해를 보장한다",
                option3: "생명보험과 동일한 규제를 받는다",
                option4: "장기보험만 해당한다",
                correctAnswer: "2",
                explanation: "손해보험은 재산상의 손해를 보장하는 것이 특징입니다."
            },
            {
                questionText: "퇴직보험계약의 성격으로 올바른 것은?",
                option1: "손해보험상품이다",
                option2: "생명보험상품이다",
                option3: "제3보험상품이다",
                option4: "보험상품이 아니다",
                correctAnswer: "2",
                explanation: "퇴직보험은 생명보험상품에 해당합니다."
            }
        ]
    },
    {
        name: "30회 관계법령 2번 문제 생성",
        originalQCODE: "ABAA-1322", 
        description: "30회 관계법령 2번 문제에서 파생된 객관식 문제들",
        questions: [
            {
                questionText: "보험계약이 성립하기 위한 필수요건은?",
                option1: "보험료 납입",
                option2: "보험사고 발생",
                option3: "보험금 지급",
                option4: "계약해지",
                correctAnswer: "1",
                explanation: "보험료 납입은 보험계약 성립의 필수요건입니다."
            },
            {
                questionText: "보험계약의 당사자에 해당하지 않는 것은?",
                option1: "보험자",
                option2: "보험계약자",
                option3: "보험금 수령인",
                option4: "보험중개사",
                correctAnswer: "4",
                explanation: "보험중개사는 보험계약의 당사자가 아닙니다."
            }
        ]
    },
    {
        name: "30회 손보1부 문제 생성",
        originalQCODE: "ABBA-1321",
        description: "30회 손보1부 1번 문제에서 파생된 객관식 문제들", 
        questions: [
            {
                questionText: "자동차보험의 보장범위에 포함되지 않는 것은?",
                option1: "대인배상",
                option2: "대물배상",
                option3: "자기차량손해",
                option4: "생명보험금",
                correctAnswer: "4",
                explanation: "생명보험금은 자동차보험의 보장범위에 포함되지 않습니다."
            },
            {
                questionText: "자동차보험의 특징으로 올바른 것은?",
                option1: "장기보험이다",
                option2: "단기보험이다",
                option3: "생명보험이다",
                option4: "제3보험이다",
                correctAnswer: "2",
                explanation: "자동차보험은 단기보험에 해당합니다."
            }
        ]
    }
];

// 시뮬레이션 실행 함수
function runSimulation(scenarioIndex = 0) {
    console.log('🎬 QGENERATOR 시뮬레이션 시작...');
    
    if (scenarioIndex >= simulationScenarios.length) {
        console.log('✅ 모든 시뮬레이션 완료!');
        return;
    }
    
    const scenario = simulationScenarios[scenarioIndex];
    console.log(`\n📋 시뮬레이션 ${scenarioIndex + 1}: ${scenario.name}`);
    console.log(`📝 설명: ${scenario.description}`);
    
    // 1. 원본 문제 선택
    const originalQuestion = window.qGenerator.originalQuestions.find(q => q.QCODE === scenario.originalQCODE);
    
    if (!originalQuestion) {
        console.log(`❌ 원본 문제를 찾을 수 없음: ${scenario.originalQCODE}`);
        runSimulation(scenarioIndex + 1);
        return;
    }
    
    console.log(`✅ 원본 문제 선택: ${originalQuestion.QCODE}`);
    window.qGenerator.selectOriginalQuestion(scenario.originalQCODE);
    
    // 2. 각 파생 문제 생성
    scenario.questions.forEach((question, qIndex) => {
        setTimeout(() => {
            console.log(`\n🔄 파생 문제 ${qIndex + 1} 생성 중...`);
            
            // 폼에 데이터 입력
            document.getElementById('questionText').value = question.questionText;
            document.getElementById('option1').value = question.option1;
            document.getElementById('option2').value = question.option2;
            document.getElementById('option3').value = question.option3;
            document.getElementById('option4').value = question.option4;
            
            // 정답 선택
            const correctRadio = document.querySelector(`input[name="correctAnswer"][value="${question.correctAnswer}"]`);
            if (correctRadio) {
                correctRadio.checked = true;
            }
            
            // QCODE 미리보기
            window.qGenerator.updateQCodePreview();
            const previewElement = document.getElementById('qcodePreview');
            console.log(`🔍 생성될 QCODE: ${previewElement.textContent}`);
            
            // 업로드
            setTimeout(() => {
                window.qGenerator.handleUpload();
                console.log(`✅ 파생 문제 ${qIndex + 1} 생성 완료`);
                
                // 마지막 문제인 경우 다음 시나리오로
                if (qIndex === scenario.questions.length - 1) {
                    setTimeout(() => {
                        runSimulation(scenarioIndex + 1);
                    }, 1000);
                }
            }, 500);
            
        }, qIndex * 2000);
    });
}

// 배치 시뮬레이션 (모든 시나리오 실행)
function runBatchSimulation() {
    console.log('🚀 배치 시뮬레이션 시작...');
    console.log(`📊 총 ${simulationScenarios.length}개 시나리오 실행 예정`);
    
    // 생성된 문제 목록 초기화
    window.qGenerator.generatedQuestions = [];
    window.qGenerator.renderGeneratedQuestions();
    
    // 시뮬레이션 시작
    runSimulation(0);
}

// 통계 출력 함수
function showSimulationStats() {
    console.log('\n📊 시뮬레이션 통계');
    console.log('==================');
    
    if (window.qGenerator) {
        console.log(`📋 총 기출문제: ${window.qGenerator.originalQuestions.length}개`);
        console.log(`🎯 생성된 문제: ${window.qGenerator.generatedQuestions.length}개`);
        
        // 원본별 통계
        const statsByOriginal = {};
        window.qGenerator.generatedQuestions.forEach(q => {
            const original = q.SOURCE_QCODE;
            if (!statsByOriginal[original]) {
                statsByOriginal[original] = 0;
            }
            statsByOriginal[original]++;
        });
        
        console.log('\n📈 원본별 생성 통계:');
        Object.entries(statsByOriginal).forEach(([original, count]) => {
            console.log(`   ${original}: ${count}개`);
        });
        
        // 난이도별 통계
        const statsByDifficulty = {};
        window.qGenerator.generatedQuestions.forEach(q => {
            const difficulty = q.DIFFICULTY;
            if (!statsByDifficulty[difficulty]) {
                statsByDifficulty[difficulty] = 0;
            }
            statsByDifficulty[difficulty]++;
        });
        
        console.log('\n📊 난이도별 통계:');
        Object.entries(statsByDifficulty).forEach(([difficulty, count]) => {
            console.log(`   ${difficulty}: ${count}개`);
        });
    }
}

// 전역 함수로 노출
window.runQGSimulation = runSimulation;
window.runQGBatchSimulation = runBatchSimulation;
window.showQGStats = showSimulationStats;

console.log('🎬 QGENERATOR 시뮬레이션 스크립트 로드됨');
console.log('💡 사용 가능한 함수:');
console.log('   - window.runQGSimulation(시나리오인덱스)');
console.log('   - window.runQGBatchSimulation()');
console.log('   - window.showQGStats()');
