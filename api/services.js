import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('services')
    .select('id, name, duration, price, description')
    .eq('is_open', true)
    .order('sort_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ services: data });
}
