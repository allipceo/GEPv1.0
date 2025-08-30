import json

# JSON 파일 읽기
with open('static/data/gep_master_v1.0.json', encoding='utf-8') as f:
    data = json.load(f)

# 기본 정보 확인
print("=== JSON 파일 데이터 확인 ===")
print(f"총 문제 수: {len(data['questions'])}개")
print(f"과목 수: {len(data['metadata']['subjects'])}개")
print(f"과목 목록: {data['metadata']['subjects']}")

# LAYER2별 문제 수 확인
layer2_counts = {}
for question in data['questions']:
    layer2 = question['LAYER2']
    layer2_counts[layer2] = layer2_counts.get(layer2, 0) + 1

print("\n=== 과목별 문제 수 ===")
for subject in sorted(layer2_counts.keys()):
    print(f"{subject}: {layer2_counts[subject]}개")

print(f"\n총합: {sum(layer2_counts.values())}개")

# 세제재무가 있는지 확인
if '세제재무' in layer2_counts:
    print("❌ 세제재무가 아직 남아있습니다!")
else:
    print("✅ 세제재무가 회계재무로 변경되었습니다!")

# 회계재무가 있는지 확인
if '회계재무' in layer2_counts:
    print(f"✅ 회계재무: {layer2_counts['회계재무']}개")
else:
    print("❌ 회계재무가 없습니다!")
