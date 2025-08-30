import json

# JSON 파일 읽기
with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== JSON 파일 QCODE 형상 확인 ===")
print(f"총 문제 수: {len(data['questions'])}개")
print()

print("=== 처음 20개 레코드의 QCODE ===")
for i, question in enumerate(data['questions'][:20], 1):
    qcode = question.get('QCODE', 'N/A')
    layer2 = question.get('LAYER2', 'N/A')
    qtype = question.get('QTYPE', 'N/A')
    print(f"{i:2d}. QCODE: {qcode:<20} | LAYER2: {layer2:<10} | QTYPE: {qtype}")

print()
print("=== QCODE 패턴 분석 ===")
qcode_patterns = {}
for question in data['questions'][:20]:
    qcode = question.get('QCODE', '')
    if qcode:
        # QCODE의 패턴 분석
        if '_' in qcode:
            parts = qcode.split('_')
            pattern = f"{len(parts)}개_파트"
        else:
            pattern = "단일_값"
        qcode_patterns[pattern] = qcode_patterns.get(pattern, 0) + 1

for pattern, count in qcode_patterns.items():
    print(f"패턴: {pattern} - {count}개")

print()
print("=== QCODE 예시들 ===")
unique_qcodes = set()
for question in data['questions'][:20]:
    qcode = question.get('QCODE', '')
    if qcode and qcode not in unique_qcodes:
        unique_qcodes.add(qcode)
        print(f"  {qcode}")
