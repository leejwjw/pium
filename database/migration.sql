-- Migration Script for Academy Management System
-- 학원 관리 시스템 스키마 변경

-- 1. Students 테이블에 status, sessions_per_week 컬럼 추가
ALTER TABLE public.students 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
ADD COLUMN sessions_per_week INT DEFAULT 1 NOT NULL;

-- status 컬럼에 CHECK 제약조건 추가
ALTER TABLE public.students 
ADD CONSTRAINT chk_students_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'WITHDRAWN'));

-- sessions_per_week 컬럼에 CHECK 제약조건 추가
ALTER TABLE public.students 
ADD CONSTRAINT chk_students_sessions CHECK (sessions_per_week IN (1, 2));

-- status 인덱스 추가 (정상 학생 조회 최적화)
CREATE INDEX idx_students_status ON public.students (status);

-- 2. Attendance 테이블에 absence_reason 컬럼 추가
ALTER TABLE public.attendance 
ADD COLUMN absence_reason TEXT NULL;

-- 3. Expenses 테이블에 category 컬럼 추가
ALTER TABLE public.expenses 
ADD COLUMN category VARCHAR(100) NULL;

-- category 인덱스 추가 (품목별 조회 최적화)
CREATE INDEX idx_expenses_category ON public.expenses (category);

-- 변경사항 확인
COMMENT ON COLUMN public.students.status IS '학생 상태: ACTIVE(정상), SUSPENDED(중지), WITHDRAWN(퇴원)';
COMMENT ON COLUMN public.students.sessions_per_week IS '주당 수업 횟수: 1(주1회) 또는 2(주2회)';
COMMENT ON COLUMN public.attendance.absence_reason IS '결석 사유 (결석 시에만 입력)';
COMMENT ON COLUMN public.expenses.category IS '지출 품목 분류 (예: 인건비, 재료비, 임대료 등)';
