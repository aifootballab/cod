import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chrome, Gamepad2, Mail, Lock, User, Eye, EyeOff, Loader2, Crosshair } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-orange-500 bg-orange-500/20 mb-4">
            <Crosshair className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter" style={{ fontFamily: 'Black Ops One, cursive' }}>
            COD<span className="text-orange-500">COACHING</span>
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-2">
            Piattaforma AI per analizzare le tue stats Call of Duty
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f0f] border border-gray-800">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold tracking-wider" style={{ fontFamily: 'Black Ops One, cursive' }}>
              {mode === 'login' ? (
                <>
                  AGENT <span className="text-orange-500">LOGIN</span>
                </>
              ) : (
                <>
                  NEW <span className="text-orange-500">RECRUIT</span>
                </>
              )}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Social Login */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span className="text-sm font-mono tracking-wider text-gray-300 group-hover:text-white">
                  Continua con Google
                </span>
              </button>
              <button
                onClick={() => handleSocialLogin('discord')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
              >
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-mono tracking-wider text-gray-300 group-hover:text-white">
                  Continua con Discord
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600 font-mono">O</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 tracking-wider uppercase">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 px-10 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                      placeholder="Il tuo username"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 tracking-wider uppercase">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 px-10 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="agent@codcoaching.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 tracking-wider uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 px-10 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-black font-bold py-3 px-6 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-mono tracking-wider">PROCESSING...</span>
                  </>
                ) : (
                  <span className="font-mono tracking-wider">
                    {mode === 'login' ? 'ACCEDI' : 'CREA ACCOUNT'}
                  </span>
                )}
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-gray-500">
              {mode === 'login' ? "Non hai un account?" : "Hai già un account?"}{' '}
              <button
                onClick={switchMode}
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                {mode === 'login' ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs font-mono mt-8">
          © 2024 COD COACHING. NON AFFILIATO CON ACTIVISION.
        </p>
      </div>

      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      `}</style>
    </div>
  );
}
