import json
import os

def check_qmanager_qcode():
    """Q매니저에서 사용하는 JSON 파일의 QCODE 체계 확인"""
    
    print("=== Q매니저 JSON 파일 QCODE 체계 확인 ===")
    
    # 파일 경로들
    files_to_check = [
        'static/data/qmanager_questions.json',  # Q매니저 파일
        'static/data/gep_master_v1.0.json'  # 메인 객관식 문제 (기준)
    ]
    
    for file_path in files_to_check:
        print(f"\n📁 파일: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"   ❌ 파일이 존재하지 않습니다.")
            continue
        
        try:
            with open(file_path, encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"   ✅ 파일 읽기 성공")
            
            # 메타데이터 확인
            metadata = data.get('metadata', {})
            print(f"   📋 버전: {metadata.get('version', 'N/A')}")
            print(f"   📅 생성일: {metadata.get('created_date', 'N/A')}")
            print(f"   📝 설명: {metadata.get('description', 'N/A')}")
            
            # Q매니저 구조 확인
            if 'questions' in data:
                questions = data['questions']
                if isinstance(questions, dict):
                    # Q매니저 구조 (딕셔너리 형태)
                    print(f"   📊 Q매니저 구조: 딕셔너리 형태")
                    print(f"   📊 총 문제 수: {len(questions)}개")
                    
                    # QCODE 체계 분석
                    print(f"   🔍 QCODE 체계 분석:")
                    
                    # 첫 번째 문제의 QCODE 확인
                    first_key = list(questions.keys())[0] if questions else 'N/A'
                    first_question = questions.get(first_key, {})
                    first_qcode = first_question.get('QCODE', 'N/A')
                    print(f"     첫 번째 QCODE: {first_qcode}")
                    
                    # QCODE 패턴 분석
                    qcode_patterns = {}
                    for qcode, question_data in questions.items():
                        if isinstance(question_data, dict):
                            qcode_value = question_data.get('QCODE', '')
                            if qcode_value:
                                if '-' in qcode_value:
                                    pattern = qcode_value.split('-')[0]  # AB20AA 부분만 추출
                                else:
                                    pattern = qcode_value
                                qcode_patterns[pattern] = qcode_patterns.get(pattern, 0) + 1
                    
                    print(f"     QCODE 패턴 수: {len(qcode_patterns)}개")
                    
                    # 패턴별 개수 (상위 5개만)
                    print(f"     주요 패턴:")
                    for i, (pattern, count) in enumerate(sorted(qcode_patterns.items())[:5]):
                        print(f"       {pattern}: {count}개")
                    
                    # 중복 확인
                    all_qcodes = [q.get('QCODE', '') for q in questions.values() if isinstance(q, dict) and q.get('QCODE', '')]
                    unique_qcodes = set(all_qcodes)
                    duplicates = len(all_qcodes) - len(unique_qcodes)
                    
                    print(f"     고유 QCODE: {len(unique_qcodes)}개")
                    print(f"     중복 QCODE: {duplicates}개")
                    
                    if duplicates > 0:
                        print(f"     ⚠️ 중복이 발견되었습니다!")
                    else:
                        print(f"     ✅ 중복 없음")
                    
                    # QCODE 예시 (처음 5개)
                    print(f"     QCODE 예시:")
                    for i, (qcode, question_data) in enumerate(list(questions.items())[:5]):
                        if isinstance(question_data, dict):
                            qcode_value = question_data.get('QCODE', 'N/A')
                            layer2 = question_data.get('LAYER2', 'N/A')
                            print(f"       {i+1}. {qcode_value} ({layer2})")
                
                elif isinstance(questions, list):
                    # 일반 리스트 구조
                    print(f"   📊 일반 구조: 리스트 형태")
                    print(f"   📊 총 문제 수: {len(questions)}개")
                    
                    if questions:
                        print(f"   🔍 QCODE 체계 분석:")
                        
                        # 첫 번째 문제의 QCODE 확인
                        first_qcode = questions[0].get('QCODE', 'N/A')
                        print(f"     첫 번째 QCODE: {first_qcode}")
                        
                        # QCODE 패턴 분석
                        qcode_patterns = {}
                        for question in questions:
                            qcode = question.get('QCODE', '')
                            if qcode:
                                if '-' in qcode:
                                    pattern = qcode.split('-')[0]
                                else:
                                    pattern = qcode
                                qcode_patterns[pattern] = qcode_patterns.get(pattern, 0) + 1
                        
                        print(f"     QCODE 패턴 수: {len(qcode_patterns)}개")
                        
                        # 패턴별 개수 (상위 5개만)
                        print(f"     주요 패턴:")
                        for i, (pattern, count) in enumerate(sorted(qcode_patterns.items())[:5]):
                            print(f"       {pattern}: {count}개")
                        
                        # 중복 확인
                        all_qcodes = [q.get('QCODE', '') for q in questions if q.get('QCODE', '')]
                        unique_qcodes = set(all_qcodes)
                        duplicates = len(all_qcodes) - len(unique_qcodes)
                        
                        print(f"     고유 QCODE: {len(unique_qcodes)}개")
                        print(f"     중복 QCODE: {duplicates}개")
                        
                        if duplicates > 0:
                            print(f"     ⚠️ 중복이 발견되었습니다!")
                        else:
                            print(f"     ✅ 중복 없음")
                        
                        # QCODE 예시 (처음 5개)
                        print(f"     QCODE 예시:")
                        for i, question in enumerate(questions[:5]):
                            qcode = question.get('QCODE', 'N/A')
                            layer2 = question.get('LAYER2', 'N/A')
                            print(f"       {i+1}. {qcode} ({layer2})")
            
        except Exception as e:
            print(f"   ❌ 파일 읽기 실패: {e}")
    
    print(f"\n=== QCODE 체계 비교 ===")
    
    # 두 파일의 QCODE 체계 비교
    try:
        # 메인 파일 읽기
        with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
            main_data = json.load(f)
        
        # Q매니저 파일 읽기
        if os.path.exists('static/data/qmanager_questions.json'):
            with open('static/data/qmanager_questions.json', encoding='utf-8') as f:
                qmanager_data = json.load(f)
            
            main_qcodes = [q.get('QCODE', '') for q in main_data.get('questions', [])]
            
            # Q매니저 QCODE 추출
            qmanager_questions = qmanager_data.get('questions', {})
            if isinstance(qmanager_questions, dict):
                qmanager_qcodes = [q.get('QCODE', '') for q in qmanager_questions.values() if isinstance(q, dict)]
            else:
                qmanager_qcodes = [q.get('QCODE', '') for q in qmanager_questions]
            
            print(f"메인 파일 QCODE 패턴: {main_qcodes[0] if main_qcodes else 'N/A'}")
            print(f"Q매니저 파일 QCODE 패턴: {qmanager_qcodes[0] if qmanager_qcodes else 'N/A'}")
            
            # 패턴 일치 확인
            if main_qcodes and qmanager_qcodes:
                main_pattern = main_qcodes[0].split('-')[0] if '-' in main_qcodes[0] else main_qcodes[0]
                qmanager_pattern = qmanager_qcodes[0].split('-')[0] if '-' in qmanager_qcodes[0] else qmanager_qcodes[0]
                
                if main_pattern == qmanager_pattern:
                    print(f"✅ QCODE 패턴이 일치합니다!")
                else:
                    print(f"❌ QCODE 패턴이 다릅니다!")
                    print(f"   메인: {main_pattern}")
                    print(f"   Q매니저: {qmanager_pattern}")
        else:
            print(f"Q매니저 파일이 존재하지 않습니다.")
            
    except Exception as e:
        print(f"비교 중 오류 발생: {e}")

if __name__ == "__main__":
    check_qmanager_qcode()
