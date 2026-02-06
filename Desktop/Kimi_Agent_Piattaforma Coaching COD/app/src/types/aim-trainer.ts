// Tipi per l'Aim Trainer - Enterprise Architecture

export interface Crosshair {
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface Target {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  spawnTime: number;
  maxLifetime: number;
}

export interface JoystickData {
  angle: number;
  force: number;
  vector: {
    x: number;
    y: number;
  };
}

export interface ShotResult {
  hit: boolean;
  targetId?: string;
  reactionTime: number;
  distance: number;
  timestamp: number;
}

export interface TrainingSession {
  id: string;
  startTime: number;
  endTime?: number;
  shots: ShotResult[];
  targetsHit: number;
  targetsMissed: number;
  averageReactionTime: number;
  accuracy: number;
}

export interface AimTrainerConfig {
  sensitivity: number; // 1-10, come COD
  crosshairSize: number;
  crosshairColor: string;
  targetSpawnRate: number; // ms
  targetLifetime: number; // ms
  targetMinSize: number;
  targetMaxSize: number;
  maxTargets: number;
}

export const DEFAULT_CONFIG: AimTrainerConfig = {
  sensitivity: 5,
  crosshairSize: 20,
  crosshairColor: '#f59e0b', // amber-500
  targetSpawnRate: 1500,
  targetLifetime: 3000,
  targetMinSize: 30,
  targetMaxSize: 60,
  maxTargets: 5,
};

export const GameState = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
} as const;

export type GameStateType = typeof GameState[keyof typeof GameState];
