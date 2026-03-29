import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('addons')
    .select('id, name, price, applicable_services')
    .eq('is_open', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json({
    addons: (data || []).map(a => ({
      id: a.id,
      name: a.name,
      price: a.price,
      services: a.applicable_services || [],
    })),
  });
}
