-- Test Data for Academy Management System
-- 학원 관리 시스템 테스트 데이터

-- 기존 데이터 삭제 (테스트용)
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.attendance CASCADE;
TRUNCATE TABLE public.students CASCADE;
TRUNCATE TABLE public.expenses CASCADE;
TRUNCATE TABLE public.schedules CASCADE;
TRUNCATE TABLE public.education_records CASCADE;

-- 1. Students 테스트 데이터 (정상 학생 8명, 중지 1명, 퇴원 1명)
INSERT INTO public.students (name, birth_date, school, special_notes, mon, tue, wed, thu, fri, parent_contact, student_contact, status, sessions_per_week, created_at) VALUES
('김민준', '2015-03-15', '서울초등학교', '알레르기 있음 (땅콩)', true, false, true, false, false, '010-1234-5678', '010-9876-5432', 'ACTIVE', 2, CURRENT_TIMESTAMP),
('이서연', '2016-07-22', '강남초등학교', NULL, true, false, true, false, true, '010-2345-6789', NULL, 'ACTIVE', 2, CURRENT_TIMESTAMP),
('박지훈', '2015-11-08', '서울초등학교', '조용한 성격', false, true, false, true, false, '010-3456-7890', '010-8765-4321', 'ACTIVE', 2, CURRENT_TIMESTAMP),
('최수아', '2016-01-30', '명덕초등학교', NULL, true, true, false, false, false, '010-4567-8901', NULL, 'ACTIVE', 2, CURRENT_TIMESTAMP),
('정민서', '2015-09-12', '강남초등학교', '집중력 우수', false, false, true, true, false, '010-5678-9012', '010-7654-3210', 'ACTIVE', 2, CURRENT_TIMESTAMP),
('강예준', '2016-04-25', '서울초등학교', NULL, true, false, false, false, true, '010-6789-0123', NULL, 'ACTIVE', 2, CURRENT_TIMESTAMP),
('윤서현', '2015-12-03', '명덕초등학교', NULL, false, true, false, true, true, '010-7890-1234', '010-6543-2109', 'ACTIVE', 2, CURRENT_TIMESTAMP),
('임지우', '2016-06-18', '강남초등학교', '활발한 성격', true, false, true, false, false, '010-8901-2345', NULL, 'ACTIVE', 1, CURRENT_TIMESTAMP),
('한유진', '2015-08-27', '서울초등학교', '휴학 중', false, false, false, false, false, '010-9012-3456', NULL, 'SUSPENDED', 1, CURRENT_TIMESTAMP),
('송하은', '2016-02-14', '명덕초등학교', '전학으로 인한 퇴원', false, false, false, false, false, '010-0123-4567', NULL, 'WITHDRAWN', 1, CURRENT_TIMESTAMP);

-- 2. Attendance 테스트 데이터 (최근 2주간)
-- 2025-11-13 (수요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(1, '2025-11-13', true, '도형 학습 완료', NULL, CURRENT_TIMESTAMP),
(2, '2025-11-13', true, '곱셈 구구단 3단까지', NULL, CURRENT_TIMESTAMP),
(5, '2025-11-13', false, NULL, '감기로 결석', CURRENT_TIMESTAMP),
(8, '2025-11-13', true, '받아쓰기 연습', NULL, CURRENT_TIMESTAMP);

-- 2025-11-14 (목요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(3, '2025-11-14', true, '분수 개념 학습', NULL, CURRENT_TIMESTAMP),
(5, '2025-11-14', true, '감기 회복', NULL, CURRENT_TIMESTAMP),
(7, '2025-11-14', true, '독해 문제 풀이', NULL, CURRENT_TIMESTAMP);

-- 2025-11-15 (금요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(2, '2025-11-15', true, '곱셈 구구단 완료', NULL, CURRENT_TIMESTAMP),
(6, '2025-11-15', true, '영어 알파벳 연습', NULL, CURRENT_TIMESTAMP),
(7, '2025-11-15', false, NULL, '외출로 인한 결석', CURRENT_TIMESTAMP);

-- 2025-11-18 (월요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(1, '2025-11-18', true, '시계 보기 학습', NULL, CURRENT_TIMESTAMP),
(2, '2025-11-18', true, '나눗셈 기본 개념', NULL, CURRENT_TIMESTAMP),
(4, '2025-11-18', true, '받아내림 뺄셈', NULL, CURRENT_TIMESTAMP),
(6, '2025-11-18', true, '한글 받아쓰기', NULL, CURRENT_TIMESTAMP),
(8, '2025-11-18', true, '그림일기 작성', NULL, CURRENT_TIMESTAMP);

-- 2025-11-19 (화요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(3, '2025-11-19', true, '소수 개념 도입', NULL, CURRENT_TIMESTAMP),
(4, '2025-11-19', true, '곱셈 2단계', NULL, CURRENT_TIMESTAMP),
(7, '2025-11-19', true, '독서록 작성', NULL, CURRENT_TIMESTAMP);

-- 2025-11-20 (수요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(1, '2025-11-20', true, '도형의 넓이', NULL, CURRENT_TIMESTAMP),
(2, '2025-11-20', true, '나눗셈 연습', NULL, CURRENT_TIMESTAMP),
(5, '2025-11-20', true, '영어 단어 암기', NULL, CURRENT_TIMESTAMP),
(8, '2025-11-20', true, '국어 문법', NULL, CURRENT_TIMESTAMP);

-- 2025-11-21 (목요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(3, '2025-11-21', true, '분수의 덧셈', NULL, CURRENT_TIMESTAMP),
(5, '2025-11-21', true, '과학 실험 복습', NULL, CURRENT_TIMESTAMP),
(7, '2025-11-21', true, '수학 문제집 풀이', NULL, CURRENT_TIMESTAMP);

-- 2025-11-22 (금요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(2, '2025-11-22', true, '복습 테스트', NULL, CURRENT_TIMESTAMP),
(6, '2025-11-22', true, '영어회화 연습', NULL, CURRENT_TIMESTAMP),
(7, '2025-11-22', true, '주간 정리', NULL, CURRENT_TIMESTAMP);

-- 2025-11-25 (월요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(1, '2025-11-25', true, '각도기 사용법', NULL, CURRENT_TIMESTAMP),
(2, '2025-11-25', true, '혼합계산', NULL, CURRENT_TIMESTAMP),
(4, '2025-11-25', true, '단위 환산', NULL, CURRENT_TIMESTAMP),
(6, '2025-11-25', true, '한자 학습', NULL, CURRENT_TIMESTAMP),
(8, '2025-11-25', false, NULL, '가족 행사', CURRENT_TIMESTAMP);

-- 2025-11-26 (화요일)
INSERT INTO public.attendance (student_id, attendance_date, is_present, progress_memo, absence_reason, created_at) VALUES
(3, '2025-11-26', true, '방정식 기초', NULL, CURRENT_TIMESTAMP),
(4, '2025-11-26', true, '약수와 배수', NULL, CURRENT_TIMESTAMP),
(7, '2025-11-26', true, '논술 작성', NULL, CURRENT_TIMESTAMP);

-- 3. Payments 테스트 데이터 (2025년 11월 결제)
INSERT INTO public.payments (student_id, payment_date, amount, year_month, status, created_at) VALUES
(1, '2025-11-01', 300000, '2025-11', 'PAID', CURRENT_TIMESTAMP),
(2, '2025-11-03', 300000, '2025-11', 'PAID', CURRENT_TIMESTAMP),
(3, '2025-11-05', 300000, '2025-11', 'PAID', CURRENT_TIMESTAMP),
(4, '2025-11-02', 300000, '2025-11', 'PAID', CURRENT_TIMESTAMP),
(5, '2025-11-07', 300000, '2025-11', 'PAID', CURRENT_TIMESTAMP),
(6, '2025-11-04', 250000, '2025-11', 'PAID', CURRENT_TIMESTAMP), -- 주1회 학생
-- 7번(윤서현), 8번(임지우) 학생은 미결제
(1, '2025-11-20', 300000, '2025-12', 'PAID', CURRENT_TIMESTAMP), -- 12월 선결제
(3, '2025-11-22', 300000, '2025-12', 'PAID', CURRENT_TIMESTAMP); -- 12월 선결제

-- 4. Expenses 테스트 데이터
INSERT INTO public.expenses (expense_type, amount, expense_date, description, category, created_at) VALUES
('고정비', 1500000, '2025-11-01', '11월 학원 임대료', '임대료', CURRENT_TIMESTAMP),
('고정비', 2000000, '2025-11-05', '강사 급여 (11월)', '인건비', CURRENT_TIMESTAMP),
('변동비', 150000, '2025-11-10', '교재 및 학습지 구입', '재료비', CURRENT_TIMESTAMP),
('고정비', 250000, '2025-11-15', '전기료, 수도료, 인터넷', '공과금', CURRENT_TIMESTAMP),
('변동비', 80000, '2025-11-18', '사무용품 구입', '기타', CURRENT_TIMESTAMP),
('변동비', 120000, '2025-11-20', '문구류 및 교구 구입', '재료비', CURRENT_TIMESTAMP),
('변동비', 50000, '2025-11-22', '프린터 잉크 및 용지', '기타', CURRENT_TIMESTAMP),
('변동비', 200000, '2025-11-25', '학습 자료 인쇄', '재료비', CURRENT_TIMESTAMP);

-- 5. Schedules 테스트 데이터
INSERT INTO public.schedules (schedule_date, title, description, created_at) VALUES
('2025-12-24', '크리스마스 이브 휴원', '12월 24일 학원 휴무', CURRENT_TIMESTAMP),
('2025-12-25', '크리스마스 휴원', '12월 25일 학원 휴무', CURRENT_TIMESTAMP),
('2025-12-31', '연말 휴원', '12월 31일 학원 휴무', CURRENT_TIMESTAMP),
('2025-12-20', '학부모 상담 주간', '12월 20일~27일 학부모 개별 상담', CURRENT_TIMESTAMP);

-- 6. Education Records 테스트 데이터
INSERT INTO public.education_records (year_month, week_number, subject, content, image_path, created_at) VALUES
('2025-11', 1, '수학', '덧셈과 뺄셈의 기초\n- 받아올림이 있는 덧셈\n- 받아내림이 있는 뺄셈', NULL, CURRENT_TIMESTAMP),
('2025-11', 1, '국어', '문장의 구조\n- 주어와 서술어\n- 문장 부호 사용법', NULL, CURRENT_TIMESTAMP),
('2025-11', 2, '수학', '곱셈 구구단\n- 2단~5단 암기\n- 곱셈 문제 풀이', NULL, CURRENT_TIMESTAMP),
('2025-11', 2, '영어', '알파벳과 기초 단어\n- 대소문자 구분\n- 간단한 인사말', NULL, CURRENT_TIMESTAMP),
('2025-11', 3, '수학', '나눗셈 기초\n- 나눗셈의 의미\n- 간단한 나눗셈 계산', NULL, CURRENT_TIMESTAMP),
('2025-11', 3, '국어', '독해와 논술\n- 글의 주제 찾기\n- 간단한 문장 만들기', NULL, CURRENT_TIMESTAMP),
('2025-11', 4, '수학', '도형의 이해\n- 삼각형, 사각형, 원\n- 도형의 둘레와 넓이', NULL, CURRENT_TIMESTAMP);

-- 데이터 삽입 확인
SELECT '학생 수: ' || COUNT(*) FROM public.students;
SELECT '정상 학생 수: ' || COUNT(*) FROM public.students WHERE status = 'ACTIVE';
SELECT '출석 기록 수: ' || COUNT(*) FROM public.attendance;
SELECT '결제 기록 수: ' || COUNT(*) FROM public.payments;
SELECT '지출 기록 수: ' || COUNT(*) FROM public.expenses;
