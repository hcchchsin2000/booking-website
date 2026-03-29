import { supabase } from './_lib/supabase.js';
import { calculateSlots } from './_lib/slotUtils.js';

export default async function handler(req, res) {
  const { date, duration } = req.query;
  if (!date) return res.status(400).json({ error: 'date required' });
  const dur = parseInt(duration) || 60;

  const { data: closed } = await supabase
    .from('closed_dates')
    .select('id')
    .eq('closed_date', date)
    .limit(1);
  if (closed && closed.length > 0) return res.json({ slots: [] });

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('booking_time, duration')
    .eq('booking_date', date)
    .neq('status', '已取消');
  if (error) return res.status(500).json({ error: error.message });

  res.json({ slots: calculateSlots(dur, bookings || []) });
}
