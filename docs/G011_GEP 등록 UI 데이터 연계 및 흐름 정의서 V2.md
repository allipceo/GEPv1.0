📋 GEP 등록 UI 데이터 연계 및 흐름 정의서 V2.0
문서명: GEP V1.0 등록 UI 데이터 연계 및 흐름 정의서
작성일: 2025년 8월 25일 15:00 KST
작성자: 코코치 (PM)
승인자: 조대표님

1. 문서 개요
이 문서는 GEP의 초기 등록 UI에서 생성되는 데이터의 종류와, 해당 데이터가 어떤 데이터베이스에 언제 어떻게 저장되고 활용되는지 정의합니다. UI-데이터 역설계 방법론에 따라, 사용자 경험에 필요한 데이터를 중심으로 데이터 구조를 확정하는 데 목적이 있습니다.

2. UI 입력 데이터 및 생성 시점
사용자가 등록 폼에 데이터를 입력하고 등록 완료 버튼을 클릭하는 순간, 아래의 데이터가 생성됩니다.

데이터 항목

생성 주체

설명

user_id

사용자 입력

휴대폰 번호 (01012345678 형식)가 사용자의 고유 ID가 됩니다.

user_name

시스템

게스트 등록 시 null로, 유료 등록 시 이름을 저장합니다.

service_level

UI 선택

사용자가 선택한 서비스 레벨 (free, premium, pro)입니다.

exam_type

사용자 입력

사용자가 드롭다운 메뉴에서 선택한 시험 종류입니다.

exam_date

사용자 입력

사용자가 달력에서 선택한 목표 시험일입니다. (선택 사항)

registration_date

시스템

등록 버튼을 클릭한 시점의 정확한 타임스탬프입니다.

d_day

시스템

registration_date와 exam_date를 기반으로 자동 계산됩니다.

user_type

시스템

사용자의 유형 (guest 또는 registered)입니다.

3. 데이터베이스 저장 및 활용
생성된 데이터는 4개의 핵심 데이터베이스에 저장되고 활용됩니다.

3.1. 사용자 데이터베이스 (user_db.json)
저장 데이터: user_id, user_name, user_type, subscription_level, exam_type, exam_date, registration_date.

저장 시점: 사용자가 등록 버튼을 클릭하는 순간.

활용: 사용자의 로그인 인증, 서비스 레벨별 기능 접근 제어, D-Day 카운터 계산 등에 사용됩니다.

3.2. 문제 풀이 이벤트 DB (event_log.json)
저장 데이터: event_id, user_id, timestamp, event_type(service_selection, registration_completion 등), event_data 등.

저장 시점: 사용자가 등록 후 첫 문제 풀이 활동을 시작하는 순간부터 기록됩니다. 또한, 등록 과정에서의 서비스 선택, 폼 입력 등의 이벤트도 기록되어 사용자 행동 분석에 활용됩니다.

활용: 사용자의 학습 활동을 기록하는 원천 데이터로, 통계 데이터 생성의 기초가 됩니다.

3.3. 통계 데이터베이스 (statistics.json)
저장 데이터: user_id, registration_date, overall_stats(초기값 0), subject_stats(초기값 0) 등.

저장 시점: user_db.json에 사용자 정보가 저장되는 순간 초기화됩니다.

활용: event_log.json을 기반으로 실시간 업데이트되며, 모든 화면의 통계 정보(정답률, 진도율)를 표시하는 데 사용됩니다.

4. 데이터 흐름 요약
사용자 입력: 등록 UI에서 휴대폰 번호, 시험 종류, 시험일을 입력하고, 서비스를 선택합니다.

이벤트 기록: 각 UI 클릭과 입력 활동은 event_log.json에 상세하게 기록됩니다.

데이터 저장: 최종 제출 시 user_db.json에 사용자 정보가 저장됩니다.

통계 초기화: user_db.json의 user_id와 registration_date를 기반으로 statistics.json의 통계 데이터가 0으로 초기화됩니다.

학습 시작: 사용자가 문제 풀이를 시작하면, event_log.json에 이벤트가 기록되고 statistics.json의 통계 데이터가 실시간으로 업데이트됩니다.