const OPEN = 11 * 60;
const CLOSE = 22 * 60;

export function calculateSlots(duration, bookings) {
  const slots = [];
  for (let min = OPEN; min + duration <= CLOSE; min += 30) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return slots.filter(slot => {
    const [sh, sm] = slot.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = start + duration;
    return !bookings.some(b => {
      const [bh, bm] = b.booking_time.split(':').map(Number);
      const bStart = bh * 60 + bm;
      const bEnd = bStart + (b.duration || 60);
      return start < bEnd && end > bStart;
    });
  });
}

export function normalizePhone(p) {
  return String(p).replace(/[-\s]/g, '').replace(/^0+/, '');
}
