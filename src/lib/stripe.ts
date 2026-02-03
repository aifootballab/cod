import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const HERO_POINTS_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    hp: 500,
    price: 4.99,
    currency: 'EUR',
    description: 'Perfect for trying premium features',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    hp: 1500,
    price: 12.99,
    currency: 'EUR',
    description: 'Best value for regular players',
    popular: true,
    savings: '13%',
  },
  {
    id: 'elite',
    name: 'Elite',
    hp: 5000,
    price: 39.99,
    currency: 'EUR',
    description: 'For serious competitors',
    popular: false,
    savings: '20%',
  },
  {
    id: 'legend',
    name: 'Legend',
    hp: 15000,
    price: 99.99,
    currency: 'EUR',
    description: 'Ultimate package for legends',
    popular: false,
    savings: '33%',
  },
];

export async function createCheckoutSession(packageId: string, userId: string) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId, userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }
  
  const { sessionId } = await response.json();
  return sessionId;
}
