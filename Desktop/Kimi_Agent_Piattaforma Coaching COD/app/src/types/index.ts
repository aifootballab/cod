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
  playstyle_detected?: string;
}
