-- 과목 마스터 테이블 추가
CREATE TABLE public.subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 트리거 추가
CREATE TRIGGER update_subjects_updated_at 
BEFORE UPDATE ON public.subjects 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 추가
CREATE INDEX idx_subjects_name ON public.subjects(name);

-- 기본 과목 데이터 삽입
INSERT INTO subjects (name, description) VALUES
('수학', '수학 과목'),
('국어', '국어 과목'),
('영어', '영어 과목'),
('과학', '과학 과목'),
('사회', '사회 과목'),
('기타', '기타 과목');
