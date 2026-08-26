import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode', // Yoki 'test_mode'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    console.error(error);
    return res.status(500).json({ error: "Checkout yaratishda xatolik" });
  }
}
