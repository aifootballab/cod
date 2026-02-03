import { useTranslation } from 'react-i18next';
import { Leaderboard } from '@/components/Leaderboard';
import { Trophy } from 'lucide-react';

// Mock data - replace with real data from Supabase
const mockLeaderboardData = [
  { rank: 1, username: 'ProPlayer_ITA', kd_ratio: 3.45, accuracy: 38.5, spm: 685, rank_tier: 'LEGEND', country: '🇮🇹' },
  { rank: 2, username: 'SniperElite', kd_ratio: 3.12, accuracy: 42.3, spm: 620, rank_tier: 'LEGEND', country: '🇺🇸' },
  { rank: 3, username: 'RushMaster', kd_ratio: 2.98, accuracy: 35.8, spm: 720, rank_tier: 'ELITE', country: '🇬🇧' },
  { rank: 4, username: 'TacticalGod', kd_ratio: 2.85, accuracy: 41.2, spm: 595, rank_tier: 'ELITE', country: '🇩🇪' },
  { rank: 5, username: 'HeadshotKing', kd_ratio: 2.76, accuracy: 45.6, spm: 540, rank_tier: 'ELITE', country: '🇫🇷' },
  { rank: 6, username: 'CamperNoob', kd_ratio: 2.54, accuracy: 33.4, spm: 380, rank_tier: 'VETERAN', country: '🇪🇸' },
  { rank: 7, username: 'SMG_Fanatic', kd_ratio: 2.43, accuracy: 36.7, spm: 645, rank_tier: 'VETERAN', country: '🇧🇷' },
  { rank: 8, username: 'AR_Master', kd_ratio: 2.38, accuracy: 39.2, spm: 580, rank_tier: 'VETERAN', country: '🇯🇵' },
  { rank: 9, username: 'QuickScopez', kd_ratio: 2.21, accuracy: 44.1, spm: 495, rank_tier: 'HARDENED', country: '🇰🇷' },
  { rank: 10, username: 'TryHard_99', kd_ratio: 2.15, accuracy: 34.8, spm: 610, rank_tier: 'HARDENED', country: '🇨🇦' },
];

export function LeaderboardSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-yellow-500/30 bg-yellow-500/5">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-400 text-xs font-mono tracking-widest">GLOBAL RANKING</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            {t('leaderboard.title')}
          </h2>
          <p className="text-gray-500 text-lg">{t('leaderboard.subtitle')}</p>
        </div>

        {/* Leaderboard */}
        <Leaderboard data={mockLeaderboardData} />
      </div>
    </section>
  );
}
