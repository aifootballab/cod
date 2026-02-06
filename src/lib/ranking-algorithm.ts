/**
 * COD COACHING - ALGORITMO DI RANKING INTELLIGENTE
 * 
 * Calcola un "Combat Score" che premia skill reale, non solo grind
 */

export interface PlayerStats {
  kd_ratio: number;
  accuracy: number;
  spm: number;
  win_rate: number;
  kills?: number;
  headshot_pct?: number;
}

export interface RankTier {
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  icon: string;
}

// Tier di rank basati sul Combat Score
export const RANK_TIERS: RankTier[] = [
  { name: 'ROOKIE', minScore: 0, maxScore: 40, color: '#6b7280', icon: '🥉' },
  { name: 'RECRUIT', minScore: 40, maxScore: 55, color: '#22c55e', icon: '🥉' },
  { name: 'VETERAN', minScore: 55, maxScore: 70, color: '#3b82f6', icon: '🥈' },
  { name: 'HARDENED', minScore: 70, maxScore: 80, color: '#a855f7', icon: '🥈' },
  { name: 'ELITE', minScore: 80, maxScore: 90, color: '#f59e0b', icon: '🥇' },
  { name: 'LEGEND', minScore: 90, maxScore: 97, color: '#ef4444', icon: '👑' },
  { name: 'TITAN', minScore: 97, maxScore: 100, color: '#ec4899', icon: '💎' },
];

/**
 * Calcola il Combat Score (0-100)
 * Formula ponderata che premia equilibrio tra skill
 */
export function calculateCombatScore(stats: PlayerStats): number {
  // Validazione dati
  const kd = Math.min(Math.max(stats.kd_ratio || 0, 0), 5); // Cap a 5.0
  const acc = Math.min(Math.max(stats.accuracy || 0, 0), 100);
  const spm = Math.min(Math.max(stats.spm || 0, 0), 1000);
  const wr = Math.min(Math.max(stats.win_rate || 0, 0), 100);
  
  // Pesi della formula (total 100%)
  const WEIGHTS = {
    kd: 0.35,      // 35% - Efficienza base
    accuracy: 0.25, // 25% - Precisione
    spm: 0.25,     // 25% - Attività/aggressività
    win_rate: 0.15, // 15% - Utilità team
  };
  
  // Normalizzazione (0-100)
  // K/D: 0.5 → 0 punti, 2.0 → 50 punti, 3.5+ → 100 punti
  const kdScore = normalize(kd, 0.5, 3.5, true);
  
  // Accuracy: lineare 0-100%
  const accScore = acc;
  
  // SPM: 200 → 0 punti, 400 → 50 punti, 700+ → 100 punti
  const spmScore = normalize(spm, 200, 700, true);
  
  // Win Rate: lineare ma con penalty se troppo basso
  const wrScore = wr;
  
  // Formula finale
  let combatScore = (
    kdScore * WEIGHTS.kd +
    accScore * WEIGHTS.accuracy +
    spmScore * WEIGHTS.spm +
    wrScore * WEIGHTS.win_rate
  );
  
  // Bonus/Malus per coerenza
  
  // Bonus "Sharpshooter": alta accuracy + buon K/D
  if (acc > 30 && kd > 1.5) {
    combatScore += 5;
  }
  
  // Bonus "Slayer": altissimo K/D + alto SPM
  if (kd > 2.0 && spm > 500) {
    combatScore += 8;
  }
  
  // Malus "Camper": K/D alto ma SPM basso
  if (kd > 1.5 && spm < 250) {
    combatScore -= 10;
  }
  
  // Malus "Inconsistent": accuracy bassa con K/D alto (lucky kills)
  if (acc < 15 && kd > 1.5) {
    combatScore -= 5;
  }
  
  return Math.min(Math.max(Math.round(combatScore), 0), 100);
}

/**
 * Normalizza un valore tra min e max in scala 0-100
 */
function normalize(value: number, min: number, max: number, cap: boolean = false): number {
  if (value <= min) return 0;
  if (cap && value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
}

/**
 * Ottiene il tier dal Combat Score
 */
export function getRankTier(score: number): RankTier {
  return RANK_TIERS.find(tier => score >= tier.minScore && score < tier.maxScore) || RANK_TIERS[0];
}

/**
 * Calcola posizione nella classifica globale
 */
export function calculateLeaderboardPosition(
  userScore: number,
  allScores: number[]
): { position: number; percentile: number; total: number } {
  const sorted = [...allScores, userScore].sort((a, b) => b - a);
  const position = sorted.indexOf(userScore) + 1;
  const percentile = Math.round((position / sorted.length) * 100);
  
  return {
    position,
    percentile: 100 - percentile, // Top X%
    total: sorted.length
  };
}

/**
 * Genera insights basati sulle stats
 */
export function generateInsights(stats: PlayerStats): string[] {
  const insights: string[] = [];
  
  if (stats.kd_ratio < 1.0) {
    insights.push('📉 K/D sotto 1.0 - Lavora sul posizionamento e cover');
  } else if (stats.kd_ratio > 2.0) {
    insights.push('🔥 Ottimo K/D! Sei un vero slayer');
  }
  
  if (stats.accuracy < 20) {
    insights.push('🎯 Accuracy bassa - Prova mirare un po\' più a lungo prima di sparare');
  } else if (stats.accuracy > 35) {
    insights.push('🎯 Sharpshooter! Accuracy eccezionale');
  }
  
  if (stats.spm < 250) {
    insights.push('🐌 SPM basso - Sei troppo passivo, prova a pushare di più');
  } else if (stats.spm > 500) {
    insights.push('⚡ SPM altissimo! Ritmo aggressivo ottimo');
  }
  
  if (stats.kd_ratio > 1.5 && stats.spm < 250) {
    insights.push('🐢 "Camping detected" - Hai buon K/D ma giochi troppo lento');
  }
  
  if (stats.win_rate < 40) {
    insights.push('📉 Win Rate basso - Focalizzati sugli obiettivi, non solo kills');
  }
  
  return insights;
}

/**
 * Calcola trend (miglioramento/peggioramento)
 */
export function calculateTrend(
  current: PlayerStats,
  previous: PlayerStats
): { direction: 'up' | 'down' | 'stable'; change: number } {
  const currentScore = calculateCombatScore(current);
  const previousScore = calculateCombatScore(previous);
  const change = currentScore - previousScore;
  
  if (Math.abs(change) < 2) {
    return { direction: 'stable', change };
  }
  return { direction: change > 0 ? 'up' : 'down', change };
}
