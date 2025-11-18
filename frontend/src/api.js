const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function fetchEvents(date) {
  const res = await fetch(`${API_BASE_URL}/api/events?date=${date}`);
  return res.json();
}

export async function createEvent(data) {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEvent(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEvent(id) {
  return fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "DELETE",
  });
}
