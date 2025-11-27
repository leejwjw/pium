-- 학원 원생 관리 시스템 데이터베이스 스키마

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS academy_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academy_management;

-- 원생 기본 정보 테이블
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '학생 이름',
    birth_date VARCHAR(12) NOT NULL COMMENT '생년월일',
    school VARCHAR(200) COMMENT '학교',
    special_notes TEXT COMMENT '특이사항',
    mon BOOLEAN DEFAULT FALSE COMMENT '월요일 등원',
    tue BOOLEAN DEFAULT FALSE COMMENT '화요일 등원',
    wed BOOLEAN DEFAULT FALSE COMMENT '수요일 등원',
    thu BOOLEAN DEFAULT FALSE COMMENT '목요일 등원',
    fri BOOLEAN DEFAULT FALSE COMMENT '금요일 등원',
    parent_contact VARCHAR(20) COMMENT '학부모 연락처',
    student_contact VARCHAR(20) COMMENT '학생 연락처',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_school (school)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='원생 정보';

-- 결제 이력 테이블
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL COMMENT '학생 ID',
    payment_date DATE NOT NULL COMMENT '결제일',
    amount INT NOT NULL COMMENT '결제 금액',
    year_month VARCHAR(7) NOT NULL COMMENT '결제 대상 월 (YYYY-MM)',
    status VARCHAR(20) NOT NULL DEFAULT 'PAID' COMMENT '결제 상태 (PAID, PENDING, CANCELLED)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_year_month (year_month),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 이력';

-- 출석 및 진도 기록 테이블
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL COMMENT '학생 ID',
    attendance_date DATE NOT NULL COMMENT '출석 날짜',
    is_present BOOLEAN DEFAULT TRUE COMMENT '출석 여부',
    progress_memo TEXT COMMENT '진도 메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_attendance_date (attendance_date),
    UNIQUE KEY uk_student_date (student_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='출석 기록';

-- 재료비/비품 지출 테이블
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    expense_type VARCHAR(50) NOT NULL COMMENT '구분 (재료비, 관리비 등)',
    amount INT NOT NULL COMMENT '지출 금액',
    expense_date DATE NOT NULL COMMENT '지출 날짜',
    description TEXT COMMENT '설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_expense_type (expense_type),
    INDEX idx_expense_date (expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='지출 내역';

-- 일정 관리 테이블
CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    schedule_date VARCHAR(12) NOT NULL COMMENT '일정 날짜',
    title VARCHAR(200) NOT NULL COMMENT '일정 제목',
    description TEXT COMMENT '일정 내용',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_schedule_date (schedule_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='일정';

-- 교육 관리 테이블
CREATE TABLE education_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    year_month VARCHAR(7) NOT NULL COMMENT '월 (YYYY-MM)',
    week_number INT NOT NULL COMMENT '주차 (1-5)',
    subject VARCHAR(200) NOT NULL COMMENT '주제',
    content TEXT COMMENT '내용 메모',
    image_path VARCHAR(500) COMMENT '사진 경로',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_year_month (year_month),
    INDEX idx_week (week_number),
    INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='교육 관리';
