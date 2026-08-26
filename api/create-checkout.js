import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode', // Yoki 'test_mode'
});

export default async function handler(req, res) {
  // 1. CORS sarlavhalari (Brauzer blokirovkasini yechish uchun)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Preflight (OPTIONS) so'rovi kelganda birdan 200 qaytarish
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Faqat POST so'roviga ruxsat berish
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, url, category } = req.body;

  try {
    const response = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: 'pdt_0NmEgwKt32IXGVf5iYXFK',
          quantity: 1,
          amount: Math.round(amount * 100), // Sentlarda (Masalan: $10 = 1000)
        },
      ],
      metadata: {
        url: url,
        category: category,
      },
    });

    return res.status(200).json({ checkout_url: response.checkout_url });
  } catch (error) {
    console.error("Dodo API Error:", error);
    return res.status(500).json({ error: error.message || "Checkout yaratishda xatolik" });
  }
}
