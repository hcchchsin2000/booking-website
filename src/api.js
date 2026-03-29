const GAS_URL = import.meta.env.VITE_GAS_URL;

async function gasGet(params) {
  const url = new URL(GAS_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function gasPost(data) {
  const body = new URLSearchParams();
  body.append('payload', JSON.stringify(data));
  const res = await fetch(GAS_URL, { method: 'POST', body });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function getAnnouncement() {
  return gasGet({ action: 'getAnnouncement' });
}

export function getServices() {
  return gasGet({ action: 'getServices' });
}

export function getAddons() {
  return gasGet({ action: 'getAddons' });
}

export function getClosedDates() {
  return gasGet({ action: 'getClosedDates' });
}

export function getAvailableSlots(date, duration) {
  return gasGet({ action: 'getAvailableSlots', date, duration });
}

export function createBooking(data) {
  return gasPost({ action: 'createBooking', ...data });
}
