import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Check, Loader2, Crown, Star, Trophy, Award } from 'lucide-react';
import { HERO_POINTS_PACKAGES, createCheckoutSession, stripePromise } from '@/lib/stripe';
import type { User } from '@supabase/supabase-js';

interface HeroPointsShopProps {
  user: User | null;
  currentBalance: number;
}

const PACKAGE_ICONS = {
  starter: Award,
  pro: Star,
  elite: Trophy,
  legend: Crown,
};

export function HeroPointsShop({ user, currentBalance }: HeroPointsShopProps) {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      setError(i18n.language === 'it' ? 'Devi effettuare il login' : 'Please login first');
      return;
    }

    setLoading(packageId);
    setError(null);

    try {
      const sessionId = await createCheckoutSession(packageId, user.id);
      const stripe = await stripePromise;
      
      if (stripe) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
      }
    } catch (err: any) {
      setError(err.message || (i18n.language === 'it' ? 'Errore durante il pagamento' : 'Payment error'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono tracking-wider mb-4">
          <Zap className="w-4 h-4" />
          {i18n.language === 'it' ? 'ACQUISTA HERO POINTS' : 'BUY HERO POINTS'}
        </div>
        
        <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
          {i18n.language === 'it' ? 'SCEGLI IL TUO PACCHETTO' : 'CHOOSE YOUR PACKAGE'}
        </h3>
        
        {currentBalance > 0 && (
          <p className="text-gray-400">
            {i18n.language === 'it' ? 'Saldo attuale: ' : 'Current balance: '}
            <span className="text-orange-400 font-bold">{currentBalance.toLocaleString()} HP</span>
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {HERO_POINTS_PACKAGES.map((pkg) => {
          const Icon = PACKAGE_ICONS[pkg.id as keyof typeof PACKAGE_ICONS];
          const isLoading = loading === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative border ${
                pkg.popular 
                  ? 'border-orange-500 bg-orange-500/5' 
                  : 'border-gray-800 bg-[#111]'
              } p-6 flex flex-col`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-black text-xs font-bold font-mono">
                  {i18n.language === 'it' ? 'PIU POPOLARE' : 'MOST POPULAR'}
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 ${pkg.popular ? 'bg-orange-500/20' : 'bg-gray-800'} flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${pkg.popular ? 'text-orange-500' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Name */}
              <h4 className="text-xl font-bold text-white text-center mb-1" style={{ fontFamily: 'Black Ops One, cursive' }}>
                {pkg.name}
              </h4>

              {/* HP Amount */}
              <div className="text-center mb-4">
                <span className="text-4xl font-black text-orange-500">{pkg.hp.toLocaleString()}</span>
                <span className="text-gray-400 text-sm ml-1">HP</span>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm text-center mb-4 flex-grow">
                {pkg.description}
              </p>

              {/* Savings */}
              {pkg.savings && (
                <div className="text-center mb-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono">
                    {i18n.language === 'it' ? 'Risparmi ' : 'Save '}{pkg.savings}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-white">€{pkg.price}</span>
              </div>

              {/* Button */}
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={isLoading || !user}
                className={`w-full py-3 font-mono font-bold tracking-wider transition-all ${
                  pkg.popular
                    ? 'bg-orange-500 hover:bg-orange-600 text-black'
                    : 'border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {i18n.language === 'it' ? 'CARICAMENTO...' : 'LOADING...'}
                  </span>
                ) : !user ? (
                  i18n.language === 'it' ? 'ACCEDI PER ACQUISTARE' : 'LOGIN TO BUY'
                ) : (
                  i18n.language === 'it' ? 'ACQUISTA ORA' : 'BUY NOW'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="max-w-2xl mx-auto mt-12 p-6 border border-gray-800 bg-[#111]">
        <h4 className="text-lg font-bold text-white mb-4 text-center">
          {i18n.language === 'it' ? 'COSA PUOI FARE CON HERO POINTS' : 'WHAT YOU CAN DO WITH HERO POINTS'}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            i18n.language === 'it' ? 'Sblocca avatar esclusivi' : 'Unlock exclusive avatars',
            i18n.language === 'it' ? 'Analisi illimitate' : 'Unlimited analyses',
            i18n.language === 'it' ? 'Build personalizzate AI' : 'AI personalized builds',
            i18n.language === 'it' ? 'Badge speciali profilo' : 'Special profile badges',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex justify-center gap-6 mt-8 text-xs text-gray-500 font-mono">
        <span>🔒 SSL Secure</span>
        <span>💳 Stripe Payments</span>
        <span>✅ Instant Delivery</span>
      </div>
    </div>
  );
}
