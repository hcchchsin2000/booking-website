import { supabase } from './_lib/supabase.js';
import { calculateSlots, normalizePhone } from './_lib/slotUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;

  // 防爬蟲
  if (data._hp) return res.status(400).json({ error: '預約失敗，請重試' });
  if (data._t && Date.now() - parseInt(data._t) < 5000) {
    return res.status(400).json({ error: '操作過快，請稍後再試' });
  }

  // 必填欄位
  if (!data.displayName || !data.phone || !data.service || !data.date || !data.time) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }

  const phone = normalizePhone(data.phone);
  if (!/^[0-9]{8,10}$/.test(phone)) {
    return res.status(400).json({ error: '電話格式不正確' });
  }

  const dur = parseInt(data.duration) || 60;

  // 確認非公休日
  const { data: closed } = await supabase
    .from('closed_dates')
    .select('id')
    .eq('closed_date', data.date)
    .limit(1);
  if (closed && closed.length > 0) {
    return res.status(400).json({ error: '此日期不開放預約' });
  }

  // 再次確認時段可用
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('booking_time, duration')
    .eq('booking_date', data.date)
    .neq('status', '已取消');

  if (!calculateSlots(dur, existingBookings || []).includes(data.time)) {
    return res.status(409).json({ error: '此時段已被預約，請返回選擇其他時段' });
  }

  // 同手機號限制
  const { data: phoneBookings } = await supabase
    .from('bookings')
    .select('booking_date')
    .eq('phone', phone)
    .neq('status', '已取消');

  if ((phoneBookings || []).some(b => b.booking_date === data.date)) {
    return res.status(400).json({ error: '同一天已有預約，如需更改請聯繫我們' });
  }
  if ((phoneBookings || []).length >= 3) {
    return res.status(400).json({ error: '同一手機號碼最多可預約 3 筆' });
  }

  // 產生預約編號
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });
  const bookingId = 'BK' + String((count || 0) + 1).padStart(4, '0');

  const { error: insertErr } = await supabase.from('bookings').insert({
    booking_id: bookingId,
    customer_name: data.displayName,
    phone,
    email: data.email || '',
    service: data.service,
    booking_date: data.date,
    booking_time: data.time,
    duration: dur,
    addons: data.addons || '',
    notes: data.notes || '',
    status: '已確認',
  });

  if (insertErr) return res.status(500).json({ error: insertErr.message });
  res.json({ success: true, bookingId });
}
