import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wtgtmeodtuimjvqoqfzc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    if (payload.type === 'payment.succeeded') {
      const metadata = payload.data.metadata || {};

      const { error } = await supabase.from('entries').insert([
        {
          url: metadata.url,
          cat: metadata.category || 'other',
          bid: Number(metadata.bid_amount || 2),
          clicks: 0
        }
      ]);

      if (error) return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
