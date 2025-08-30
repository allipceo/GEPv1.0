import json
from collections import Counter

# JSON 파일 읽기
with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== QCODE 중복 확인 ===")
print(f"총 문제 수: {len(data['questions'])}개")
print()

# 모든 QCODE 수집
all_qcodes = []
for question in data['questions']:
    qcode = question.get('QCODE', '')
    if qcode:
        all_qcodes.append(qcode)

print(f"QCODE가 있는 문제 수: {len(all_qcodes)}개")
print(f"고유한 QCODE 수: {len(set(all_qcodes))}개")

# 중복 확인
qcode_counter = Counter(all_qcodes)
duplicates = {qcode: count for qcode, count in qcode_counter.items() if count > 1}

print()
if duplicates:
    print("❌ QCODE 중복 발견!")
    print(f"중복된 QCODE 수: {len(duplicates)}개")
    print()
    print("=== 중복된 QCODE 목록 ===")
    for qcode, count in sorted(duplicates.items()):
        print(f"  {qcode}: {count}회 중복")
    
    # 중복된 QCODE를 가진 문제들 찾기
    print()
    print("=== 중복된 QCODE를 가진 문제들 ===")
    for qcode in sorted(duplicates.keys()):
        print(f"\nQCODE: {qcode} (중복 {duplicates[qcode]}회)")
        duplicate_questions = []
        for i, question in enumerate(data['questions']):
            if question.get('QCODE', '') == qcode:
                duplicate_questions.append({
                    'index': i + 1,
                    'layer2': question.get('LAYER2', 'N/A'),
                    'eround': question.get('EROUND', 'N/A'),
                    'etitle': question.get('ETITLE', 'N/A')[:30] + '...' if len(question.get('ETITLE', '')) > 30 else question.get('ETITLE', 'N/A')
                })
        
        for q in duplicate_questions:
            print(f"    - 문제 {q['index']}: {q['layer2']} | {q['eround']} | {q['etitle']}")
    
else:
    print("✅ QCODE 중복 없음! 모든 QCODE가 고유합니다.")
    print(f"중복률: 0%")

print()
print("=== QCODE 패턴별 분포 ===")
pattern_counter = Counter()
for qcode in all_qcodes:
    if '-' in qcode:
        pattern = qcode.split('-')[0]  # AB20AA 부분만 추출
        pattern_counter[pattern] += 1

for pattern, count in sorted(pattern_counter.items()):
    print(f"  {pattern}: {count}개")

print()
print("=== 통계 요약 ===")
print(f"총 문제 수: {len(data['questions'])}개")
print(f"QCODE 있는 문제: {len(all_qcodes)}개")
print(f"고유 QCODE: {len(set(all_qcodes))}개")
print(f"중복 QCODE: {len(duplicates)}개")
if all_qcodes:
    print(f"중복률: {len(duplicates) / len(set(all_qcodes)) * 100:.2f}%")
