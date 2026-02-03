// Telemetria Avanzata per Aim Trainer

export interface CrosshairTelemetry {
  timestamp: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  acceleration: number;
  direction: number; // angolo in gradi
}

export interface ShotTelemetry {
  timestamp: number;
  targetX: number;
  targetY: number;
  shotX: number;
  shotY: number;
  distanceFromCenter: number;
  reactionTime: number;
  targetZone: 'center' | 'left' | 'right' | 'top' | 'bottom';
  hit: boolean;
}

export interface MovementPattern {
  type: 'smooth' | 'jerky' | 'circular' | 'linear';
  consistency: number; // 0-100
  overCorrection: boolean;
  preferredDirection: 'horizontal' | 'vertical' | 'mixed';
}

export interface PlayerProfile {
  reactionTime: {
    average: number;
    fastest: number;
    slowest: number;
    byZone: {
      center: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
  precision: {
    overall: number;
    byDistance: {
      close: number; // 0-100px
      medium: number; // 100-200px
      far: number; // >200px
    };
    byZone: {
      center: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
  movement: MovementPattern;
  speed: {
    averageVelocity: number;
    peakVelocity: number;
    accelerationPattern: 'aggressive' | 'controlled' | 'slow';
  };
}

export interface WeaponRecommendation {
  weaponId: string;
  weaponName: string;
  category: string;
  confidence: number; // 0-100
  reasons: string[];
  suggestedAttachments: string[];
  playstyle: string;
}

export interface SettingsRecommendation {
  sensitivity: {
    current: number;
    suggested: number;
    reason: string;
  };
  adsSensitivity?: {
    suggested: number;
    reason: string;
  };
  fov?: {
    suggested: number;
    reason: string;
  };
}

export interface AIAnalysisResult {
  playerProfile: PlayerProfile;
  primaryWeapon: WeaponRecommendation;
  secondaryWeapon?: WeaponRecommendation;
  settings: SettingsRecommendation;
  tips: string[];
  trainingFocus: string[];
  overallRating: 'S' | 'A' | 'B' | 'C' | 'D';
}

// Dati grezzi raccolti durante una sessione
export interface RawTelemetryData {
  crosshairPath: CrosshairTelemetry[];
  shots: ShotTelemetry[];
  sessionDuration: number;
  targetsSpawned: number;
  targetsHit: number;
}
