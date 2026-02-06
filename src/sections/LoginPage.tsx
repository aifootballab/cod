import { useState } from 'react';
import { Chrome, Gamepad2, Mail, Lock, User, Eye, EyeOff, Loader2, Crosshair, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: formData.email, 
          password: formData.password 
        });
        if (error) throw error;
        onLogin();
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { 
            data: { username: formData.username },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        setSuccess('✅ Account creato! Controlla la tua email (anche in SPAM) per confermare, poi fai login.');
        setTimeout(() => {
          setMode('login');
          setFormData(prev => ({ ...prev, password: '' }));
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'autenticazione');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')`,
        }}
      />
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-orange-950/40" />
      
      {/* Tactical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated Particles/Dust */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 relative">
            <div className="absolute inset-0 border-2 border-orange-500 rotate-45 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-2 border border-orange-500/50 rotate-45" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <Target className="w-10 h-10 text-orange-500 relative z-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter" style={{ fontFamily: 'Black Ops One, cursive' }}>
            COD<span className="text-orange-500">COACHING</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
            <span className="text-orange-400 text-xs font-mono tracking-[0.3em] uppercase">
              Tactical Analysis Platform
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
          </div>
        </div>

        {/* Glass Card */}
        <div className="relative">
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500/40 to-orange-500/20 rounded-sm blur-sm" />
          
          <div className="relative bg-black/60 backdrop-blur-xl border border-orange-500/20 rounded-sm overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-orange-500/20">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <h2 className="text-xl font-bold tracking-wider text-center" style={{ fontFamily: 'Black Ops One, cursive' }}>
                {mode === 'login' ? (
                  <>
                    AGENT <span className="text-orange-500">ACCESS</span>
                  </>
                ) : (
                  <>
                    NEW <span className="text-orange-500">RECRUIT</span>
                  </>
                )}
              </h2>
              <p className="text-gray-500 text-xs text-center mt-1 font-mono">
                {mode === 'login' ? 'Inserisci le credenziali per accedere' : 'Crea il tuo account operativo'}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Social Login */}
              <div className="space-y-3">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="w-full group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 group-hover:border-red-500/50 transition-colors bg-black/40">
                    <Chrome className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-mono tracking-wider text-gray-300 group-hover:text-white transition-colors">
                      Continua con Google
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSocialLogin('discord')}
                  className="w-full group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 group-hover:border-indigo-500/50 transition-colors bg-black/40">
                    <Gamepad2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-mono tracking-wider text-gray-300 group-hover:text-white transition-colors">
                      Continua con Discord
                    </span>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">Oppure</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-orange-400/80 tracking-wider uppercase">
                      <Crosshair className="w-3 h-3" />
                      Username Operativo
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-black/40 border border-gray-700 focus:border-orange-500/50 px-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all"
                        placeholder="Il tuo callsign"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-orange-400/80 tracking-wider uppercase">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/40 border border-gray-700 focus:border-orange-500/50 px-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all"
                      placeholder="agent@codcoaching.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-orange-400/80 tracking-wider uppercase">
                    <Lock className="w-3 h-3" />
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-black/40 border border-gray-700 focus:border-orange-500/50 px-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2">
                    <span className="text-red-500">⚠</span>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2 py-3.5">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span className="font-mono font-bold text-sm tracking-wider text-black">AUTENTICAZIONE...</span>
                      </>
                    ) : (
                      <span className="font-mono font-bold text-sm tracking-wider text-black">
                        {mode === 'login' ? 'ACCEDI ALLA PIATTAFORMA' : 'CREA ACCOUNT OPERATIVO'}
                      </span>
                    )}
                  </div>
                </button>
              </form>

              {/* Toggle */}
              <div className="pt-2 border-t border-gray-800">
                <p className="text-center text-sm text-gray-500">
                  {mode === 'login' ? "Non hai un account?" : "Hai già un account?"}{' '}
                  <button
                    onClick={switchMode}
                    className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                  >
                    {mode === 'login' ? 'Registrati' : 'Accedi'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-3 text-xs text-gray-600 font-mono">
            <span>© 2024</span>
            <span className="text-orange-500/50">•</span>
            <span>COD COACHING</span>
            <span className="text-orange-500/50">•</span>
            <span>NON AFFILIATO CON ACTIVISION</span>
          </div>
        </div>
      </div>

      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      `}</style>
    </div>
  );
}
