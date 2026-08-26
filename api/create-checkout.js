export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, url, category } = req.body || {};
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API Key kiritilmagan" });
    }

    const response = await fetch('https://live.dodopayments.com/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        billing: { city: "NY", country: "US", state: "NY", street: "123 St", zip_code: "10001" },
        customer: { email: "customer@bidmesto.lol", name: "Trader User" },
        product_cart: [{
          product_id: 'pdt_0NmFjUmSlmrbnp1HL4E9B',
          quantity: 1,
          amount: Math.round((amount || 2) * 100)
        }],
        metadata: { url: url || '', category: category || '' },
        return_url: "https://bidmesto.lol"
      })
    });

    const data = await response.json();

    // Dodo Payments qaytargan butun javobni tekshirish uchun ekranga chiqaramiz
    return res.status(200).json({ 
      error: `Dodo Javobi: ${JSON.stringify(data)}` 
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
