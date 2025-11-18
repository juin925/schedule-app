# Schedule App - Full Stack CI/CD Deployment (Kakao Cloud)

로컬환경에서 앱서버와 파이프라인을 구축하기 위해 실행되었습니다.

-   **React (Frontend)**
-   **Flask + MySQL (Backend)**
-   **Docker & Docker Compose**
-   **GitHub Actions (CI/CD)**
-   **GHCR (GitHub Container Registry)**
-   **Kakao Cloud VM (App Server + DB Server + Bastion)**

로컬환경 푸쉬 -> 도커 빌드 -> GHCR 푸쉬 -> 앱서버 Deploy -> 컨테이너 자동 실행

------------------------------------------------------------------------

## 🚀 Features

### **Frontend**

-   React + Vite 기반
-   일정 등록 / 수정 / 삭제
-   날짜별 일정 조회
-   API 호출로 Flask 백엔드와 통신
-   Docker 컨테이너로 배포

### **Backend**

-   Flask (Pure API Server)
-   MySQL 연동
-   SQLAlchemy 기반 CRUD
-   CORS 완전 허용
-   Docker 컨테이너로 배포

### **Deployment**

-   GitHub Actions로 자동 빌드 & 배포
-   GHCR에 Docker Image 저장
-   SSH로 Kakao Cloud 서버 자동 접근
-   docker compose pull → up -d 자동 실행
-   완전 자동 무중단 업데이트

------------------------------------------------------------------------

## 📦 Project Structure

    schedule-app/
    ├── frontend/          # React App
    ├── backend/           # Flask API
    ├── docker-compose.yaml
    └── backend.env        # Backend environment variables

------------------------------------------------------------------------

## 🐬 MySQL Database

    DB_NAME=DB_NAME
    DB_USER=USER_NAME
    DB_PASSWORD=PASSWORD
    DB_HOST=DB_PRIVATE_IP

Backend uses SQLAlchemy:

-   events 테이블 자동 생성\
-   CRUD API 제공

------------------------------------------------------------------------

## 🐳 Docker Compose (서버)

``` yaml
version: "3"

services:
  backend:
    image: ghcr.io/juin925/schedule-backend:latest
    container_name: schedule_backend
    env_file:
      - ./backend.env
    ports:
      - "5000:5000"
    restart: always

  frontend:
    image: ghcr.io/juin925/schedule-frontend:latest
    container_name: schedule_frontend
    ports:
      - "80:80"
    restart: always
```

------------------------------------------------------------------------

## ⚙️ GitHub Actions (CI/CD)

### Full Workflow:

1.  main push 발생
2.  frontend/backend Docker image build
3.  GHCR 로그인 → push
4.  Kakao Cloud 서버 SSH 접속
5.  서버에서 GHCR 다시 로그인 (중요)
6.  docker compose pull
7.  docker compose up -d (자동 재배포)

------------------------------------------------------------------------

## 🔑 Required GitHub Secrets

  Secret Name   Value
  ------------- ----------------------------------------------------
  SERVER_HOST   앱서버 퍼블릭 IP
  SERVER_USER   ubuntu
  SERVER_KEY    private SSH key
  GHCR_TOKEN    GitHub Personal Access Token (read/write packages)

------------------------------------------------------------------------

## 🚀 Deploy Workflow (deploy.yaml)

``` yaml
script: |
  echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u juin925 --password-stdin
  cd /home/ubuntu/app/schedule-app
  docker compose pull
  docker compose up -d
  docker image prune -f
```

------------------------------------------------------------------------

## 🌐 How to Access

브라우저에서:

    http://<APP_SERVER_PUBLIC_IP>

------------------------------------------------------------------------

## ✔ Deployment Validation

서버에서 확인:

``` sh
docker ps
```

정상적으로 2개의 컨테이너가 떠야 함:

    schedule_backend
    schedule_frontend

------------------------------------------------------------------------

## 🎉 Status

**자동화된 Full-stack CI/CD 구성 완료**

Frontend ↔ Backend ↔ DB 모두 연결\
GHCR 기반 이미지 관리\
배포 자동화 성공

------------------------------------------------------------------------

## 👨‍💻 Author

**주인 황 (juin925)**\
GitHub: https://github.com/juin925