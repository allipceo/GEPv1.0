import json

# JSON 파일 읽기
with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== 개선된 QCODE 형태 확인 ===")
print(f"총 문제 수: {len(data['questions'])}개")
print()

print("=== 처음 20개 레코드의 개선된 QCODE ===")
for i, question in enumerate(data['questions'][:20], 1):
    qcode = question.get('QCODE', 'N/A')
    eround = question.get('EROUND', 'N/A')
    layer2 = question.get('LAYER2', 'N/A')
    
    # 개선된 QCODE 형태인지 확인
    if '-' in qcode and qcode.count('-') >= 2:
        status = "✅ 개선된 형태"
    else:
        status = "❌ 기존 형태"
    
    print(f"{i:2d}. QCODE: {qcode:<25} | EROUND: {eround:<10} | LAYER2: {layer2:<10} | {status}")

print()
print("=== QCODE 형태 분석 ===")
improved_count = 0
old_count = 0

for question in data['questions']:
    qcode = question.get('QCODE', '')
    if '-' in qcode and qcode.count('-') >= 2:
        improved_count += 1
    else:
        old_count += 1

print(f"개선된 형태 (ABAA-EROUND-QNUM): {improved_count}개")
print(f"기존 형태 (ABAA-QNUM): {old_count}개")
print(f"총합: {improved_count + old_count}개")

print()
print("=== 개선된 QCODE 예시들 ===")
improved_examples = []
for question in data['questions'][:50]:  # 처음 50개에서 찾기
    qcode = question.get('QCODE', '')
    if '-' in qcode and qcode.count('-') >= 2 and qcode not in improved_examples:
        improved_examples.append(qcode)
        if len(improved_examples) <= 10:  # 최대 10개만 표시
            print(f"  {qcode}")

if not improved_examples:
    print("  ❌ 개선된 형태의 QCODE가 없습니다!")
