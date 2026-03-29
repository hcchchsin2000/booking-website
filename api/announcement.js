import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  const { data } = await supabase
    .from('announcements')
    .select('content, font_size, font_family')
    .eq('is_show', true)
    .limit(1)
    .maybeSingle();
  if (!data) return res.json({ text: '' });
  res.json({
    text: data.content || '',
    fontSize: data.font_size || 0,
    fontFamily: data.font_family || '',
  });
}
