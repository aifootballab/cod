import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Zap, TrendingUp, Clock, Trophy, Award } from 'lucide-react';
import { Achievements } from '@/components/Achievements';
import { ChatAI } from '@/components/ChatAI';
import { StatsChart } from '@/components/StatsChart';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ProfileSectionProps {
  user: SupabaseUser | null;
  profile: { username: string; rank: string } | null;
}

// Mock achievements
const mockAchievements = [
  { id: '1', name: 'First Blood', description: 'Completa la tua prima analisi', icon: 'target', category: 'stats' as const, points: 100, unlocked: true, unlockedAt: '2024-01-15' },
  { id: '2', name: 'Positive K/D', description: 'Raggiungi un K/D superiore a 1.0', icon: 'trending', category: 'stats' as const, points: 200, unlocked: true, unlockedAt: '2024-01-20' },
  { id: '3', name: 'Sharpshooter', description: 'Raggiungi accuracy superiore al 30%', icon: 'target', category: 'stats' as const, points: 300, unlocked: false, progress: 24, target: 30 },
  { id: '4', name: 'Score Beast', description: 'Raggiungi SPM superiore a 400', icon: 'zap', category: 'stats' as const, points: 400, unlocked: true, unlockedAt: '2024-02-01' },
  { id: '5', name: 'Arsenal', description: 'Prova 5 armi diverse', icon: 'award', category: 'mastery' as const, points: 250, unlocked: false, progress: 3, target: 5 },
  { id: '6', name: 'Legend', description: 'Raggiungi rank LEGEND', icon: 'trophy', category: 'special' as const, points: 1000, unlocked: false, progress: 320, target: 400 },
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

  if (!user) {
    return (
      <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center">
              <Target className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
              ACCEDI
            </h2>
            <p className="text-gray-500">{t('profile.loginPrompt')}</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-[#111] border border-gray-800 text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#111] border border-gray-800 text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold tracking-widest">
              {t('nav.login')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            {t('nav.profile')}
          </h2>
          <p className="text-gray-500">{t('profile.manageAccount')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="p-6 border border-gray-800 bg-[#111]">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                {t('stats.overview')}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'K/D', value: '1.12', trend: '+0.05' },
                  { label: t('stats.accuracy'), value: '24%', trend: '+2%' },
                  { label: 'SPM', value: '320', trend: '+15' },
                  { label: t('stats.winRate'), value: '56%', trend: '+3%' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 border border-gray-800 bg-[#0a0a0a] text-center">
                    <p className="text-gray-500 text-xs font-mono mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>
                      {stat.value}
                    </p>
                    <p className="text-emerald-400 text-xs">{stat.trend}</p>
                  </div>
                ))}
              </div>

              <StatsChart history={mockHistory} />
            </div>

            {/* Achievements */}
            <div className="p-6 border border-gray-800 bg-[#111]">
              <h3 className="text-xl font-bold text-white mb-6">{t('profile.achievements')}</h3>
              <Achievements achievements={mockAchievements} />
            </div>
          </div>

          {/* Right Column - Chat & Info */}
          <div className="space-y-8">
            {/* AI Coach Chat */}
            <div className="p-6 border border-orange-500/30 bg-orange-500/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                AI Coach
              </h3>
              <ChatAI playerStats={mockPlayerStats} />
            </div>

            {/* Account Info */}
            <div className="p-6 border border-gray-800 bg-[#111]">
              <h3 className="text-lg font-bold text-white mb-4">{t('profile.accountInfo')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-gray-500 text-sm">{t('profile.memberSince')}</p>
                    <p className="text-white font-mono">2024-01-15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
