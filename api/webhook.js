const GAS_URL = process.env.GAS_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const record = req.body?.record;
  if (!record) return res.status(400).json({ error: 'no record' });

  try {
    const body = new URLSearchParams();
    body.append('payload', JSON.stringify({ type: 'INSERT', record }));
    await fetch(GAS_URL, { method: 'POST', body });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
