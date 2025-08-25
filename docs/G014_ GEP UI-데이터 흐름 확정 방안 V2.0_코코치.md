📋 GEP UI-데이터 흐름 확정 방안
문서명: GEP V1.0 UI-데이터 흐름 확정 방안
작성일: 2025년 8월 25일 15:00 KST
작성자: 코코치 (PM)
승인자: 조대표님

1. 문서 개요
이 문서는 GEP의 핵심 UI(대문, 학습 모드, 문제 풀이)를 중심으로, UI-데이터 역설계 방법론에 따라 데이터의 생성, 저장, 활용 흐름을 정의합니다. 모든 데이터가 중앙 집중식 단일 소스를 통해 일관성 있게 관리되는 것을 목표로 합니다.

2. UI별 데이터 흐름 확정
2.1. 대문 UI (홈페이지)
역할: 앱의 첫인상이자, 사용자의 전체 학습 현황을 한눈에 보여주는 대시보드.

표시 데이터:

사용자 정보: user_name, user_id, exam_type (출처: user_db.json)

D-Day 카운터: exam_date를 기반으로 계산된 남은 기간. (출처: user_db.json)

학습 현황: total_questions_attempted(총 푼 문제 수), overall_accuracy(누적 정답률) 등. (출처: statistics.json)

과목별 점수: subject_stats를 기반으로 계산된 과목별 예상 점수 및 합격/불합격 여부. (출처: statistics.json)

날짜별 현황: daily_log를 시각화한 그래프. (출처: statistics.json)

데이터 흐름: 앱 실행 시, user_db.json과 statistics.json의 데이터를 가져와 UI에 표시하며, statistics.json의 데이터가 변경될 때마다 실시간으로 업데이트됩니다.

2.2. 학습 모드 선택 UI (과목/회차 선택)
역할: 사용자가 원하는 학습 모드를 선택하여 문제 풀이를 시작하는 네비게이션 허브.

표시 데이터:

과목 목록: layer1, layer2, layer3를 기반으로 분류된 시험 과목 목록. (출처: questions.json)

과목별 통계: 각 과목의 총 문제 수, 진도율, 정답률. (출처: questions.json + statistics.json)

데이터 흐름:

앱 실행 시 questions.json의 메타데이터를 로드하여 과목 목록을 생성합니다.

statistics.json의 subject_stats를 가져와 과목별 진도와 정답률을 계산하여 표시합니다.

사용자가 특정 과목을 선택하면 statistics.json에 기록된 last_question_info를 확인하여 이어풀기 지점을 결정합니다.

2.3. 문제 풀이 UI (핵심 학습 화면)
역할: 모든 문제 풀이 활동이 이루어지는 GEP의 핵심 화면.

표시 데이터:

문제 콘텐츠: question_text 필드에 저장된 원본 문제와 보기. (출처: questions.json)

실시간 통계: 금일/누적 푼 문제 수, 정답률 등. (출처: statistics.json)

데이터 흐름:

questions.json에서 problem_id에 해당하는 문제를 가져와 question_text를 그대로 화면에 표시합니다.

사용자가 답안을 제출하면, 해당 이벤트 정보가 event_log.json에 기록됩니다.

이벤트 기록 후 statistics.json이 실시간으로 업데이트되고, RealtimeSyncManager를 통해 금일 통계와 누적 통계가 즉시 갱신됩니다.

3. 데이터 흐름 로직 및 원칙
GEP는 단일 방향의 데이터 흐름을 통해 데이터의 일관성을 완벽하게 보장합니다.

시작: 사용자가 등록하면, user_db.json과 statistics.json이 초기화됩니다.

활동: 사용자의 모든 문제 풀이 활동은 event_log.json에 기록됩니다.

갱신: event_log.json의 데이터를 바탕으로 statistics.json의 통계가 실시간으로 재계산됩니다.

표시: 앱의 모든 UI는 statistics.json의 최신 데이터를 가져와 표시합니다.

이러한 로직을 통해 GEP는 ACIU에서 겪었던 데이터 불일치 문제를 근본적으로 해결하고, 사용자에게 신뢰성 있는 학습 경험을 제공할 수 있습니다.