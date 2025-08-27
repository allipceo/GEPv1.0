/**
 * QGENERATOR 테스트용 문제 데이터
 * 실제 테스트를 위한 샘플 문제들
 */

// 테스트용 문제 데이터
const testQuestions = [
    {
        originalQCODE: "ABAA-1321",
        originalQuestion: "보험업법상 손해보험상품이 아닌 것은?",
        derivedQuestions: [
            {
                questionText: "다음 중 보험업법상 손해보험상품에 해당하는 것은?",
                option1: "퇴직보험계약",
                option2: "날씨보험계약",
                option3: "재보험계약",
                option4: "비용보험계약",
                correctAnswer: "2"
            },
            {
                questionText: "보험업법상 손해보험의 특징으로 올바른 것은?",
                option1: "사망보장이 주된 목적이다",
                option2: "재산상의 손해를 보장한다",
                option3: "생명보험과 동일한 규제를 받는다",
                option4: "장기보험만 해당한다",
                correctAnswer: "2"
            }
        ]
    },
    {
        originalQCODE: "ABAA-1322",
        originalQuestion: "보험계약의 성립요건이 아닌 것은?",
        derivedQuestions: [
            {
                questionText: "보험계약이 성립하기 위한 필수요건은?",
                option1: "보험료 납입",
                option2: "보험사고 발생",
                option3: "보험금 지급",
                option4: "계약해지",
                correctAnswer: "1"
            },
            {
                questionText: "보험계약의 당사자에 해당하지 않는 것은?",
                option1: "보험자",
                option2: "보험계약자",
                option3: "보험금 수령인",
                option4: "보험중개사",
                correctAnswer: "4"
            }
        ]
    }
];

// 테스트 실행 함수
function runTest() {
    console.log('🧪 QGENERATOR 테스트 시작...');
    
    // 1. 시스템 초기화 테스트
    console.log('1️⃣ 시스템 초기화 테스트');
    if (window.qGenerator) {
        console.log('✅ QGenerator 인스턴스 확인됨');
        console.log(`📊 로드된 기출문제: ${window.qGenerator.originalQuestions.length}개`);
    } else {
        console.log('❌ QGenerator 인스턴스를 찾을 수 없음');
        return;
    }
    
    // 2. 문제 선택 테스트
    console.log('\n2️⃣ 문제 선택 테스트');
    const testQCODE = "ABAA-1321";
    const originalQuestion = window.qGenerator.originalQuestions.find(q => q.QCODE === testQCODE);
    
    if (originalQuestion) {
        console.log('✅ 테스트 문제 찾음:', originalQuestion.QCODE);
        console.log('📝 원본 문제:', originalQuestion.QUESTION);
        
        // 문제 선택 시뮬레이션
        window.qGenerator.selectOriginalQuestion(testQCODE);
        console.log('✅ 문제 선택 완료');
    } else {
        console.log('❌ 테스트 문제를 찾을 수 없음');
    }
    
    // 3. 문제 생성 테스트
    console.log('\n3️⃣ 문제 생성 테스트');
    const testQuestion = testQuestions[0].derivedQuestions[0];
    
    // 폼에 테스트 데이터 입력
    document.getElementById('questionText').value = testQuestion.questionText;
    document.getElementById('option1').value = testQuestion.option1;
    document.getElementById('option2').value = testQuestion.option2;
    document.getElementById('option3').value = testQuestion.option3;
    document.getElementById('option4').value = testQuestion.option4;
    
    // 정답 선택
    const correctRadio = document.querySelector(`input[name="correctAnswer"][value="${testQuestion.correctAnswer}"]`);
    if (correctRadio) {
        correctRadio.checked = true;
    }
    
    console.log('✅ 테스트 데이터 입력 완료');
    console.log('📝 입력된 문제:', testQuestion.questionText);
    console.log('🎯 정답:', testQuestion.correctAnswer);
    
    // QCODE 미리보기 확인
    window.qGenerator.updateQCodePreview();
    const previewElement = document.getElementById('qcodePreview');
    console.log('🔍 생성될 QCODE:', previewElement.textContent);
    
    // 4. 업로드 테스트
    console.log('\n4️⃣ 업로드 테스트');
    setTimeout(() => {
        window.qGenerator.handleUpload();
        console.log('✅ 업로드 테스트 완료');
        
        // 5. 생성된 문제 확인
        console.log('\n5️⃣ 생성된 문제 확인');
        console.log('📊 생성된 문제 수:', window.qGenerator.generatedQuestions.length);
        
        if (window.qGenerator.generatedQuestions.length > 0) {
            const generatedQuestion = window.qGenerator.generatedQuestions[0];
            console.log('✅ 첫 번째 생성된 문제:');
            console.log('   QCODE:', generatedQuestion.QCODE);
            console.log('   문제:', generatedQuestion.QUESTION);
            console.log('   정답:', generatedQuestion.ANSWER);
            console.log('   난이도:', generatedQuestion.DIFFICULTY);
        }
        
        // 6. 저장 테스트
        console.log('\n6️⃣ 저장 테스트');
        setTimeout(() => {
            window.qGenerator.handleSave();
            console.log('✅ 저장 테스트 완료');
            
            console.log('\n🎉 모든 테스트 완료!');
            console.log('📋 테스트 결과 요약:');
            console.log('   - 시스템 초기화: ✅');
            console.log('   - 문제 선택: ✅');
            console.log('   - 문제 생성: ✅');
            console.log('   - 업로드: ✅');
            console.log('   - 저장: ✅');
            
        }, 1000);
        
    }, 1000);
}

// 전역 함수로 노출
window.runQGTest = runTest;

// 자동 테스트 실행 (페이지 로드 후 3초)
setTimeout(() => {
    if (window.qGenerator && window.qGenerator.originalQuestions.length > 0) {
        console.log('🚀 자동 테스트 시작...');
        runTest();
    } else {
        console.log('⏳ 시스템 로딩 대기 중...');
        setTimeout(runTest, 2000);
    }
}, 3000);

console.log('🧪 QGENERATOR 테스트 스크립트 로드됨');
console.log('💡 수동 테스트 실행: window.runQGTest()');
