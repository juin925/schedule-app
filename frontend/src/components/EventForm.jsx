// src/components/EventForm.jsx
import { useState, useEffect } from "react";

export default function EventForm({ onSubmit, selectedEvent, onCancel }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || "");
      setDate(selectedEvent.date || "");
      setTime(selectedEvent.time || "");
      setDescription(selectedEvent.description || "");
    } else {
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
    }
  }, [selectedEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    onSubmit({ title, date, time, description });
  };

  return (
    <div className="card">
      <h2 className="card-title">{selectedEvent ? "스케줄 수정" : "새 스케줄 추가"}</h2>
      <form onSubmit={handleSubmit}>
        <label>제목 *</label>
        <input
          type="text"
          placeholder="예: 면접 준비, 운동, 공부"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>날짜 *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>시간</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label>메모</label>
        <textarea
          rows="3"
          placeholder="필요한 정보를 메모해두세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-actions">
          {selectedEvent && (
            <button type="button" className="secondary" onClick={onCancel}>
              취소
            </button>
          )}
          <button className="primary" type="submit">
            {selectedEvent ? "수정 완료" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
