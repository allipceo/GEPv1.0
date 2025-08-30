import json
import pandas as pd
import os
import re
from datetime import datetime

def check_qcode_compliance():
    """G048 문서의 QCODE 체계 준수 여부 확인"""
    
    print("=== G048 QCODE 체계 준수 여부 확인 ===")
    print("=" * 60)
    
    # G048 문서에서 정의한 QCODE 체계
    print("📋 G048 문서 QCODE 체계:")
    print("   - 객관식 문제: ABCD-XX (예: AB20AA-01)")
    print("   - 진위형 문제: ABCD-XX-BY (예: AB20AA-01-B1)")
    print("   - EROUND 정보: 3-4번째 자리 (예: 20, 21, 22)")
    print("   - LAYER1+QTYPE: 5-6번째 자리 (예: AA, BA, CA)")
    print()
    
    # 파일 경로
    excel_file = '참고자료/GEP_MASTER_V1.0(LAYER2포함).xlsx'
    master_json_file = 'static/data/gep_master_v1.0.json'
    qmanager_file = 'static/data/qmanager_questions.json'
    
    results = {}
    
    # 1. 엑셀 파일 확인
    print("📁 1. 엑셀 파일 QCODE 체계 확인")
    print("-" * 40)
    
    if os.path.exists(excel_file):
        try:
            df = pd.read_excel(excel_file)
            excel_qcodes = df['QCODE'].dropna().tolist()
            
            results['excel'] = analyze_qcodes(excel_qcodes, "엑셀 파일")
            print(f"   ✅ 엑셀 파일 확인 완료: {len(excel_qcodes)}개 QCODE")
        except Exception as e:
            print(f"   ❌ 엑셀 파일 확인 실패: {e}")
            results['excel'] = {'status': 'error', 'message': str(e)}
    else:
        print(f"   ❌ 엑셀 파일이 존재하지 않습니다: {excel_file}")
        results['excel'] = {'status': 'not_found'}
    
    print()
    
    # 2. 마스터 JSON 파일 확인
    print("📁 2. 마스터 JSON 파일 QCODE 체계 확인")
    print("-" * 40)
    
    if os.path.exists(master_json_file):
        try:
            with open(master_json_file, 'r', encoding='utf-8') as f:
                master_data = json.load(f)
            
            master_qcodes = [q.get('QCODE', '') for q in master_data.get('questions', []) if q.get('QCODE')]
            
            results['master_json'] = analyze_qcodes(master_qcodes, "마스터 JSON 파일")
            print(f"   ✅ 마스터 JSON 파일 확인 완료: {len(master_qcodes)}개 QCODE")
        except Exception as e:
            print(f"   ❌ 마스터 JSON 파일 확인 실패: {e}")
            results['master_json'] = {'status': 'error', 'message': str(e)}
    else:
        print(f"   ❌ 마스터 JSON 파일이 존재하지 않습니다: {master_json_file}")
        results['master_json'] = {'status': 'not_found'}
    
    print()
    
    # 3. Q매니저 파일 확인
    print("📁 3. Q매니저 파일 QCODE 체계 확인")
    print("-" * 40)
    
    if os.path.exists(qmanager_file):
        try:
            with open(qmanager_file, 'r', encoding='utf-8') as f:
                qmanager_data = json.load(f)
            
            # 부모 QCODE와 자식 QCODE 모두 확인
            parent_qcodes = list(qmanager_data.get('questions', {}).keys())
            child_qcodes = []
            
            for parent_qcode, question_data in qmanager_data.get('questions', {}).items():
                slots = question_data.get('slots', {})
                for slot_name, slot_data in slots.items():
                    if slot_data.get('exists', False):
                        child_qcode = f"{parent_qcode}-{slot_name}"
                        child_qcodes.append(child_qcode)
            
            all_qmanager_qcodes = parent_qcodes + child_qcodes
            
            results['qmanager'] = analyze_qcodes(all_qmanager_qcodes, "Q매니저 파일")
            print(f"   ✅ Q매니저 파일 확인 완료: {len(parent_qcodes)}개 부모 QCODE, {len(child_qcodes)}개 자식 QCODE")
        except Exception as e:
            print(f"   ❌ Q매니저 파일 확인 실패: {e}")
            results['qmanager'] = {'status': 'error', 'message': str(e)}
    else:
        print(f"   ❌ Q매니저 파일이 존재하지 않습니다: {qmanager_file}")
        results['qmanager'] = {'status': 'not_found'}
    
    print()
    
    # 4. 파일 간 QCODE 일치성 확인
    print("📁 4. 파일 간 QCODE 일치성 확인")
    print("-" * 40)
    
    if 'excel' in results and 'master_json' in results:
        if results['excel']['status'] == 'success' and results['master_json']['status'] == 'success':
            excel_qcodes = set(results['excel']['qcodes'])
            master_qcodes = set(results['master_json']['qcodes'])
            
            match_count = len(excel_qcodes.intersection(master_qcodes))
            total_count = len(excel_qcodes.union(master_qcodes))
            
            print(f"   📊 엑셀 ↔ 마스터 JSON 일치성:")
            print(f"      일치하는 QCODE: {match_count}개")
            print(f"      총 QCODE 수: {total_count}개")
            print(f"      일치율: {(match_count/total_count*100):.1f}%")
            
            if match_count == len(excel_qcodes) and match_count == len(master_qcodes):
                print(f"   ✅ 완벽한 일치!")
            else:
                print(f"   ⚠️ 일부 불일치 발견")
                
                # 불일치 항목 확인
                excel_only = excel_qcodes - master_qcodes
                master_only = master_qcodes - excel_qcodes
                
                if excel_only:
                    print(f"      엑셀에만 있는 QCODE: {list(excel_only)[:5]}...")
                if master_only:
                    print(f"      JSON에만 있는 QCODE: {list(master_only)[:5]}...")
    
    print()
    
    # 5. 종합 결과
    print("📊 5. 종합 결과")
    print("-" * 40)
    
    compliance_summary = {
        'excel': results.get('excel', {}).get('compliance', False),
        'master_json': results.get('master_json', {}).get('compliance', False),
        'qmanager': results.get('qmanager', {}).get('compliance', False)
    }
    
    print("   📋 G048 QCODE 체계 준수 여부:")
    print(f"      엑셀 파일: {'✅ 준수' if compliance_summary['excel'] else '❌ 미준수'}")
    print(f"      마스터 JSON: {'✅ 준수' if compliance_summary['master_json'] else '❌ 미준수'}")
    print(f"      Q매니저: {'✅ 준수' if compliance_summary['qmanager'] else '❌ 미준수'}")
    
    overall_compliance = all(compliance_summary.values())
    print(f"   🎯 전체 준수 여부: {'✅ 완전 준수' if overall_compliance else '❌ 부분 미준수'}")
    
    return results

def analyze_qcodes(qcodes, file_name):
    """QCODE 목록을 분석하여 G048 체계 준수 여부 확인"""
    
    if not qcodes:
        return {'status': 'empty', 'compliance': False}
    
    # G048 체계 패턴
    master_pattern = r'^AB(\d{2})([ABC]A)-(\d{2})$'  # AB20AA-01
    child_pattern = r'^AB(\d{2})([ABC]A)-(\d{2})-B(\d)$'  # AB20AA-01-B1
    
    analysis = {
        'status': 'success',
        'total_count': len(qcodes),
        'master_count': 0,
        'child_count': 0,
        'invalid_count': 0,
        'invalid_qcodes': [],
        'eround_distribution': {},
        'layer1_distribution': {},
        'compliance': True,
        'qcodes': qcodes  # QCODE 목록 추가
    }
    

    
    for qcode in qcodes:
        # 마스터 QCODE 패턴 확인
        master_match = re.match(master_pattern, qcode)
        if master_match:
            analysis['master_count'] += 1
            eround = master_match.group(1)
            layer1 = master_match.group(2)
            
            # EROUND 분포
            analysis['eround_distribution'][eround] = analysis['eround_distribution'].get(eround, 0) + 1
            
            # LAYER1 분포
            analysis['layer1_distribution'][layer1] = analysis['layer1_distribution'].get(layer1, 0) + 1
            continue
        
        # 자식 QCODE 패턴 확인
        child_match = re.match(child_pattern, qcode)
        if child_match:
            analysis['child_count'] += 1
            continue
        
        # 유효하지 않은 QCODE
        analysis['invalid_count'] += 1
        analysis['invalid_qcodes'].append(qcode)
        analysis['compliance'] = False
    
    # 결과 출력
    print(f"   📊 {file_name} 분석 결과:")
    print(f"      총 QCODE 수: {analysis['total_count']}개")
    print(f"      마스터 QCODE: {analysis['master_count']}개")
    print(f"      자식 QCODE: {analysis['child_count']}개")
    print(f"      유효하지 않은 QCODE: {analysis['invalid_count']}개")
    
    if analysis['invalid_count'] > 0:
        print(f"      ❌ 유효하지 않은 QCODE 예시: {analysis['invalid_qcodes'][:3]}")
    
    # EROUND 분포
    if analysis['eround_distribution']:
        print(f"      📋 EROUND 분포: {dict(analysis['eround_distribution'])}")
    
    # LAYER1 분포
    if analysis['layer1_distribution']:
        print(f"      📋 LAYER1 분포: {dict(analysis['layer1_distribution'])}")
    
    # 준수 여부
    if analysis['compliance']:
        print(f"      ✅ G048 QCODE 체계 준수")
    else:
        print(f"      ❌ G048 QCODE 체계 미준수")
    
    return analysis

if __name__ == "__main__":
    print("🚀 G048 QCODE 체계 준수 여부 확인 시작")
    print("=" * 60)
    
    results = check_qcode_compliance()
    
    print("\n" + "=" * 60)
    print("🏁 확인 완료")
