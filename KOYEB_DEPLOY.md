# Koyeb 배포 가이드

## 빌드 및 배포 설정

Koyeb 대시보드에서 다음 설정을 적용하세요:

### Build Command
```bash
chmod +x build.sh && ./build.sh
```

### Run Command
```bash
java -jar build/libs/pium-0.0.1-SNAPSHOT.jar
```

또는 Procfile을 사용하는 경우 Run Command는 비워두면 됩니다.

## 배포 순서

1. **코드를 GitHub에 Push**
   ```bash
   git add .
   git commit -m "Fix Mixed Content error and add build configuration"
   git push
   ```

2. **Koyeb 대시보드 설정**
   - Service 설정으로 이동
   - Build section에서:
     - **Build command**: `chmod +x build.sh && ./build.sh`
     - **Run command**: `java -jar build/libs/pium-0.0.1-SNAPSHOT.jar`
   - Deploy 버튼 클릭

3. **배포 확인**
   - Koyeb에서 빌드 로그 확인
   - 배포 완료 후 사이트 접속하여 Mixed Content 에러 해결 확인

## 문제 해결

### 빌드가 실패하는 경우
- Node.js 버전 확인 (16 이상 필요)
- Java 버전 확인 (11 필요)
- Koyeb 환경 변수에 `JAVA_VERSION=11` 추가되어 있는지 확인

### 여전히 에러가 발생하는 경우
- 브라우저 캐시 강력 새로고침 (Ctrl + Shift + R)
- Koyeb 로그에서 Spring Boot 시작 확인
- 브라우저 콘솔에서 `API_BASE_URL >>` 로그 확인
