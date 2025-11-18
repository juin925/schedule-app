from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import os

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # load .env
    load_dotenv()

    # 환경 변수
    DB_HOST = os.getenv("DB_HOST")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    SECRET_KEY = os.getenv("SECRET_KEY")

    app.secret_key = SECRET_KEY

    # SQLAlchemy MySQL URL
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}?charset=utf8mb4"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # CORS: 프론트 React 연결 허용
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)

    # ---------------------------
    #   Event Model
    # ---------------------------
    class Event(db.Model):
        __tablename__ = "events"

        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(100), nullable=False)
        date = db.Column(db.String(10), nullable=False)
        time = db.Column(db.String(5))
        description = db.Column(db.Text)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "title": self.title,
                "date": self.date,
                "time": self.time,
                "description": self.description,
                "created_at": self.created_at.isoformat(),
            }

    # ---------------------------
    #   Routes
    # ---------------------------

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    @app.route("/api/events", methods=["GET"])
    def get_events():
        date = request.args.get("date")

        query = Event.query
        if date:
            query = query.filter_by(date=date)

        events = query.order_by(Event.date.asc(), Event.time.asc()).all()
        return jsonify([e.to_dict() for e in events])

    @app.route("/api/events", methods=["POST"])
    def create_event():
        data = request.get_json() or {}

        title = data.get("title")
        date = data.get("date")
        time = data.get("time")
        description = data.get("description", "")

        if not title or not date:
            return jsonify({"error": "title과 date는 필수입니다."}), 400

        event = Event(
            title=title,
            date=date,
            time=time,
            description=description,
        )

        db.session.add(event)
        db.session.commit()
        return jsonify(event.to_dict()), 201

    @app.route("/api/events/<int:event_id>", methods=["PUT"])
    def update_event(event_id):
        data = request.get_json() or {}
        event = Event.query.get_or_404(event_id)

        event.title = data.get("title", event.title)
        event.date = data.get("date", event.date)
        event.time = data.get("time", event.time)
        event.description = data.get("description", event.description)

        db.session.commit()
        return jsonify(event.to_dict())

    @app.route("/api/events/<int:event_id>", methods=["DELETE"])
    def delete_event(event_id):
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "deleted"}), 204

    # 테이블 자동 생성
    with app.app_context():
        db.create_all()

    return app


# 로컬에서 테스트용
if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
