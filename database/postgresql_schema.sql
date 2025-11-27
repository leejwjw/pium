-- public.education_records definition

-- Drop table

-- DROP TABLE public.education_records;

CREATE TABLE public.education_records (
                                          id bigserial NOT NULL,
                                          year_month varchar(7) NOT NULL,
                                          week_number int4 NOT NULL,
                                          subject varchar(200) NOT NULL,
                                          "content" text NULL,
                                          image_path varchar(500) NULL,
                                          created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                          updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                          CONSTRAINT education_records_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_education_records_subject ON public.education_records USING btree (subject);
CREATE INDEX idx_education_records_week_number ON public.education_records USING btree (week_number);
CREATE INDEX idx_education_records_year_month ON public.education_records USING btree (year_month);

-- Table Triggers

CREATE TRIGGER update_education_records_updated_at BEFORE
    UPDATE
    ON
        public.education_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- public.expenses definition

-- Drop table

-- DROP TABLE public.expenses;

CREATE TABLE public.expenses (
                                 id bigserial NOT NULL,
                                 expense_type varchar(50) NOT NULL,
                                 amount int4 NOT NULL,
                                 expense_date date NOT NULL,
                                 description text NULL,
                                 created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                 updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                 CONSTRAINT expenses_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_expenses_expense_date ON public.expenses USING btree (expense_date);
CREATE INDEX idx_expenses_expense_type ON public.expenses USING btree (expense_type);

-- Table Triggers

CREATE TRIGGER update_expenses_updated_at BEFORE
    UPDATE
    ON
        public.expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- public.schedules definition

-- Drop table

-- DROP TABLE public.schedules;

CREATE TABLE public.schedules (
                                  id bigserial NOT NULL,
                                  schedule_date varchar(12) NOT NULL,
                                  title varchar(200) NOT NULL,
                                  description text NULL,
                                  created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                  updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                  CONSTRAINT schedules_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_schedules_schedule_date ON public.schedules USING btree (schedule_date);

-- Table Triggers

CREATE TRIGGER update_schedules_updated_at BEFORE
    UPDATE
    ON
        public.schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- public.students definition

-- Drop table

-- DROP TABLE public.students;

CREATE TABLE public.students (
                                 id bigserial NOT NULL,
                                 "name" varchar(100) NOT NULL,
                                 birth_date varchar(12) NOT NULL,
                                 school varchar(200) NULL,
                                 special_notes text NULL,
                                 mon bool DEFAULT false NULL,
                                 tue bool DEFAULT false NULL,
                                 wed bool DEFAULT false NULL,
                                 thu bool DEFAULT false NULL,
                                 fri bool DEFAULT false NULL,
                                 parent_contact varchar(20) NULL,
                                 student_contact varchar(20) NULL,
                                 created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                 updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                 CONSTRAINT students_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_students_name ON public.students USING btree (name);
CREATE INDEX idx_students_school ON public.students USING btree (school);

-- Table Triggers

CREATE TRIGGER update_students_updated_at BEFORE
    UPDATE
    ON
        public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- public.attendance definition

-- Drop table

-- DROP TABLE public.attendance;

CREATE TABLE public.attendance (
                                   id bigserial NOT NULL,
                                   student_id int8 NOT NULL,
                                   attendance_date date NOT NULL,
                                   is_present bool DEFAULT true NULL,
                                   progress_memo text NULL,
                                   created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                   updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                   CONSTRAINT attendance_pkey PRIMARY KEY (id),
                                   CONSTRAINT uk_attendance_student_date UNIQUE (student_id, attendance_date),
                                   CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE
);
CREATE INDEX idx_attendance_attendance_date ON public.attendance USING btree (attendance_date);
CREATE INDEX idx_attendance_student_id ON public.attendance USING btree (student_id);

-- Table Triggers

CREATE TRIGGER update_attendance_updated_at BEFORE
    UPDATE
    ON
        public.attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- public.payments definition

-- Drop table

-- DROP TABLE public.payments;

CREATE TABLE public.payments (
                                 id bigserial NOT NULL,
                                 student_id int8 NOT NULL,
                                 payment_date date NOT NULL,
                                 amount int8 NOT NULL,
                                 year_month varchar(7) NOT NULL,
                                 status varchar(20) DEFAULT 'PAID'::character varying NOT NULL,
                                 created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                 updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                 CONSTRAINT payments_pkey PRIMARY KEY (id),
                                 CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE
);
CREATE INDEX idx_payments_payment_date ON public.payments USING btree (payment_date);
CREATE INDEX idx_payments_student_id ON public.payments USING btree (student_id);
CREATE INDEX idx_payments_year_month ON public.payments USING btree (year_month);

-- Table Triggers

CREATE TRIGGER update_payments_updated_at BEFORE
    UPDATE
    ON
        public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();