// src/App.jsx
import { useEffect, useState } from "react";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "./api";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./styles.css";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [date, setDate] = useState(today());
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    const data = await fetchEvents(date);
    setEvents(data);
  }

  useEffect(() => {
    load();
  }, [date]);

  return (
    <div className="app">
      {/* 상단 노션 스타일 헤더 */}
      <header className="app-header">
        <h1 className="app-title">📅 내 스케줄 페이지</h1>
        <p className="app-subtitle">오늘 할 일과 약속을 간단하게 정리해보세요.</p>
      </header>

      {/* 날짜 선택 바 */}
      <div className="date-bar">
        <span className="date-label">날짜</span>
        <input
          className="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* 좌측: 입력폼 / 우측: 리스트 */}
      <div className="layout">
        <EventForm
          onSubmit={async (data) => {
            if (selected) {
              await updateEvent(selected.id, data);
            } else {
              await createEvent(data);
            }
            setSelected(null);
            load();
          }}
          selectedEvent={selected}
          onCancel={() => setSelected(null)}
        />

        <div className="card">
          <h2 className="card-title">스케줄 목록</h2>
          <EventList
            events={events}
            onEdit={(ev) => setSelected(ev)}
            onDelete={async (id) => {
              await deleteEvent(id);
              load();
            }}
          />
        </div>
      </div>
    </div>
  );
}
