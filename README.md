# PIUM 학원 관리 시스템

학원 운영에 필요한 학생 관리, 출석, 결제, 지출 등을 통합 관리하는 웹 애플리케이션

## 주요 기능

- 대시보드: 학원 운영 현황 한눈에 보기
- 학생 관리: 학생 등록, 수정, 조회 및 상태별 필터링
- 출석 관리: 날짜별 출석 기록 및 캘린더 조회
- 수업 일정: 요일별 수업 시간표 관리
- 결제 관리: 학생별 수강료 납부 내역 관리 및 엑셀 다운로드
- 지출 관리: 학원 운영 지출 내역 기록
- 교육 자료: 주차별 학습 내용 기록 및 관리
- 비밀번호 변경: 관리자 계정 비밀번호 변경

## 기술 스택

**Backend**
- Java 11
- Spring Boot 2.7.18
- Spring Security + JWT
- MyBatis
- PostgreSQL

**Frontend**
- React 19
- React Router
- Axios
- react-calendar
- XLSX (엑셀 다운로드)

## 실행 방법

**개발 환경**
```bash
# Backend와 Frontend 동시 빌드 및 실행
./gradlew bootRun

# Frontend만 별도 실행 (개발용)
cd frontend
npm install
npm start
```

**프로덕션 빌드**
```bash
./gradlew build
java -jar build/libs/pium-0.0.1-SNAPSHOT.jar
```

## 데이터베이스

PostgreSQL 데이터베이스 연결 필요
- application.yaml에서 DB 연결 정보 설정
- sql 폴더의 스크립트로 초기 테이블 생성
