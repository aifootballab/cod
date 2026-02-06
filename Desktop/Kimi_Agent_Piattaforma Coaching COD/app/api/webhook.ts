import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'No signature' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const hpAmount = parseInt(session.metadata?.hpAmount || '0');
    
    if (userId && hpAmount > 0) {
      try {
        // Aggiungi HP all'utente
        const { data: currentCredits } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', userId)
          .single();

        const newBalance = (currentCredits?.balance || 0) + hpAmount;

        // Aggiorna balance
        await supabase
          .from('user_credits')
          .upsert({
            user_id: userId,
            balance: newBalance,
            total_purchased: (currentCredits?.balance || 0) + hpAmount,
          });

        // Registra transazione
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          type: 'purchase',
          amount: hpAmount,
          balance_after: newBalance,
          description: `Purchase: ${hpAmount} Hero Points`,
          reference_id: session.id,
        });

        console.log(`✅ Added ${hpAmount} HP to user ${userId}`);
      } catch (error) {
        console.error('Error updating credits:', error);
      }
    }
  }

  res.status(200).json({ received: true });
}
