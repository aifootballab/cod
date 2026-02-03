import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Target, Zap } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  kd_ratio: number;
  accuracy: number;
  spm: number;
  rank_tier: string;
  country?: string;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const getRankColor = (tier: string): string => {
  const colors: Record<string, string> = {
    'LEGEND': 'text-yellow-400 border-yellow-400',
    'ELITE': 'text-purple-400 border-purple-400',
    'VETERAN': 'text-emerald-400 border-emerald-400',
    'HARDENED': 'text-blue-400 border-blue-400',
    'REGULAR': 'text-gray-400 border-gray-400',
    'RECRUIT': 'text-amber-700 border-amber-700',
  };
  return colors[tier] || 'text-gray-400 border-gray-400';
};

const getRankBg = (tier: string): string => {
  const colors: Record<string, string> = {
    'LEGEND': 'bg-yellow-400/10',
    'ELITE': 'bg-purple-400/10',
    'VETERAN': 'bg-emerald-400/10',
    'HARDENED': 'bg-blue-400/10',
    'REGULAR': 'bg-gray-400/10',
    'RECRUIT': 'bg-amber-700/10',
  };
  return colors[tier] || 'bg-gray-400/10';
};

export function Leaderboard({ data }: LeaderboardProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'global' | 'monthly' | 'weekly'>('global');

  const filteredData = data.slice(0, 100);

  return (
    <div className="w-full">
      {/* Period Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {(['global', 'monthly', 'weekly'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-2 border font-mono text-sm tracking-wider transition-all ${
              period === p
                ? 'border-orange-500 bg-orange-500 text-black font-bold'
                : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600'
            }`}
          >
            {t(`leaderboard.tabs.${p}`)}
          </button>
        ))}
      </div>

      {/* Podium - Top 3 */}
      <div className="flex justify-center gap-4 mb-8">
        {filteredData.slice(0, 3).map((entry, idx) => {
          const positions = [
            { order: 2, height: 'h-32', medal: '🥈' },
            { order: 1, height: 'h-40', medal: '🥇' },
            { order: 3, height: 'h-28', medal: '🥉' },
          ];
          const pos = positions[idx];
          
          return (
            <div
              key={entry.username}
              className={`flex flex-col items-center ${pos.order === 1 ? 'order-first' : ''}`}
            >
              <div className={`w-16 h-16 border-2 ${getRankColor(entry.rank_tier)} ${getRankBg(entry.rank_tier)} flex items-center justify-center text-2xl mb-2`}>
                {pos.medal}
              </div>
              <div className={`w-24 ${pos.height} border-x border-t border-gray-700 bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center justify-end pb-4`}>
                <span className="text-white font-bold text-sm text-center px-1">{entry.username}</span>
                <span className="text-orange-400 font-mono text-xs">{entry.kd_ratio.toFixed(2)} K/D</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-900 border-b border-gray-800 text-xs font-mono text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">{t('leaderboard.columns.rank')}</div>
          <div className="col-span-4">{t('leaderboard.columns.player')}</div>
          <div className="col-span-2 text-center">{t('leaderboard.columns.kd')}</div>
          <div className="col-span-2 text-center">{t('leaderboard.columns.accuracy')}</div>
          <div className="col-span-2 text-center">{t('leaderboard.columns.spm')}</div>
          <div className="col-span-1 text-center">TIER</div>
        </div>

        {/* Rows */}
        {filteredData.map((entry) => (
          <div
            key={entry.username}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
          >
            <div className="col-span-1 flex items-center">
              {entry.rank <= 3 ? (
                <span className="text-xl">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="text-gray-500 font-mono">#{entry.rank}</span>
              )}
            </div>
            <div className="col-span-4 flex items-center gap-3">
              <div className={`w-8 h-8 border ${getRankColor(entry.rank_tier)} ${getRankBg(entry.rank_tier)} flex items-center justify-center text-xs font-bold`}>
                {entry.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-white font-medium">{entry.username}</span>
                {entry.country && (
                  <span className="text-gray-500 text-xs ml-2">{entry.country}</span>
                )}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className={`font-mono font-bold ${entry.kd_ratio >= 1.5 ? 'text-emerald-400' : entry.kd_ratio >= 1 ? 'text-white' : 'text-red-400'}`}>
                {entry.kd_ratio.toFixed(2)}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2">
              <Target className="w-4 h-4 text-cyan-500" />
              <span className="font-mono text-white">{entry.accuracy.toFixed(1)}%</span>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="font-mono text-white">{entry.spm}</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span className={`text-xs font-bold ${getRankColor(entry.rank_tier).split(' ')[0]}`}>
                {entry.rank_tier}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
