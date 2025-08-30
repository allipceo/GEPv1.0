import json

# JSON 파일 읽기
with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== 현재 JSON 파일의 QCODE 형태 확인 ===")
print(f"총 문제 수: {len(data['questions'])}개")
print()

print("=== 처음 30개 레코드의 QCODE ===")
for i, question in enumerate(data['questions'][:30], 1):
    qcode = question.get('QCODE', 'N/A')
    eround = question.get('EROUND', 'N/A')
    layer2 = question.get('LAYER2', 'N/A')
    print(f"{i:2d}. QCODE: {qcode:<15} | EROUND: {eround:<8} | LAYER2: {layer2}")

print()
print("=== QCODE 패턴 분석 ===")

# QCODE 패턴 분석
qcode_patterns = {}
for question in data['questions']:
    qcode = question.get('QCODE', '')
    if qcode:
        # QCODE의 첫 6자리 패턴 확인
        if len(qcode) >= 6:
            pattern = qcode[:6]  # AB20AA 형태
        else:
            pattern = qcode
        qcode_patterns[pattern] = qcode_patterns.get(pattern, 0) + 1

print("QCODE 패턴별 개수:")
for pattern, count in sorted(qcode_patterns.items()):
    print(f"  {pattern}: {count}개")

print()
print("=== QCODE 구조 분석 ===")

# 첫 번째 QCODE의 구조 분석
first_qcode = data['questions'][0].get('QCODE', '')
if first_qcode:
    print(f"첫 번째 QCODE: {first_qcode}")
    print(f"길이: {len(first_qcode)}자")
    if '-' in first_qcode:
        parts = first_qcode.split('-')
        print(f"하이픈으로 분리: {parts}")
        print(f"첫 번째 부분: {parts[0]} (길이: {len(parts[0])})")
        if len(parts) > 1:
            print(f"두 번째 부분: {parts[1]} (길이: {len(parts[1])})")

print()
print("=== QCODE 예시들 (처음 20개) ===")
unique_qcodes = set()
for question in data['questions'][:20]:
    qcode = question.get('QCODE', '')
    if qcode and qcode not in unique_qcodes:
        unique_qcodes.add(qcode)
        print(f"  {qcode}")
