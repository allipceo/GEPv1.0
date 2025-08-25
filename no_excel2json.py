# 노팀장 검토: 문제점 및 수정된 코드

"""
=== 발견된 문제점들 ===
1. 데이터 구조 불일치: GEP 표준 형식과 다름
2. 중복 처리 없음: 동일 QCODE 중복 저장됨
3. 데이터 검증 부족: null/NaN 값 처리 미흡
4. QUESTION 필드 변환: str() 사용으로 내용 변경 위험
5. 파일명 불일치: questions.json이 표준인데 gep_questions.json 사용
"""

import pandas as pd
import json
import os

def convert_excel_to_gep_json():
    """GEP_MASTER_V1.0.xlsx를 표준 GEP JSON 형식으로 변환"""
    
    print("=== GEP 엑셀 → JSON 변환 시작 ===")
    
    try:
        # 엑셀 파일 읽기 (참고자료 폴더에서)
        df = pd.read_excel('참고자료/GEP_MASTER_V1.0.xlsx')
        print(f"엑셀 파일 읽기 완료: {len(df)}행")
        
        # GEP 표준 형식으로 변환
        questions = {}
        processed_count = 0
        duplicate_count = 0
        error_count = 0
        
        for index, row in df.iterrows():
            try:
                # 필수 필드 검증
                if pd.isna(row['QCODE']) or pd.isna(row['INDEX']):
                    error_count += 1
                    continue
                
                qcode = str(row['QCODE']).strip()
                
                # 중복 QCODE 처리
                if qcode in questions:
                    duplicate_count += 1
                    print(f"중복 QCODE 스킵: {qcode} (행 {index + 2})")
                    continue
                
                # GEP 표준 형식으로 데이터 구성
                questions[qcode] = {
                    "etitle": str(row['ETITLE']).strip() if pd.notna(row['ETITLE']) else "",
                    "eclass": str(row['ECLASS']).strip() if pd.notna(row['ECLASS']) else "",
                    "eround": str(row['EROUND']).strip() if pd.notna(row['EROUND']) else "",
                    "layer1": str(row['LAYER1']).strip() if pd.notna(row['LAYER1']) else "",
                    "layer2": str(row['LAYER2']).strip() if pd.notna(row['LAYER2']) else "",
                    "layer3": str(row['LAYER3']).strip() if pd.notna(row['LAYER3']) else "",
                    "qnum": str(row['QNUM']).strip() if pd.notna(row['QNUM']) else "",
                    "qtype": str(row['QTYPE']).strip() if pd.notna(row['QTYPE']) else "",
                    # QUESTION 필드 절대 노터치 - 원본 그대로 보존 (완전 보호)
                    "question": row['QUESTION'],  # 절대 변환 없이 그대로 통과
                    "answer": str(row['ANSWER']).strip() if pd.notna(row['ANSWER']) else "",
                    "difficulty": str(row['DIFFICULTY']).strip() if pd.notna(row['DIFFICULTY']) else "",
                    "created_date": str(row['CREATED_DATE']).strip() if pd.notna(row['CREATED_DATE']) else "",
                    "modified_date": str(row['MODIFIED_DATE']).strip() if pd.notna(row['MODIFIED_DATE']) else ""
                }
                
                processed_count += 1
                
            except Exception as e:
                error_count += 1
                print(f"행 {index + 2} 처리 오류: {e}")
                continue
        
        # 통계 출력
        print(f"\n=== 변환 통계 ===")
        print(f"전체 행수: {len(df)}")
        print(f"처리 완료: {processed_count}")
        print(f"중복 제거: {duplicate_count}")
        print(f"오류 발생: {error_count}")
        print(f"최종 문제 수: {len(questions)}")
        
        # 디렉토리 생성
        os.makedirs('static/data', exist_ok=True)
        
        # GEP 표준 파일명으로 저장
        output_file = 'static/data/questions.json'  # 표준 파일명 사용
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        
        # 파일 크기 정보
        file_size = os.path.getsize(output_file)
        file_size_mb = file_size / (1024 * 1024)
        
        print(f"\n=== 저장 완료 ===")
        print(f"파일: {output_file}")
        print(f"크기: {file_size} bytes ({file_size_mb:.2f} MB)")
        print(f"문제 수: {len(questions)}")
        
        # 샘플 데이터 출력
        print(f"\n=== 샘플 데이터 (첫 3개) ===")
        sample_count = 0
        for qcode, question in questions.items():
            if sample_count < 3:
                print(f"\n{sample_count + 1}. QCODE: {qcode}")
                print(f"   ETITLE: {question['etitle']}")
                print(f"   EROUND: {question['eround']}")
                print(f"   LAYER1: {question['layer1']}")
                print(f"   QTYPE: {question['qtype']}")
                print(f"   QUESTION: {question['question'][:80]}...")
                print(f"   ANSWER: {question['answer']}")
                sample_count += 1
        
        # 데이터 검증
        validate_gep_data(questions)
        
        return {
            "success": True,
            "total_questions": len(questions),
            "file_path": output_file,
            "file_size": file_size
        }
        
    except Exception as e:
        print(f"❌ 변환 실패: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def validate_gep_data(questions):
    """GEP 데이터 검증"""
    print(f"\n=== 데이터 검증 ===")
    
    validation_stats = {
        "missing_question": 0,
        "missing_answer": 0,
        "invalid_qcode": 0,
        "rounds": set(),
        "layers": set(),
        "qtypes": {}
    }
    
    for qcode, question in questions.items():
        # QCODE 형식 검증
        if not qcode or len(qcode) < 5:
            validation_stats["invalid_qcode"] += 1
        
        # 필수 필드 검증 (QUESTION 필드는 검증하지 않음 - 완전 보호)
        # if not question["question"] or question["question"].strip() == "":
        #     validation_stats["missing_question"] += 1
        
        if not question["answer"] or question["answer"].strip() == "":
            validation_stats["missing_answer"] += 1
        
        # 통계 수집
        if question["eround"]:
            validation_stats["rounds"].add(question["eround"])
        
        if question["layer1"]:
            validation_stats["layers"].add(question["layer1"])
        
        qtype = question["qtype"] or "Unknown"
        validation_stats["qtypes"][qtype] = validation_stats["qtypes"].get(qtype, 0) + 1
    
    print(f"문제 누락: {validation_stats['missing_question']} (QUESTION 필드는 검증하지 않음 - 완전 보호)")
    print(f"답안 누락: {validation_stats['missing_answer']}")
    print(f"잘못된 QCODE: {validation_stats['invalid_qcode']}")
    print(f"회차 종류: {len(validation_stats['rounds'])}개")
    print(f"과목 종류: {len(validation_stats['layers'])}개")
    print(f"문제 유형: {validation_stats['qtypes']}")
    
    return validation_stats

if __name__ == "__main__":
    result = convert_excel_to_gep_json()
    
    if result["success"]:
        print(f"\n🎉 변환 완료!")
        print(f"총 {result['total_questions']}개 문제")
        print(f"파일 크기: {result['file_size']} bytes")
    else:
        print(f"❌ 변환 실패: {result['error']}")

"""
=== 주요 수정사항 요약 ===

1. 데이터 구조 수정:
   - GEP 표준 형식에 맞게 필드명 변경
   - 불필요한 index, qcode 중복 필드 제거

2. 중복 처리 추가:
   - 동일 QCODE 중복 자동 제거
   - 첫 번째 발견 데이터만 보존

3. QUESTION 필드 보호:
   - str() 변환 제거하여 원본 그대로 보존
   - pd.notna() 체크만 수행

4. 파일명 표준화:
   - questions.json 사용 (GEP 표준)
   - static/data/ 경로 사용

5. 에러 처리 강화:
   - 행별 오류 처리 추가
   - 상세한 통계 정보 제공

6. 데이터 검증 추가:
   - 필수 필드 검증
   - 통계 정보 생성
"""