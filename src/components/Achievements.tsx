import { useTranslation } from 'react-i18next';
import { Trophy, Target, Zap, TrendingUp, Award, Star, Flame, Shield } from 'lucide-react';

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

interface AchievementsProps {
  achievements: Achievement[];
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  target: Target,
  zap: Zap,
  trending: TrendingUp,
  award: Award,
  star: Star,
  flame: Flame,
  shield: Shield,
};

const categoryColors: Record<string, string> = {
  stats: 'border-emerald-500/50 bg-emerald-500/10',
  mastery: 'border-purple-500/50 bg-purple-500/10',
  special: 'border-yellow-500/50 bg-yellow-500/10',
};

export function Achievements({ achievements }: AchievementsProps) {
  const { t } = useTranslation();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="w-full">
      {/* Stats Header */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-4xl font-black text-orange-500" style={{ fontFamily: 'Black Ops One, cursive' }}>
            {unlockedCount}/{achievements.length}
          </div>
          <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">
            {t('profile.achievements.unlocked')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-yellow-500" style={{ fontFamily: 'Black Ops One, cursive' }}>
            {totalPoints}
          </div>
          <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">
            POINTS
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-gray-800 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 font-mono mt-2">
          <span>0%</span>
          <span>{Math.round((unlockedCount / achievements.length) * 100)}% COMPLETE</span>
          <span>100%</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const isLocked = !achievement.unlocked;

          return (
            <div
              key={achievement.id}
              className={`relative p-4 border ${
                isLocked
                  ? 'border-gray-800 bg-gray-900/30 opacity-60'
                  : categoryColors[achievement.category] || 'border-orange-500/50 bg-orange-500/10'
              } transition-all hover:scale-105`}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-50" />

              {/* Lock overlay */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-2xl">🔒</span>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 border flex items-center justify-center mb-3 ${
                    isLocked ? 'border-gray-700 text-gray-600' : 'border-current'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h4 className={`text-sm font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                  {achievement.name}
                </h4>

                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {achievement.description}
                </p>

                {/* Progress for locked achievements */}
                {isLocked && achievement.progress !== undefined && achievement.target && (
                  <div className="w-full mt-2">
                    <div className="h-1 bg-gray-800">
                      <div
                        className="h-full bg-gray-600"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 font-mono mt-1">
                      {achievement.progress}/{achievement.target}
                    </p>
                  </div>
                )}

                {/* Points */}
                <div className="mt-2">
                  <span
                    className={`text-xs font-mono ${
                      isLocked ? 'text-gray-600' : 'text-yellow-500'
                    }`}
                  >
                    +{achievement.points} PTS
                  </span>
                </div>

                {/* Unlock date */}
                {!isLocked && achievement.unlockedAt && (
                  <p className="text-xs text-gray-600 font-mono mt-1">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
