import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Achievements } from '@/components/Achievements';
import { ChatAI } from '@/components/ChatAI';
import { StatsChart } from '@/components/StatsChart';
import { User, Mail, Lock, Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ProfileSectionProps {
  user: SupabaseUser | null;
  profile: { username: string; rank: string } | null;
}

// Mock achievements
const mockAchievements = [
  { id: '1', name: 'First Blood', description: 'Completa la tua prima analisi', icon: 'target', category: 'stats', points: 100, unlocked: true, unlockedAt: '2024-01-15' },
  { id: '2', name: 'Positive K/D', description: 'Raggiungi un K/D superiore a 1.0', icon: 'trending', category: 'stats', points: 200, unlocked: true, unlockedAt: '2024-01-20' },
  { id: '3', name: 'Sharpshooter', description: 'Raggiungi accuracy superiore al 30%', icon: 'target', category: 'stats', points: 300, unlocked: false, progress: 24, target: 30 },
  { id: '4', name: 'Score Beast', description: 'Raggiungi SPM superiore a 400', icon: 'zap', category: 'stats', points: 400, unlocked: true, unlockedAt: '2024-02-01' },
  { id: '5', name: 'Arsenal', description: 'Prova 5 armi diverse', icon: 'award', category: 'mastery', points: 250, unlocked: false, progress: 3, target: 5 },
  { id: '6', name: 'Legend', description: 'Raggiungi rank LEGEND', icon: 'trophy', category: 'special', points: 1000, unlocked: false, progress: 320, target: 400 },
];

// Mock analysis history
const mockHistory = [
  { id: '1', created_at: '2024-01-15', kd_ratio: 0.85, accuracy: 18, spm: 245, win_rate: 48 },
  { id: '2', created_at: '2024-01-22', kd_ratio: 0.92, accuracy: 20, spm: 268, win_rate: 51 },
  { id: '3', created_at: '2024-02-01', kd_ratio: 1.05, accuracy: 22, spm: 295, win_rate: 54 },
  { id: '4', created_at: '2024-02-10', kd_ratio: 1.12, accuracy: 24, spm: 320, win_rate: 56 },
];

// Mock player stats for chat
const mockPlayerStats = {
  kd_ratio: 1.12,
  accuracy: 24,
  spm: 320,
  best_weapon: 'STRIKER',
};

export function ProfileSection({ user }: ProfileSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'chat'>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              <p className="text-gray-500 font-mono">{user.email}</p>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Trophy, label: t('profile.stats.analyses'), value: '12', color: 'text-yellow-500' },
                { icon: Target, label: t('profile.stats.favoriteWeapon'), value: 'STRIKER', color: 'text-orange-500' },
                { icon: TrendingUp, label: t('profile.stats.totalKills'), value: '45,230', color: 'text-emerald-500' },
                { icon: Clock, label: t('profile.stats.timePlayed'), value: '420H', color: 'text-blue-500' },
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
                <StatsChart history={mockHistory} type="kd" />
              </div>
              <div className="p-6 border border-gray-800 bg-[#111]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-500" />
                  ACCURACY PROGRESS
                </h3>
                <StatsChart history={mockHistory} type="accuracy" />
              </div>
            </div>

            {/* Recent History */}
            <div className="p-6 border border-gray-800 bg-[#111]">
              <h3 className="text-lg font-bold text-white mb-4">{t('profile.history.title')}</h3>
              <div className="space-y-2">
                {mockHistory.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 border border-gray-800 hover:border-gray-700 transition-colors">
                    <div>
                      <p className="text-gray-400 text-xs font-mono">{new Date(h.created_at).toLocaleDateString()}</p>
                      <p className="text-white font-mono">Analysis #{h.id}</p>
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
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="p-6 border border-gray-800 bg-[#111]">
            <Achievements achievements={mockAchievements} />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <ChatAI playerStats={mockPlayerStats} />
        )}
      </div>
    </section>
  );
}
