// GEP_MASTER_V1.0.csv를 JSON으로 변환하는 코드
import Papa from 'papaparse';

async function convertCSVToJSON() {
    try {
        console.log("=== GEP CSV → JSON 변환 시작 ===");
        
        // CSV 파일 읽기
        const csvData = await window.fs.readFile('GEP_MASTER_V1.0.csv', { encoding: 'utf8' });
        console.log(`CSV 파일 읽기 완료: ${csvData.length} characters`);
        
        // CSV 파싱 (강력한 파싱 옵션 사용)
        const parseResult = Papa.parse(csvData, {
            header: true,                    // 첫 번째 행을 헤더로 사용
            dynamicTyping: true,            // 자동 타입 변환
            skipEmptyLines: true,           // 빈 줄 건너뛰기
            delimitersToGuess: [',', '\t', '|', ';']  // 구분자 자동 감지
        });
        
        if (parseResult.errors.length > 0) {
            console.warn("CSV 파싱 경고:", parseResult.errors);
        }
        
        console.log(`CSV 파싱 완료: ${parseResult.data.length}행`);
        console.log("헤더 필드:", parseResult.meta.fields);
        
        // GEP JSON 형식으로 변환
        const gepQuestionsData = {};
        let processedCount = 0;
        let skippedCount = 0;
        let duplicateCount = 0;
        
        parseResult.data.forEach((row, index) => {
            // 필수 필드 확인
            if (row.INDEX && row.QCODE) {
                const qcode = row.QCODE.toString().trim();
                
                // 중복 QCODE 체크
                if (gepQuestionsData[qcode]) {
                    duplicateCount++;
                    console.log(`중복 QCODE 발견: ${qcode} (행 ${index + 2})`);
                    return; // 중복이면 첫 번째 것만 유지
                }
                
                // GEP 형식으로 데이터 구조화
                gepQuestionsData[qcode] = {
                    "etitle": (row.ETITLE || "").toString().trim(),
                    "eclass": (row.ECLASS || "").toString().trim(),
                    "eround": row.EROUND ? row.EROUND.toString() : "",
                    "layer1": (row.LAYER1 || "").toString().trim(),
                    "layer2": (row.LAYER2 || "").toString().trim(),
                    "layer3": row.LAYER3 ? row.LAYER3.toString() : "",
                    "qnum": row.QNUM ? row.QNUM.toString() : "",
                    "qtype": (row.QTYPE || "").toString().trim(),
                    "question": row.QUESTION || "",  // QUESTION 필드 노터치
                    "answer": (row.ANSWER || "").toString().trim(),
                    "difficulty": row.DIFFICULTY ? row.DIFFICULTY.toString() : "",
                    "created_date": (row.CREATED_DATE || "").toString().trim(),
                    "modified_date": (row.MODIFIED_DATE || "").toString().trim()
                };
                
                processedCount++;
            } else {
                skippedCount++;
                if (index < 10) { // 처음 10개만 로그
                    console.log(`필수 필드 누락 (행 ${index + 2}): INDEX=${row.INDEX}, QCODE=${row.QCODE}`);
                }
            }
        });
        
        console.log("=== 변환 통계 ===");
        console.log(`전체 CSV 행수: ${parseResult.data.length}`);
        console.log(`처리된 문제 수: ${processedCount}`);
        console.log(`스킵된 행 수: ${skippedCount}`);
        console.log(`중복 제거된 수: ${duplicateCount}`);
        console.log(`최종 고유 문제 수: ${Object.keys(gepQuestionsData).length}`);
        
        // 샘플 데이터 출력
        console.log("\n=== 변환된 데이터 샘플 (첫 3개) ===");
        let sampleCount = 0;
        for (const [qcode, question] of Object.entries(gepQuestionsData)) {
            if (sampleCount < 3) {
                console.log(`\n${sampleCount + 1}. QCODE: ${qcode}`);
                console.log(`   ETITLE: ${question.etitle}`);
                console.log(`   ECLASS: ${question.eclass}`);
                console.log(`   EROUND: ${question.eround}`);
                console.log(`   LAYER1: ${question.layer1}`);
                console.log(`   QTYPE: ${question.qtype}`);
                console.log(`   QUESTION: ${question.question ? question.question.substring(0, 80) + '...' : 'N/A'}`);
                console.log(`   ANSWER: ${question.answer}`);
                sampleCount++;
            }
        }
        
        // JSON 문자열 생성 (2칸 들여쓰기)
        const jsonString = JSON.stringify(gepQuestionsData, null, 2);
        
        // 파일 크기 계산
        const fileSizeBytes = new Blob([jsonString]).size;
        const fileSizeKB = (fileSizeBytes / 1024).toFixed(1);
        const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
        
        console.log(`\n=== 최종 JSON 파일 정보 ===`);
        console.log(`파일 크기: ${fileSizeBytes} bytes (${fileSizeKB} KB / ${fileSizeMB} MB)`);
        console.log(`총 문제 수: ${Object.keys(gepQuestionsData).length}`);
        
        // 전역 변수에 저장하여 다운로드 가능하게 함
        globalThis.gepQuestionsJSON = jsonString;
        globalThis.gepQuestionsData = gepQuestionsData;
        
        console.log("\n✅ CSV → JSON 변환 완료!");
        console.log("변환된 JSON은 globalThis.gepQuestionsJSON에 저장되었습니다.");
        
        return {
            success: true,
            totalQuestions: Object.keys(gepQuestionsData).length,
            fileSizeBytes: fileSizeBytes,
            data: gepQuestionsData,
            jsonString: jsonString
        };
        
    } catch (error) {
        console.error("❌ 변환 오류:", error);
        console.error("오류 스택:", error.stack);
        return {
            success: false,
            error: error.message
        };
    }
}

// 데이터 검증 함수
function validateGEPData(data) {
    console.log("\n=== 데이터 검증 시작 ===");
    
    let validationResults = {
        totalQuestions: Object.keys(data).length,
        missingQuestions: 0,
        missingAnswers: 0,
        invalidQCodes: 0,
        uniqueRounds: new Set(),
        uniqueLayers: new Set(),
        questionTypes: {},
    };
    
    for (const [qcode, question] of Object.entries(data)) {
        // QCODE 형식 검증
        if (!qcode.match(/^[A-Z]{4}-\d{2}$/)) {
            validationResults.invalidQCodes++;
        }
        
        // 필수 필드 검증
        if (!question.question || question.question.trim() === '') {
            validationResults.missingQuestions++;
        }
        
        if (!question.answer || question.answer.trim() === '') {
            validationResults.missingAnswers++;
        }
        
        // 통계 수집
        if (question.eround) validationResults.uniqueRounds.add(question.eround);
        if (question.layer1) validationResults.uniqueLayers.add(question.layer1);
        
        const qtype = question.qtype || 'Unknown';
        validationResults.questionTypes[qtype] = (validationResults.questionTypes[qtype] || 0) + 1;
    }
    
    console.log("검증 결과:");
    console.log(`총 문제 수: ${validationResults.totalQuestions}`);
    console.log(`문제 내용 누락: ${validationResults.missingQuestions}`);
    console.log(`답안 누락: ${validationResults.missingAnswers}`);
    console.log(`잘못된 QCODE 형식: ${validationResults.invalidQCodes}`);
    console.log(`회차 수: ${validationResults.uniqueRounds.size}개 (${Array.from(validationResults.uniqueRounds).join(', ')})`);
    console.log(`과목 수: ${validationResults.uniqueLayers.size}개 (${Array.from(validationResults.uniqueLayers).join(', ')})`);
    console.log(`문제 유형:`, validationResults.questionTypes);
    
    return validationResults;
}

// 실행 함수
async function main() {
    const result = await convertCSVToJSON();
    
    if (result.success) {
        validateGEPData(result.data);
        console.log("\n🎉 모든 작업 완료!");
    } else {
        console.log("❌ 변환 실패:", result.error);
    }
    
    return result;
}

// 실행
main();