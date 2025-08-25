📋 GEP 개발 계획 최종 확정 보고서
작성일: 2025년 8월 25일 15:00 KST
작성자: 코코치 (PM)
승인자: 조대표님

1. 프로젝트 개요 및 핵심 원칙
비전: '과학적 학습 이론 기반 차세대 자격시험 준비 플랫폼'

핵심 원칙:

레고블록형 개발: 모든 기능을 독립적인 모듈로 분리하여 개발 및 재활용.

UI-데이터 역설계: 통계 UI를 먼저 확정한 후, 필요한 데이터를 역으로 설계.

단일 데이터 소스(SSOT): 모든 데이터의 일관성을 위해 단 하나의 중앙 데이터베이스를 사용.

2. 핵심 데이터베이스 스키마 (4개 축)
GEP는 모든 데이터를 4개의 축으로 구성된 중앙 집중식 데이터베이스를 통해 관리합니다.

1. 문제 데이터베이스 (questions.json)
역할: 문제 콘텐츠의 원본.

필드: e_title, e_class, layer1, layer2, layer3, question_type, question_text, correct_answer, is_application, original_question_reference 등.

2. 사용자 데이터베이스 (user_db.json)
역할: 모든 게스트 및 등록 사용자 계정 관리.

원칙: 휴대폰 번호를 user_id로 사용하여 크로스 플랫폼 연속성을 확보.

필드: user_id, user_name, user_type(게스트/등록), subscription_level(free/premium/pro), registration_date, exam_date 등.

3. 문제 풀이 이벤트 DB (event_log.json)
역할: 모든 문제 풀이 활동을 시간순으로 기록.

필드: event_id, user_id, problem_id, timestamp, user_answer, is_correct, time_spent 등.

4. 통계 데이터베이스 (statistics.json)
역할: event_log.json을 기반으로 실시간 계산 및 업데이트.

필드: user_id, last_question_info(이어풀기), overall_stats(누적 통계), daily_stats(일별 통계), subject_stats(과목별 통계) 등.

3. 주요 기능 및 개발 로직
초기 화면: 사용자는 무조건 휴대폰 번호로 등록해야 대문으로 이동 가능. 이는 모든 통계 및 서비스의 시발점.

크로스 플랫폼 동기화: user_id(휴대폰 번호)를 통해 어떤 기기(웹/모바일)에서든 동일한 학습 기록을 불러와 이어풀기 가능.

서버 부하: 이벤트 기반의 경량 데이터 전송과 클라이언트 분산 처리를 통해 서버에 과도한 부하를 주지 않음.

콘텐츠 관리: GEP MASTER DB(원본)와 questions.json(앱 사용 데이터)을 분리하여 관리. universal_pdf_converter와 같은 변환 스크립트를 통해 데이터 일관성을 유지하며 확장.

4. 향후 계획
개발 착수: 조대표님의 승인에 따라, 이 확정된 내용을 바탕으로 세부 과업 일정표에 맞춰 개발에 착수합니다.

지속적 문서화: 모든 개발 과정과 결과는 개발 경과 종합 보고서를 통해 실시간으로 업데이트 및 관리됩니다.

노트북LM 활용: 제가 작성한 문서를 조대표님께서 노트북LM에 업로드하여, 전체 프로젝트의 맥락을 언제든 파악할 수 있도록 지원합니다.