import json
import os

def check_qgenerator_qcode():
    """Q제너레이터에서 사용하는 객관식 문제 JSON 파일의 QCODE 체계 확인"""
    
    print("=== Q제너레이터 객관식 문제 JSON 파일 QCODE 체계 확인 ===")
    
    # 파일 경로들
    files_to_check = [
        'static/data/gep_generated_questions.json',  # Q제너레이터에서 생성된 진위형 문제
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
            print(f"   📊 총 문제 수: {len(data.get('questions', []))}개")
            
            # 메타데이터 확인
            metadata = data.get('metadata', {})
            print(f"   📋 버전: {metadata.get('version', 'N/A')}")
            print(f"   📅 생성일: {metadata.get('created_date', 'N/A')}")
            
            # QCODE 체계 분석
            questions = data.get('questions', [])
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
                            pattern = qcode.split('-')[0]  # AB20AA 부분만 추출
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
        
        # Q제너레이터 파일 읽기
        if os.path.exists('static/data/gep_generated_questions.json'):
            with open('static/data/gep_generated_questions.json', encoding='utf-8') as f:
                generated_data = json.load(f)
            
            main_qcodes = [q.get('QCODE', '') for q in main_data.get('questions', [])]
            generated_qcodes = [q.get('QCODE', '') for q in generated_data.get('questions', [])]
            
            print(f"메인 파일 QCODE 패턴: {main_qcodes[0] if main_qcodes else 'N/A'}")
            print(f"Q제너레이터 파일 QCODE 패턴: {generated_qcodes[0] if generated_qcodes else 'N/A'}")
            
            # 패턴 일치 확인
            if main_qcodes and generated_qcodes:
                main_pattern = main_qcodes[0].split('-')[0] if '-' in main_qcodes[0] else main_qcodes[0]
                generated_pattern = generated_qcodes[0].split('-')[0] if '-' in generated_qcodes[0] else generated_qcodes[0]
                
                if main_pattern == generated_pattern:
                    print(f"✅ QCODE 패턴이 일치합니다!")
                else:
                    print(f"❌ QCODE 패턴이 다릅니다!")
                    print(f"   메인: {main_pattern}")
                    print(f"   Q제너레이터: {generated_pattern}")
        else:
            print(f"Q제너레이터 파일이 존재하지 않습니다.")
            
    except Exception as e:
        print(f"비교 중 오류 발생: {e}")

if __name__ == "__main__":
    check_qgenerator_qcode()
