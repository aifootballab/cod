// ============================================
// TYPES - COD COACHING ELITE
// ============================================

export interface PlayerStats {
  kd_ratio: number;
  accuracy: number;
  spm: number;
  win_rate: number;
  total_kills: number;
  total_deaths: number;
  headshot_percent: number;
  play_time_hours: number;
  best_weapon: string;
  level: number;
  playstyle_detected: 'aggressive' | 'defensive' | 'balanced' | 'camper';
}

export interface WeaponAttachment {
  slot: string;
  name: string;
  pros: string[];
  cons: string[];
}

export interface WeaponBuild {
  id: string;
  weapon_name: string;
  build_name: string;
  description: string;
  category: 'assault_rifle' | 'smg' | 'lmg' | 'sniper' | 'shotgun' | 'marksman';
  attachments: WeaponAttachment[];
  stats: {
    damage: number;
    accuracy: number;
    range: number;
    fire_rate: number;
    mobility: number;
    control: number;
  };
  pros: string[];
  cons: string[];
  is_meta: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Analysis {
  id: string;
  extracted_stats: PlayerStats;
  recommended_builds: WeaponBuild[];
  ai_analysis: string;
  tips: string[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  rank: 'recruit' | 'regular' | 'hardened' | 'veteran' | 'elite' | 'legend';
  rank_progress: number;
  total_analyses: number;
  favorite_weapon?: string;
  playstyle: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  kd_ratio: number;
  accuracy: number;
  spm: number;
  rank_tier: string;
}
