import { useTranslation } from 'react-i18next';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardPlayer {
  rank: number;
  username: string;
  kd_ratio: number;
  accuracy: number;
  spm: number;
}

interface LeaderboardProps {
  data: LeaderboardPlayer[];
}

export function Leaderboard({ data }: LeaderboardProps) {
  const { t } = useTranslation();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <span className="text-gray-500 font-mono w-5 text-center">{rank}</span>;
  };

  return (
    <div className="bg-zinc-900/50 border border-orange-600/30 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-orange-600/10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-orange-500 uppercase">{t('leaderboard.rank')}</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-orange-500 uppercase">{t('leaderboard.player')}</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-orange-500 uppercase">K/D</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-orange-500 uppercase">{t('leaderboard.accuracy')}</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-orange-500 uppercase">SPM</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player) => (
            <tr key={player.rank} className="border-t border-orange-600/10 hover:bg-orange-600/5">
              <td className="px-4 py-3">
                <div className="flex items-center justify-center">
                  {getRankIcon(player.rank)}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-white font-mono text-sm">{player.username}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-orange-400 font-mono text-sm">{player.kd_ratio.toFixed(2)}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-orange-400 font-mono text-sm">{player.accuracy}%</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-orange-400 font-mono text-sm">{player.spm}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
