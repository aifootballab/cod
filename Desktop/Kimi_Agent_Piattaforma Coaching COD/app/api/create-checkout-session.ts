import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const HERO_POINTS_PACKAGES = {
  starter: { hp: 500, price: 499, name: 'Starter (500 HP)' },
  pro: { hp: 1500, price: 1299, name: 'Pro (1500 HP)' },
  elite: { hp: 5000, price: 3999, name: 'Elite (5000 HP)' },
  legend: { hp: 15000, price: 9999, name: 'Legend (15000 HP)' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { packageId, userId } = req.body;
    
    const pkg = HERO_POINTS_PACKAGES[packageId as keyof typeof HERO_POINTS_PACKAGES];
    if (!pkg) {
      return res.status(400).json({ error: 'Invalid package' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `COD Coaching - ${pkg.name}`,
              description: `${pkg.hp} Hero Points for COD Coaching platform`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'https://cod-psi.vercel.app'}/settings?payment=success&hp=${pkg.hp}`,
      cancel_url: `${process.env.VERCEL_URL || 'https://cod-psi.vercel.app'}/settings?payment=cancelled`,
      metadata: {
        userId,
        hpAmount: pkg.hp.toString(),
        packageId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
