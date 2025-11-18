// src/components/EventList.jsx
export default function EventList({ events, onEdit, onDelete }) {
  if (!events.length) {
    return <div className="event-empty">이 날짜에는 등록된 스케줄이 없습니다.</div>;
  }

  return (
    <>
      {events.map((ev) => (
        <div key={ev.id} className="event-item">
          <div className="event-main">
            <div className="event-title">{ev.title}</div>
            <div className="event-meta">
              {ev.date}
              {ev.time && ` · ${ev.time}`}
            </div>
            {ev.description && <div className="event-desc">{ev.description}</div>}
          </div>

          <div className="event-actions">
            <button className="secondary" onClick={() => onEdit(ev)}>
              수정
            </button>
            <button className="danger" onClick={() => onDelete(ev.id)}>
              삭제
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
