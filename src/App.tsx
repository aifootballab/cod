import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import { HeroSection } from '@/sections/HeroSection';
import { UploadSection } from '@/sections/UploadSection';
import { ResultsSection } from '@/sections/ResultsSection';
import { LeaderboardSection } from '@/sections/LeaderboardSection';
import { ProfileSection } from '@/sections/ProfileSection';
import { ProfileSettings } from '@/sections/ProfileSettings';
import { BuildsSection } from '@/sections/BuildsSection';
import { LoginPage } from '@/sections/LoginPage';
import { DemoSection } from '@/sections/DemoSection';
import { useAnalysis } from '@/hooks/useAnalysis';
// Weapon database imported in BuildsSection
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/lib/supabase';
import { Crosshair, Menu, X, User, LogOut, Zap } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type View = 'home' | 'analyze' | 'builds' | 'leaderboard' | 'profile' | 'settings';

function App() {
  const { t } = useTranslation();
  const uploadRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ username: string; rank: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [heroPoints, setHeroPoints] = useState<number>(0);
  
  const { analysis, isAnalyzing, progress, error, getStageText, startAnalysis, resetAnalysis } = useAnalysis({ userId: user?.id });

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, rank')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
        
        // Fetch Hero Points
        const { data: creditsData } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', session.user.id)
          .single();
        setHeroPoints(creditsData?.balance || 0);
      }
      setAuthChecked(true);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-orange-500 font-mono tracking-wider">LOADING...</span>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={() => setCurrentView('home')} />;
  }

  const scrollToUpload = () => {
    setCurrentView('analyze');
    setTimeout(() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleAnalysisStart = async (file: File) => {
    await startAnalysis(file);
    setShowResults(true);
  };

  const handleNewAnalysis = () => {
    resetAnalysis();
    setShowResults(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection onScrollToUpload={scrollToUpload} />
            <DemoSection onStartTrial={() => setCurrentView('analyze')} />
            <div ref={uploadRef}>
              {!showResults ? (
                <UploadSection 
                  onAnalysisStart={handleAnalysisStart} 
                  isAnalyzing={isAnalyzing} 
                  progress={progress}
                  stageText={getStageText()}
                  error={error}
                />
              ) : analysis ? (
                <ResultsSection analysis={analysis} onNewAnalysis={handleNewAnalysis} />
              ) : null}
            </div>
          </>
        );
      case 'analyze':
        return (
          <div className="pt-20">
            {!showResults ? (
              <UploadSection 
                onAnalysisStart={handleAnalysisStart} 
                isAnalyzing={isAnalyzing} 
                progress={progress}
                stageText={getStageText()}
              />
            ) : analysis ? (
              <ResultsSection analysis={analysis} onNewAnalysis={handleNewAnalysis} />
            ) : null}
          </div>
        );
      case 'builds':
        return <BuildsSection />;
      case 'leaderboard':
        return <LeaderboardSection />;
      case 'profile':
        return <ProfileSection user={user} profile={profile} onStartAnalysis={scrollToUpload} />;
      case 'settings':
        return <ProfileSettings user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 border-2 border-orange-500 bg-orange-500/20 flex items-center justify-center">
                <Crosshair className="w-4 h-4 text-orange-500" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tighter" style={{ fontFamily: 'Black Ops One, cursive' }}>
                  COD<span className="text-orange-500">COACHING</span>
                </span>
              </div>
            </button>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', label: t('nav.home') },
                { id: 'analyze', label: t('nav.analyze') },
                { id: 'builds', label: t('nav.builds') },
                { id: 'leaderboard', label: t('nav.leaderboard') },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`px-4 py-2 font-mono text-sm tracking-wider transition-colors ${
                    currentView === item.id
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Hero Points Badge */}
                  <button
                    onClick={() => setCurrentView('settings')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all"
                    title="Hero Points"
                  >
                    <Zap className="w-4 h-4 fill-orange-500" />
                    <span className="text-sm font-bold font-mono">{heroPoints.toLocaleString()}</span>
                    <span className="text-xs font-mono text-orange-500/70 hidden sm:inline">HP</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('profile')}
                    className={`flex items-center gap-2 px-3 py-1 border ${
                      currentView === 'profile' 
                        ? 'border-orange-500 text-orange-500' 
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    } transition-colors`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-mono hidden sm:inline">{profile?.username || user.email?.split('@')[0]}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 border border-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-800 space-y-2">
              {[
                { id: 'home', label: t('nav.home') },
                { id: 'analyze', label: t('nav.analyze') },
                { id: 'builds', label: t('nav.builds') },
                { id: 'leaderboard', label: t('nav.leaderboard') },
                { id: 'profile', label: t('nav.profile') },
                { id: 'settings', label: 'SETTINGS' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as View);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 font-mono text-sm ${
                    currentView === item.id ? 'text-orange-500' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-orange-500 bg-orange-500/20 flex items-center justify-center">
                <Crosshair className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <span className="text-sm font-black" style={{ fontFamily: 'Black Ops One, cursive' }}>
                  COD<span className="text-orange-500">COACHING</span>
                </span>
                <p className="text-gray-600 text-xs font-mono">{t('footer.enterprise')}</p>
              </div>
            </div>
            <p className="text-gray-600 text-xs font-mono text-center">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      `}</style>
    </div>
  );
}

export default App;
