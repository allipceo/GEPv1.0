import pandas as pd
import json
import os
from collections import defaultdict

def analyze_qcode_duplicates():
    """QCODE 중복 문제 분석 및 해결 방안 제시"""
    
    print("🔍 QCODE 중복 문제 분석 시작...")
    
    # JSON 파일 읽기
    json_file = "static/data/gep_master_v1.0.json"
    
    if not os.path.exists(json_file):
        print(f"❌ JSON 파일을 찾을 수 없습니다: {json_file}")
        return False
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        questions = data['questions']
        
        # QCODE 분석
        qcode_count = defaultdict(list)
        qcode_duplicates = {}
        
        for i, question in enumerate(questions):
            qcode = question.get('QCODE', '')
            if qcode:
                qcode_count[qcode].append(i)
                if len(qcode_count[qcode]) > 1:
                    qcode_duplicates[qcode] = qcode_count[qcode]
        
        print(f"📊 QCODE 분석 결과:")
        print(f"  - 총 문제 수: {len(questions)}")
        print(f"  - 고유 QCODE 수: {len(qcode_count)}")
        print(f"  - 중복 QCODE 수: {len(qcode_duplicates)}")
        
        if qcode_duplicates:
            print(f"\n🚨 중복된 QCODE 발견:")
            for qcode, indices in qcode_duplicates.items():
                print(f"  {qcode}: {len(indices)}개 (인덱스: {indices})")
                
                # 중복된 문제들의 상세 정보
                for idx in indices:
                    question = questions[idx]
                    print(f"    - 인덱스 {idx}: {question.get('LAYER1', '')} | {question.get('QUESTION', '')[:50]}...")
        
        # QCODE 패턴 분석
        print(f"\n📋 QCODE 패턴 분석:")
        qcode_patterns = defaultdict(int)
        
        for qcode in qcode_count.keys():
            if '-' in qcode:
                prefix = qcode.split('-')[0]
                qcode_patterns[prefix] += 1
        
        print(f"  - QCODE 접두사별 분포:")
        for prefix, count in sorted(qcode_patterns.items()):
            print(f"    {prefix}: {count}개")
        
        return True
        
    except Exception as e:
        print(f"❌ 분석 중 오류 발생: {e}")
        return False

def generate_unique_qcodes():
    """고유한 QCODE 생성 시스템"""
    
    print("🔧 고유 QCODE 생성 시스템...")
    
    # QCODE 매핑 규칙 정의
    qcode_mapping = {
        '시험종류': {
            '보험중개사': 'A',
            '보험심사역': 'B', 
            '손해사정사': 'C'
        },
        '중분류': {
            '생명보험': 'A',
            '손해보험': 'B',
            '제3보험': 'C'
        },
        'LAYER1': {
            '관계법령': 'A',
            '손보1부': 'B',
            '손보2부': 'C'
        },
        'QTYPE': {
            '기출문제(선택형)': 'A',
            '진위형': 'B'
        }
    }
    
    # JSON 파일 읽기
    json_file = "static/data/gep_master_v1.0.json"
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        questions = data['questions']
        
        # 새로운 QCODE 생성
        new_qcodes = []
        used_qcodes = set()
        
        for i, question in enumerate(questions):
            # 기존 QCODE 분석
            old_qcode = question.get('QCODE', '')
            
            # 새로운 QCODE 생성 로직
            etitle = question.get('ETITLE', '')
            eclass = question.get('ECLASS', '')
            layer1 = question.get('LAYER1', '')
            qtype = question.get('QTYPE', '')
            
            # QCODE 구성 요소 결정
            exam_code = qcode_mapping['시험종류'].get(etitle, 'X')
            class_code = qcode_mapping['중분류'].get(eclass, 'X')
            layer_code = qcode_mapping['LAYER1'].get(layer1, 'X')
            type_code = qcode_mapping['QTYPE'].get(qtype, 'X')
            
            # QCODE 접두사 생성
            prefix = f"{exam_code}{class_code}{layer_code}{type_code}"
            
            # 고유한 번호 할당
            number = 1
            while f"{prefix}-{number:02d}" in used_qcodes:
                number += 1
            
            new_qcode = f"{prefix}-{number:02d}"
            used_qcodes.add(new_qcode)
            
            new_qcodes.append({
                'index': i,
                'old_qcode': old_qcode,
                'new_qcode': new_qcode,
                'etitle': etitle,
                'eclass': eclass,
                'layer1': layer1,
                'qtype': qtype
            })
        
        # 결과 출력
        print(f"✅ 고유 QCODE 생성 완료!")
        print(f"  - 총 문제 수: {len(questions)}")
        print(f"  - 고유 QCODE 수: {len(used_qcodes)}")
        
        # 샘플 결과
        print(f"\n📋 QCODE 변환 샘플 (처음 10개):")
        for i, item in enumerate(new_qcodes[:10]):
            print(f"  {i+1:2d}. {item['old_qcode']} → {item['new_qcode']} ({item['layer1']})")
        
        return new_qcodes
        
    except Exception as e:
        print(f"❌ QCODE 생성 중 오류 발생: {e}")
        return None

def create_qcode_mapping_guide():
    """QCODE 매핑 가이드 생성"""
    
    print("📝 QCODE 매핑 가이드 생성...")
    
    guide = {
        "QCODE_구성_규칙": {
            "형식": "ABCD-XX",
            "A": "시험종류 (A:보험중개사, B:보험심사역, C:손해사정사)",
            "B": "중분류 (A:생명보험, B:손해보험, C:제3보험)",
            "C": "LAYER1 (A:관계법령, B:손보1부, C:손보2부)",
            "D": "QTYPE (A:기출문제, B:진위형)",
            "XX": "순차번호 (01, 02, 03...)"
        },
        "예시": {
            "ABAA-01": "보험중개사-손해보험-관계법령-기출문제-01번",
            "ABAB-01": "보험중개사-손해보험-관계법령-진위형-01번",
            "ABBA-01": "보험중개사-손해보험-손보1부-기출문제-01번"
        },
        "매핑_테이블": {
            "시험종류": {
                "보험중개사": "A",
                "보험심사역": "B",
                "손해사정사": "C"
            },
            "중분류": {
                "생명보험": "A",
                "손해보험": "B",
                "제3보험": "C"
            },
            "LAYER1": {
                "관계법령": "A",
                "손보1부": "B",
                "손보2부": "C"
            },
            "QTYPE": {
                "A": "A",  # 기출문제(선택형)
                "B": "B"   # 진위형
            }
        }
    }
    
    # 가이드 파일 저장
    guide_file = "docs/QCODE_MAPPING_GUIDE.md"
    
    try:
        with open(guide_file, 'w', encoding='utf-8') as f:
            f.write("# QCODE 매핑 가이드\n\n")
            f.write("## 구성 규칙\n\n")
            f.write("QCODE는 `ABCD-XX` 형식으로 구성됩니다:\n\n")
            f.write("- **A**: 시험종류\n")
            f.write("- **B**: 중분류\n")
            f.write("- **C**: LAYER1\n")
            f.write("- **D**: QTYPE\n")
            f.write("- **XX**: 순차번호 (01, 02, 03...)\n\n")
            
            f.write("## 매핑 테이블\n\n")
            f.write("### 시험종류\n")
            for name, code in guide["매핑_테이블"]["시험종류"].items():
                f.write(f"- {name}: {code}\n")
            
            f.write("\n### 중분류\n")
            for name, code in guide["매핑_테이블"]["중분류"].items():
                f.write(f"- {name}: {code}\n")
            
            f.write("\n### LAYER1\n")
            for name, code in guide["매핑_테이블"]["LAYER1"].items():
                f.write(f"- {name}: {code}\n")
            
            f.write("\n### QTYPE\n")
            for name, code in guide["매핑_테이블"]["QTYPE"].items():
                f.write(f"- {name}: {code}\n")
            
            f.write("\n## 예시\n\n")
            for qcode, description in guide["예시"].items():
                f.write(f"- **{qcode}**: {description}\n")
        
        print(f"✅ QCODE 매핑 가이드 생성 완료: {guide_file}")
        return True
        
    except Exception as e:
        print(f"❌ 가이드 생성 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    print("🚀 QCODE 중복 문제 해결 도구")
    print("=" * 60)
    
    # 1. 현재 QCODE 중복 분석
    print("1️⃣ QCODE 중복 분석")
    analyze_qcode_duplicates()
    
    print("\n" + "=" * 60)
    
    # 2. 고유 QCODE 생성
    print("2️⃣ 고유 QCODE 생성")
    new_qcodes = generate_unique_qcodes()
    
    print("\n" + "=" * 60)
    
    # 3. QCODE 매핑 가이드 생성
    print("3️⃣ QCODE 매핑 가이드 생성")
    create_qcode_mapping_guide()
    
    print("\n" + "=" * 60)
    print("🎉 QCODE 중복 문제 해결 완료!")
    
    if new_qcodes:
        print(f"\n📋 다음 단계:")
        print(f"1. 새로운 QCODE로 JSON 파일 업데이트")
        print(f"2. 엑셀 파일의 QCODE 컬럼 수정")
        print(f"3. QCODE 매핑 가이드 문서화")
