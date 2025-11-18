# Python 베이스 이미지
FROM python:3.10-slim

# 시스템 패키지 업데이트 & MySQL 연결 필요 패키지 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# requirements.txt 먼저 복사해서 pip install (캐시 최적화)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드 전체 복사
COPY . .

# Gunicorn 실행 포트
EXPOSE 5000

# Gunicorn으로 Flask 실행
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()"]
