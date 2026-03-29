async function apiGet(path) {
  const res = await fetch('/api' + path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiPost(path, data) {
  const res = await fetch('/api' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const getAnnouncement = () => apiGet('/announcement');
export const getServices = () => apiGet('/services');
export const getAddons = () => apiGet('/addons');
export const getClosedDates = () => apiGet('/closed-dates');
export const getAvailableSlots = (date, duration) => apiGet(`/slots?date=${date}&duration=${duration}`);
export const createBooking = (data) => apiPost('/bookings', data);
