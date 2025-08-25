필드명	설명	GEP에서의 활용
etitle	시험 제목	questions.json의 e_title 필드로 변환. 앱에서 시험 종류를 식별하고 문제 필터링에 사용.
eclass	시험 분류	questions.json의 e_class 필드로 변환. 과목별 학습 모드에서 상위 분류 역할을 수행.
eround	시험 회차	questions.json의 exam_session 필드로 변환. 기출 회차별 학습 모드에서 사용.
layer1, layer2, layer3	문제 분류	questions.json의 layer1, layer2, layer3 필드로 변환. 과목별 학습, 취약점 분석 등 고급 통계의 핵심 기반.
qnum	문제 번호	questions.json의 q_num 필드로 변환. 문제의 순서를 식별하고 QCODE 생성에 사용.
qtype	문제 유형	questions.json의 question_type 필드로 변환. 단일선택형, 진위형 문제 유형을 구분하고 UI를 동적으로 변경하는 데 사용.
question	문제 내용	questions.json의 question_text 필드로 변환. 원본 그대로 보존되어 앱 화면에 직접 표시.
answer	정답	questions.json의 correct_answer 필드로 변환. 사용자의 답안과 비교하여 정오를 판별하는 데 사용.
difficulty	난이도	questions.json의 difficulty 필드로 변환. 향후 난이도별 맞춤 학습 기능을 구현하는 데 사용.
created_date, modified_date	생성 및 수정 일시	questions.json의 동일 필드로 변환. 데이터의 이력 관리 및 버전 관리에 사용.