import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, Chrome, Gamepad2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { t } = useTranslation();
  const { signIn, signUp, signInWithGoogle, signInWithDiscord } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        setSuccess(t('auth.loginSuccess') || 'Login successful!');
        setTimeout(onClose, 1000);
      } else {
        await signUp(formData.email, formData.password, formData.username);
        setSuccess(t('auth.signupSuccess') || 'Account created! Check your email to confirm.');
        setTimeout(() => {
          setMode('login');
          setFormData(prev => ({ ...prev, password: '' }));
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || t('auth.error') || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    setError(null);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithDiscord();
      }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0f0f0f] border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
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
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                Continue with Google
              </span>
            </button>
            <button
              onClick={() => handleSocialLogin('discord')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
            >
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-mono tracking-wider text-gray-300 group-hover:text-white">
                Continue with Discord
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600 font-mono">OR</span>
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
                    placeholder="Enter your username"
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
                ✅ {success}
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
                  {mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
                </span>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={switchMode}
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
