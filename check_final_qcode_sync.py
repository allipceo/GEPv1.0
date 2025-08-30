import json
import pandas as pd
import os

def check_final_qcode_sync():
    """Q매니저-문제제이슨-작업용엑셀파일의 QCODE 동기화 상태 최종 확인"""
    
    print("=== Q매니저-문제제이슨-작업용엑셀파일 QCODE 동기화 상태 확인 ===")
    
    # 파일 경로들
    files_to_check = {
        'Q매니저': 'static/data/qmanager_questions.json',
        '문제제이슨': 'static/data/gep_master_v1.0.json',
        '작업용엑셀': '참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx'
    }
    
    sync_status = {}
    
    for name, file_path in files_to_check.items():
        print(f"\n📁 {name}: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"   ❌ 파일이 존재하지 않습니다.")
            sync_status[name] = {'exists': False}
            continue
        
        try:
            if file_path.endswith('.json'):
                with open(file_path, encoding='utf-8') as f:
                    data = json.load(f)
                
                if name == 'Q매니저':
                    # Q매니저: 부모 QCODE 추출
                    questions = data.get('questions', {})
                    qcodes = list(questions.keys())
                    total_records = len(qcodes)
                    
                elif name == '문제제이슨':
                    # 문제제이슨: QCODE 추출
                    questions = data.get('questions', [])
                    qcodes = [q.get('QCODE', '') for q in questions if q.get('QCODE', '')]
                    total_records = len(qcodes)
                
            elif file_path.endswith('.xlsx'):
                # 엑셀: QCODE 컬럼 추출
                df = pd.read_excel(file_path)
                qcodes = df['QCODE'].dropna().tolist()
                total_records = len(qcodes)
            
            print(f"   ✅ 파일 읽기 성공")
            print(f"   📊 총 레코드: {total_records}개")
            
            if qcodes:
                print(f"   🔍 QCODE 예시:")
                for i, qcode in enumerate(qcodes[:5]):
                    print(f"      {i+1}. {qcode}")
                
                # QCODE 패턴 분석
                pattern_counts = {}
                for qcode in qcodes:
                    if '-' in qcode:
                        base = qcode.split('-')[0]  # AB20AA 부분
                        if base not in pattern_counts:
                            pattern_counts[base] = 0
                        pattern_counts[base] += 1
                
                print(f"   📋 QCODE 패턴 분포:")
                for pattern, count in sorted(pattern_counts.items())[:5]:
                    print(f"      {pattern}: {count}개")
                
                # 중복 확인
                unique_qcodes = set(qcodes)
                duplicates = len(qcodes) - len(unique_qcodes)
                
                print(f"   🔍 중복 확인:")
                print(f"      고유 QCODE: {len(unique_qcodes)}개")
                print(f"      중복 QCODE: {duplicates}개")
                
                if duplicates == 0:
                    print(f"      ✅ 중복 없음")
                else:
                    print(f"      ⚠️ 중복 발견")
                
                sync_status[name] = {
                    'exists': True,
                    'total_records': total_records,
                    'unique_qcodes': len(unique_qcodes),
                    'duplicates': duplicates,
                    'sample_qcodes': qcodes[:5],
                    'pattern_counts': pattern_counts
                }
            else:
                print(f"   ❌ QCODE가 없습니다.")
                sync_status[name] = {'exists': True, 'total_records': 0}
                
        except Exception as e:
            print(f"   ❌ 파일 읽기 실패: {e}")
            sync_status[name] = {'exists': False, 'error': str(e)}
    
    # 동기화 상태 비교
    print(f"\n=== QCODE 동기화 상태 비교 ===")
    
    # 모든 파일이 존재하는지 확인
    all_exist = all(status.get('exists', False) for status in sync_status.values())
    
    if not all_exist:
        print(f"❌ 일부 파일이 존재하지 않습니다.")
        return
    
    # 레코드 수 비교
    record_counts = {}
    for name, status in sync_status.items():
        if status.get('exists') and 'total_records' in status:
            record_counts[name] = status['total_records']
    
    print(f"📊 레코드 수 비교:")
    for name, count in record_counts.items():
        print(f"   {name}: {count}개")
    
    # 레코드 수 일치 확인
    if len(set(record_counts.values())) == 1:
        print(f"✅ 모든 파일의 레코드 수가 일치합니다!")
    else:
        print(f"❌ 레코드 수가 일치하지 않습니다.")
    
    # QCODE 패턴 비교
    print(f"\n🔍 QCODE 패턴 비교:")
    
    # 문제제이슨을 기준으로 비교
    master_patterns = sync_status.get('문제제이슨', {}).get('pattern_counts', {})
    
    if master_patterns:
        print(f"   📋 문제제이슨 기준 패턴:")
        for pattern, count in sorted(master_patterns.items())[:5]:
            print(f"      {pattern}: {count}개")
        
        # 다른 파일들과 패턴 비교
        for name, status in sync_status.items():
            if name != '문제제이슨' and 'pattern_counts' in status:
                file_patterns = status['pattern_counts']
                
                # 패턴 일치 확인
                matching_patterns = 0
                total_patterns = len(master_patterns)
                
                for pattern in master_patterns:
                    if pattern in file_patterns:
                        if master_patterns[pattern] == file_patterns[pattern]:
                            matching_patterns += 1
                
                match_rate = (matching_patterns / total_patterns * 100) if total_patterns > 0 else 0
                
                print(f"\n   📊 {name} 패턴 일치율: {match_rate:.1f}% ({matching_patterns}/{total_patterns})")
                
                if match_rate == 100:
                    print(f"      ✅ 완전 일치")
                elif match_rate >= 80:
                    print(f"      ⚠️ 대부분 일치")
                else:
                    print(f"      ❌ 불일치")
    
    # 최종 동기화 상태 평가
    print(f"\n=== 최종 동기화 상태 평가 ===")
    
    # 모든 조건 확인
    conditions = []
    
    # 1. 모든 파일 존재
    conditions.append(all_exist)
    print(f"1. 모든 파일 존재: {'✅' if all_exist else '❌'}")
    
    # 2. 레코드 수 일치
    record_match = len(set(record_counts.values())) == 1 if record_counts else False
    conditions.append(record_match)
    print(f"2. 레코드 수 일치: {'✅' if record_match else '❌'}")
    
    # 3. 중복 없음
    no_duplicates = all(status.get('duplicates', 0) == 0 for status in sync_status.values() if status.get('exists'))
    conditions.append(no_duplicates)
    print(f"3. 중복 없음: {'✅' if no_duplicates else '❌'}")
    
    # 4. QCODE 패턴 일치 (문제제이슨 기준)
    pattern_match = True
    if master_patterns:
        for name, status in sync_status.items():
            if name != '문제제이슨' and 'pattern_counts' in status:
                file_patterns = status['pattern_counts']
                for pattern in master_patterns:
                    if pattern not in file_patterns or master_patterns[pattern] != file_patterns[pattern]:
                        pattern_match = False
                        break
    
    conditions.append(pattern_match)
    print(f"4. QCODE 패턴 일치: {'✅' if pattern_match else '❌'}")
    
    # 최종 평가
    all_conditions_met = all(conditions)
    
    print(f"\n🎯 최종 평가:")
    if all_conditions_met:
        print(f"   🎉 완벽한 동기화 상태입니다!")
        print(f"   ✅ Q매니저-문제제이슨-작업용엑셀파일의 QCODE가 완전히 동기화되어 있습니다.")
    else:
        print(f"   ⚠️ 동기화가 완료되지 않았습니다.")
        print(f"   🔧 추가 작업이 필요합니다.")

if __name__ == "__main__":
    check_final_qcode_sync()
