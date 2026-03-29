import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('closed_dates')
    .select('closed_date');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ dates: (data || []).map(r => r.closed_date) });
}
