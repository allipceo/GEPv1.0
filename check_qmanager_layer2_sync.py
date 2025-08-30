import json
import pandas as pd
import os

def check_qmanager_layer2_sync():
    """Q매니저의 부모 문제 메타데이터와 문제제이슨 파일의 LAYER2 정보 비교"""
    
    print("=== Q매니저 LAYER2 동기화 필요성 확인 ===")
    
    # 파일 경로
    qmanager_file = 'static/data/qmanager_questions.json'
    master_json_file = 'static/data/gep_master_v1.0.json'
    
    # 파일 존재 확인
    if not os.path.exists(qmanager_file):
        print(f"❌ Q매니저 파일이 존재하지 않습니다: {qmanager_file}")
        return False
    
    if not os.path.exists(master_json_file):
        print(f"❌ 마스터 JSON 파일이 존재하지 않습니다: {master_json_file}")
        return False
    
    try:
        # 1. Q매니저 파일 읽기
        print(f"📁 Q매니저 파일 읽기: {qmanager_file}")
        with open(qmanager_file, 'r', encoding='utf-8') as f:
            qmanager_data = json.load(f)
        
        questions = qmanager_data.get('questions', {})
        print(f"   📊 Q매니저 부모 문제 수: {len(questions)}개")
        
        # 2. 마스터 JSON 파일 읽기
        print(f"📁 마스터 JSON 파일 읽기: {master_json_file}")
        with open(master_json_file, 'r', encoding='utf-8') as f:
            master_data = json.load(f)
        
        master_questions = master_data.get('questions', [])
        print(f"   📊 마스터 JSON 문제 수: {len(master_questions)}개")
        
        # 3. 마스터 JSON을 QCODE 기준으로 딕셔너리로 변환
        master_dict = {}
        for question in master_questions:
            qcode = question.get('QCODE', '')
            if qcode:
                master_dict[qcode] = question
        
        print(f"   📊 마스터 JSON 딕셔너리 크기: {len(master_dict)}개")
        
        # 4. Q매니저 부모 문제들의 메타데이터 분석
        print(f"\n📋 Q매니저 부모 문제 메타데이터 분석:")
        
        parent_qcodes = list(questions.keys())
        print(f"   📊 부모 QCODE 목록: {parent_qcodes}")
        
        # 5. 각 부모 문제의 메타데이터와 마스터 JSON의 LAYER2 비교
        print(f"\n🔄 부모 문제 메타데이터 vs 마스터 JSON LAYER2 비교:")
        
        sync_needed = False
        comparison_results = []
        
        for parent_qcode in parent_qcodes:
            qmanager_question = questions[parent_qcode]
            master_question = master_dict.get(parent_qcode)
            
            if not master_question:
                print(f"   ⚠️ 부모 QCODE '{parent_qcode}'가 마스터 JSON에 없습니다.")
                continue
            
            # Q매니저 메타데이터에서 master_layer 확인
            metadata = qmanager_question.get('metadata', {})
            qmanager_master_layer = metadata.get('master_layer', '')
            
            # 마스터 JSON에서 LAYER2 확인
            master_layer2 = master_question.get('LAYER2', '')
            
            comparison_results.append({
                'qcode': parent_qcode,
                'qmanager_master_layer': qmanager_master_layer,
                'master_layer2': master_layer2,
                'needs_sync': qmanager_master_layer != master_layer2
            })
            
            if qmanager_master_layer != master_layer2:
                sync_needed = True
                print(f"   ❌ 불일치: {parent_qcode}")
                print(f"      Q매니저 master_layer: '{qmanager_master_layer}'")
                print(f"      마스터 JSON LAYER2: '{master_layer2}'")
            else:
                print(f"   ✅ 일치: {parent_qcode} - '{master_layer2}'")
        
        # 6. 결과 요약
        print(f"\n📊 비교 결과 요약:")
        
        total_count = len(comparison_results)
        match_count = sum(1 for result in comparison_results if not result['needs_sync'])
        mismatch_count = sum(1 for result in comparison_results if result['needs_sync'])
        
        print(f"   📊 총 부모 문제 수: {total_count}개")
        print(f"   ✅ 일치: {match_count}개")
        print(f"   ❌ 불일치: {mismatch_count}개")
        
        if sync_needed:
            print(f"\n⚠️ 동기화가 필요합니다!")
            print(f"   - Q매니저의 master_layer 정보를 마스터 JSON의 LAYER2 정보로 업데이트해야 합니다.")
        else:
            print(f"\n✅ 동기화가 필요하지 않습니다!")
            print(f"   - 모든 부모 문제의 메타데이터가 마스터 JSON의 LAYER2 정보와 일치합니다.")
        
        # 7. 상세 분석
        print(f"\n📋 상세 분석:")
        
        # master_layer 값별 분포
        master_layer_counts = {}
        layer2_counts = {}
        
        for result in comparison_results:
            master_layer = result['qmanager_master_layer']
            layer2 = result['master_layer2']
            
            master_layer_counts[master_layer] = master_layer_counts.get(master_layer, 0) + 1
            layer2_counts[layer2] = layer2_counts.get(layer2, 0) + 1
        
        print(f"   📊 Q매니저 master_layer 분포:")
        for layer, count in master_layer_counts.items():
            print(f"      '{layer}': {count}개")
        
        print(f"   📊 마스터 JSON LAYER2 분포:")
        for layer2, count in layer2_counts.items():
            print(f"      '{layer2}': {count}개")
        
        return sync_needed
        
    except Exception as e:
        print(f"❌ 분석 중 오류 발생: {e}")
        return False

def sync_qmanager_layer2():
    """Q매니저의 master_layer 정보를 마스터 JSON의 LAYER2 정보로 동기화"""
    
    print(f"\n=== Q매니저 master_layer → 마스터 JSON LAYER2 동기화 ===")
    
    # 파일 경로
    qmanager_file = 'static/data/qmanager_questions.json'
    master_json_file = 'static/data/gep_master_v1.0.json'
    backup_file = 'static/data/qmanager_questions_backup.json'
    
    try:
        # 1. 백업 생성
        print(f"💾 백업 생성: {backup_file}")
        with open(qmanager_file, 'r', encoding='utf-8') as f:
            qmanager_data = json.load(f)
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(qmanager_data, f, ensure_ascii=False, indent=2)
        
        # 2. 마스터 JSON 읽기
        with open(master_json_file, 'r', encoding='utf-8') as f:
            master_data = json.load(f)
        
        master_questions = master_data.get('questions', [])
        master_dict = {}
        for question in master_questions:
            qcode = question.get('QCODE', '')
            if qcode:
                master_dict[qcode] = question
        
        # 3. Q매니저 업데이트
        questions = qmanager_data.get('questions', {})
        updated_count = 0
        
        for parent_qcode, qmanager_question in questions.items():
            master_question = master_dict.get(parent_qcode)
            
            if not master_question:
                print(f"   ⚠️ 부모 QCODE '{parent_qcode}'가 마스터 JSON에 없습니다.")
                continue
            
            # 메타데이터 확인
            if 'metadata' not in qmanager_question:
                qmanager_question['metadata'] = {}
            
            metadata = qmanager_question['metadata']
            old_master_layer = metadata.get('master_layer', '')
            new_layer2 = master_question.get('LAYER2', '')
            
            if old_master_layer != new_layer2:
                metadata['master_layer'] = new_layer2
                updated_count += 1
                print(f"   ✅ 업데이트: {parent_qcode} - '{old_master_layer}' → '{new_layer2}'")
        
        # 4. 업데이트된 Q매니저 저장
        print(f"💾 업데이트된 Q매니저 파일 저장: {qmanager_file}")
        with open(qmanager_file, 'w', encoding='utf-8') as f:
            json.dump(qmanager_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n📊 동기화 결과:")
        print(f"   ✅ 업데이트된 문제: {updated_count}개")
        print(f"   📁 백업 파일: {backup_file}")
        print(f"   📁 업데이트된 파일: {qmanager_file}")
        
        return True
        
    except Exception as e:
        print(f"❌ 동기화 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Q매니저 LAYER2 동기화 필요성 확인 시작")
    print("=" * 60)
    
    # 동기화 필요성 확인
    sync_needed = check_qmanager_layer2_sync()
    
    if sync_needed:
        print("\n" + "=" * 60)
        # 동기화 실행
        sync_qmanager_layer2()
    else:
        print("\n✅ 동기화가 필요하지 않습니다.")
    
    print("\n" + "=" * 60)
    print("🏁 작업 완료")
