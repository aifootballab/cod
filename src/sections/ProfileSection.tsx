import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Achievements } from '@/components/Achievements';
import { ChatAI } from '@/components/ChatAI';
import { StatsChart } from '@/components/StatsChart';
import { User, Mail, Lock, Trophy, Target, TrendingUp, Clock, Crosshair, Zap, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ProfileSectionProps {
  user: SupabaseUser | null;
  profile: { username: string; rank: string } | null;
  onStartAnalysis?: () => void;
}

interface AnalysisRecord {
  id: string;
  created_at: string;
  kd_ratio: number;
  accuracy: number;
  spm: number;
  win_rate: number;
  kills?: number;
  best_weapon?: string;
  play_time?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'stats' | 'mastery' | 'special';
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export function ProfileSection({ user, profile, onStartAnalysis }: ProfileSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'chat'>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    favoriteWeapon: '-',
    totalKills: 0,
    timePlayed: '-',
  });
  const [achievements, setAchievements] = useState<any[]>([]);

  // Fetch real data from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch analysis history
      const { data: historyData } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (historyData) {
        setAnalysisHistory(historyData);
        
        // Calculate stats
        setStats({
          totalAnalyses: historyData.length,
          favoriteWeapon: historyData[0]?.best_weapon || '-',
          totalKills: historyData.reduce((acc: number, h: AnalysisRecord) => acc + (h.kills || 0), 0),
          timePlayed: historyData[0]?.play_time || '-',
        });
      }

      // Fetch achievements (if table exists)
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (achievementsData) {
        setAchievements(achievementsData);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
              {t('nav.login')}
            </h2>
            <p className="text-gray-500">Accedi per salvare le tue analisi</p>
          </div>

          <div className="border border-gray-800 bg-[#111] p-8">
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-mono uppercase">Email</label>
                <div className="flex items-center border border-gray-700 bg-gray-900 mt-1">
                  <Mail className="w-5 h-5 text-gray-600 ml-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-white focus:outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-xs font-mono uppercase">Password</label>
                <div className="flex items-center border border-gray-700 bg-gray-900 mt-1">
                  <Lock className="w-5 h-5 text-gray-600 ml-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-white focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button className="w-full py-3 bg-orange-500 text-black font-bold font-mono tracking-wider hover:bg-orange-400 transition-colors">
                ACCEDI
              </button>

              <div className="text-center">
                <span className="text-gray-600 text-sm">oppure</span>
              </div>

              <button className="w-full py-3 border border-gray-700 text-gray-400 font-mono hover:border-white hover:text-white transition-colors">
                Continua con Google
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-gray-800 bg-[#111]">
      <div className="w-20 h-20 border-2 border-orange-500/30 bg-orange-500/10 flex items-center justify-center mb-6">
        <Upload className="w-10 h-10 text-orange-500/50" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Black Ops One, cursive' }}>
        NESSUNA ANALISI TROVATA
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        Non hai ancora caricato nessuna statistica. Inizia la tua prima analisi per sbloccare il tuo profilo operativo.
      </p>
      <button
        onClick={onStartAnalysis}
        className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold font-mono tracking-wider transition-colors"
      >
        <Crosshair className="w-5 h-5" />
        INIZIA PRIMA ANALISI
      </button>
    </div>
  );

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 border-2 border-orange-500 bg-orange-500/20 flex items-center justify-center">
              <User className="w-10 h-10 text-orange-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                {t('profile.title')}
              </h2>
              <p className="text-gray-500 font-mono">{profile?.username || user.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'achievements', label: 'ACHIEVEMENTS' },
              { id: 'chat', label: 'AI COACH' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 border font-mono text-sm tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'border-orange-500 bg-orange-500 text-black font-bold'
                    : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {analysisHistory.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Trophy, label: t('profile.stats.analyses'), value: stats.totalAnalyses.toString(), color: 'text-yellow-500' },
                    { icon: Target, label: t('profile.stats.favoriteWeapon'), value: stats.favoriteWeapon, color: 'text-orange-500' },
                    { icon: TrendingUp, label: t('profile.stats.totalKills'), value: stats.totalKills.toLocaleString(), color: 'text-emerald-500' },
                    { icon: Clock, label: t('profile.stats.timePlayed'), value: stats.timePlayed, color: 'text-blue-500' },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 border border-gray-800 bg-[#111]">
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                      <p className="text-gray-500 text-xs font-mono uppercase">{stat.label}</p>
                      <p className="text-2xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-800 bg-[#111]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      K/D PROGRESS
                    </h3>
                    <StatsChart history={analysisHistory} type="kd" />
                  </div>
                  <div className="p-6 border border-gray-800 bg-[#111]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-500" />
                      ACCURACY PROGRESS
                    </h3>
                    <StatsChart history={analysisHistory} type="accuracy" />
                  </div>
                </div>

                {/* Recent History */}
                <div className="p-6 border border-gray-800 bg-[#111]">
                  <h3 className="text-lg font-bold text-white mb-4">{t('profile.history.title')}</h3>
                  <div className="space-y-2">
                    {analysisHistory.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-3 border border-gray-800 hover:border-gray-700 transition-colors">
                        <div>
                          <p className="text-gray-400 text-xs font-mono">{new Date(h.created_at).toLocaleDateString()}</p>
                          <p className="text-white font-mono">Analysis #{h.id.slice(-4)}</p>
                        </div>
                        <div className="flex gap-4 text-sm font-mono">
                          <span className="text-orange-400">K/D: {h.kd_ratio}</span>
                          <span className="text-cyan-400">ACC: {h.accuracy}%</span>
                          <span className="text-green-400">SPM: {h.spm}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="p-6 border border-gray-800 bg-[#111]">
            {(achievements as Achievement[]).length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">NESSUN ACHIEVEMENT</h3>
                <p className="text-gray-500">Completa analisi per sbloccare achievement</p>
              </div>
            ) : (
              <Achievements achievements={achievements as Achievement[]} />
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          analysisHistory.length === 0 ? (
            <EmptyState />
          ) : (
            <ChatAI playerStats={{
              kd_ratio: analysisHistory[0].kd_ratio,
              accuracy: analysisHistory[0].accuracy,
              spm: analysisHistory[0].spm,
              best_weapon: analysisHistory[0].best_weapon || 'Unknown'
            }} />
          )
        )}
      </div>
    </section>
  );
}
