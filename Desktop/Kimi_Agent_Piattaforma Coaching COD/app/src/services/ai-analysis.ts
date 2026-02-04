import type { 
  RawTelemetryData, 
  PlayerProfile, 
  AIAnalysisResult,
  WeaponRecommendation,
  SettingsRecommendation
} from '@/types/aim-analytics';
import { ALL_WEAPONS, type Weapon } from '@/data/weapons-mw3-full';

// Analisi locale (senza chiamare l'API per ora)
export function analyzePlayerProfile(data: RawTelemetryData): PlayerProfile {
  const shots = data.shots;
  
  if (shots.length === 0) {
    return createDefaultProfile();
  }

  // Analisi tempo di reazione
  const reactionTimes = shots.map(s => s.reactionTime);
  const avgReaction = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  const fastest = Math.min(...reactionTimes);
  const slowest = Math.max(...reactionTimes);

  // Reazione per zona
  const byZone = {
    center: calculateAvgReaction(shots.filter(s => s.targetZone === 'center')),
    left: calculateAvgReaction(shots.filter(s => s.targetZone === 'left')),
    right: calculateAvgReaction(shots.filter(s => s.targetZone === 'right')),
    top: calculateAvgReaction(shots.filter(s => s.targetZone === 'top')),
    bottom: calculateAvgReaction(shots.filter(s => s.targetZone === 'bottom')),
  };

  // Precisione
  const hits = shots.filter(s => s.hit).length;
  const overallPrecision = (hits / shots.length) * 100;

  // Precisione per distanza
  const closeShots = shots.filter(s => s.distanceFromCenter < 100);
  const mediumShots = shots.filter(s => s.distanceFromCenter >= 100 && s.distanceFromCenter < 200);
  const farShots = shots.filter(s => s.distanceFromCenter >= 200);

  const byDistance = {
    close: closeShots.length > 0 ? (closeShots.filter(s => s.hit).length / closeShots.length) * 100 : 0,
    medium: mediumShots.length > 0 ? (mediumShots.filter(s => s.hit).length / mediumShots.length) * 100 : 0,
    far: farShots.length > 0 ? (farShots.filter(s => s.hit).length / farShots.length) * 100 : 0,
  };

  // Precisione per zona
  const precisionByZone = {
    center: calculatePrecision(shots.filter(s => s.targetZone === 'center')),
    left: calculatePrecision(shots.filter(s => s.targetZone === 'left')),
    right: calculatePrecision(shots.filter(s => s.targetZone === 'right')),
    top: calculatePrecision(shots.filter(s => s.targetZone === 'top')),
    bottom: calculatePrecision(shots.filter(s => s.targetZone === 'bottom')),
  };

  // Velocità media
  const path = data.crosshairPath;
  const velocities = path.map(p => Math.sqrt(p.velocityX ** 2 + p.velocityY ** 2));
  const avgVelocity = velocities.length > 0 
    ? velocities.reduce((a, b) => a + b, 0) / velocities.length 
    : 0;
  const peakVelocity = velocities.length > 0 ? Math.max(...velocities) : 0;

  // Pattern accelerazione
  const accelerations = path.map(p => p.acceleration);
  const avgAcceleration = accelerations.length > 0
    ? accelerations.reduce((a, b) => a + b, 0) / accelerations.length
    : 0;

  let accelerationPattern: 'aggressive' | 'controlled' | 'slow' = 'controlled';
  if (avgAcceleration > 500) accelerationPattern = 'aggressive';
  else if (avgAcceleration < 100) accelerationPattern = 'slow';

  // Pattern movimento (semplificato)
  const movement = analyzeMovementPattern(path);

  return {
    reactionTime: {
      average: Math.round(avgReaction),
      fastest: Math.round(fastest),
      slowest: Math.round(slowest),
      byZone,
    },
    precision: {
      overall: Math.round(overallPrecision),
      byDistance,
      byZone: precisionByZone,
    },
    movement,
    speed: {
      averageVelocity: Math.round(avgVelocity),
      peakVelocity: Math.round(peakVelocity),
      accelerationPattern,
    },
  };
}

function createDefaultProfile(): PlayerProfile {
  return {
    reactionTime: {
      average: 300,
      fastest: 250,
      slowest: 400,
      byZone: { center: 280, left: 320, right: 310, top: 300, bottom: 290 },
    },
    precision: {
      overall: 60,
      byDistance: { close: 80, medium: 60, far: 40 },
      byZone: { center: 70, left: 50, right: 55, top: 60, bottom: 58 },
    },
    movement: {
      type: 'linear',
      consistency: 50,
      overCorrection: false,
      preferredDirection: 'mixed',
    },
    speed: {
      averageVelocity: 200,
      peakVelocity: 500,
      accelerationPattern: 'controlled',
    },
  };
}

function calculateAvgReaction(shots: { reactionTime: number }[]): number {
  if (shots.length === 0) return 0;
  return Math.round(shots.reduce((a, s) => a + s.reactionTime, 0) / shots.length);
}

function calculatePrecision(shots: { hit: boolean }[]): number {
  if (shots.length === 0) return 0;
  return Math.round((shots.filter(s => s.hit).length / shots.length) * 100);
}

function analyzeMovementPattern(path: { acceleration: number; direction: number }[]) {
  if (path.length < 10) {
    return {
      type: 'linear' as const,
      consistency: 50,
      overCorrection: false,
      preferredDirection: 'mixed' as const,
    };
  }

  const accelerations = path.map(p => p.acceleration);
  const avgAccel = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;
  const maxAccel = Math.max(...accelerations);

  let type: 'smooth' | 'jerky' | 'linear' = 'linear';
  if (maxAccel > avgAccel * 5) type = 'jerky';
  else if (avgAccel < 100) type = 'smooth';

  // Calcola consistenza
  const velocities = path.map(p => p.acceleration);
  const avg = velocities.reduce((a, b) => a + b, 0) / velocities.length || 1;
  const variance = velocities.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / velocities.length;
  const consistency = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) / avg) * 50));

  return {
    type,
    consistency: Math.round(consistency),
    overCorrection: maxAccel > avgAccel * 4,
    preferredDirection: 'mixed' as const,
  };
}

// Trova le armi migliori basate sul profilo
export function recommendWeapons(profile: PlayerProfile): {
  primary: WeaponRecommendation;
  secondary?: WeaponRecommendation;
} {
  const { reactionTime, precision, speed, movement } = profile;

  // Logica di raccomandazione
  let recommendedWeapons: Weapon[] = [];

  // Giocatore preciso e reattivo → Cecchini o Marksman
  if (precision.overall > 75 && reactionTime.average < 250) {
    recommendedWeapons = ALL_WEAPONS.filter((w: Weapon) => 
      w.category === 'sniper' || w.category === 'marksman'
    );
  }
  // Giocatore veloce e aggressivo → SMG
  else if (speed.accelerationPattern === 'aggressive' && reactionTime.average < 280) {
    recommendedWeapons = ALL_WEAPONS.filter((w: Weapon) => w.category === 'smg');
  }
  // Giocatore bilanciato con buona precisione a media distanza → AR
  else if (precision.byDistance.medium > 60) {
    recommendedWeapons = ALL_WEAPONS.filter((w: Weapon) => w.category === 'assault');
  }
  // Giocatore con movimento controllato → LMG
  else if (movement.type === 'smooth' && speed.accelerationPattern === 'controlled') {
    recommendedWeapons = ALL_WEAPONS.filter((w: Weapon) => w.category === 'lmg');
  }
  // Default: AR versatili
  else {
    recommendedWeapons = ALL_WEAPONS.filter((w: Weapon) => w.category === 'assault' && w.tier === 'A');
  }

  // Seleziona la migliore
  const primary = selectBestWeapon(recommendedWeapons, profile);
  const secondary = selectSecondaryWeapon(profile, primary);

  return {
    primary: createWeaponRec(primary, profile),
    secondary: secondary ? createWeaponRec(secondary, profile) : undefined,
  };
}

function selectBestWeapon(candidates: Weapon[], profile: PlayerProfile): Weapon {
  if (candidates.length === 0) {
    return ALL_WEAPONS.find((w: Weapon) => w.id === 'm4') || ALL_WEAPONS[0];
  }

  // Score per ogni arma
  const scored = candidates.map(weapon => {
    let score = 0;

    // Bonus tier
    const tierBonus: Record<string, number> = { S: 30, A: 20, B: 10, C: 5, D: 0, F: 0 };
    score += tierBonus[weapon.tier] || 0;

    // Match con playstyle
    if (profile.reactionTime.average < 250 && weapon.ttk.close < 200) {
      score += 20; // Arma veloce per giocatore reattivo
    }

    if (profile.precision.overall > 70 && weapon.recoilVertical < 6) {
      score += 15; // Rinculo basso per giocatore preciso
    }

    if (profile.speed.accelerationPattern === 'aggressive' && weapon.adsTime < 250) {
      score += 20; // ADS veloce per giocatore aggressivo
    }

    return { weapon, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].weapon;
}

function selectSecondaryWeapon(_profile: PlayerProfile, primary: Weapon): Weapon | null {
  // Se primaria è cecchino, secondaria deve essere per corto raggio
  if (primary.category === 'sniper') {
    const smgs = ALL_WEAPONS.filter((w: Weapon) => w.category === 'smg' && w.tier === 'A');
    return smgs[0] || null;
  }

  // Se primaria è SMG, secondaria per media distanza
  if (primary.category === 'smg') {
    const pistols = ALL_WEAPONS.filter((w: Weapon) => w.category === 'pistol' && w.tier === 'A');
    return pistols[0] || null;
  }

  return null;
}

function createWeaponRec(weapon: Weapon, profile: PlayerProfile): WeaponRecommendation {
  const reasons: string[] = [];

  if (weapon.tier === 'S') {
    reasons.push('Arma top tier del meta attuale');
  }

  if (profile.reactionTime.average < 250 && weapon.fireRateRPM > 800) {
    reasons.push('Rateo di fuoco elevato perfetto per la tua reazione rapida');
  }

  if (profile.precision.overall > 70 && weapon.recoilVertical < 6) {
    reasons.push('Rinculo controllabile che si adatta alla tua precisione');
  }

  if (weapon.ttk.close < 250) {
    reasons.push('TTK competitivo per scontri ravvicinati');
  }

  if (weapon.adsTime < 250) {
    reasons.push('Mira veloce (ADS) per gameplay aggressivo');
  }

  // Suggerimenti attachments
  const attachments: string[] = [];
  if (profile.precision.overall < 60) {
    attachments.push('Ottica precisa (Reflex/VLK)');
    attachments.push('Compensatore per stabilità');
  }
  if (profile.speed.accelerationPattern === 'aggressive') {
    attachments.push('Canna corta per mobilità');
    attachments.push('Impugnatura per ADS rapido');
  }
  if (weapon.category === 'assault' || weapon.category === 'lmg') {
    attachments.push('Caricatore esteso');
  }

  // Playstyle
  let playstyle = 'Versatile';
  if (weapon.category === 'smg') playstyle = 'Aggressivo/Rush';
  if (weapon.category === 'sniper') playstyle = 'Precisione/Long range';
  if (weapon.category === 'lmg') playstyle = 'Supporto/Area denial';

  return {
    weaponId: weapon.id,
    weaponName: weapon.name,
    category: weapon.category,
    confidence: calculateConfidence(weapon, profile),
    reasons,
    suggestedAttachments: attachments,
    playstyle,
  };
}

function calculateConfidence(weapon: Weapon, profile: PlayerProfile): number {
  let confidence = 70;

  // Aumenta confidence se match è forte
  if (weapon.tier === 'S') confidence += 15;
  if (profile.precision.overall > 70 && weapon.recoilVertical < 5) confidence += 10;
  if (profile.reactionTime.average < 250 && weapon.fireRateRPM > 800) confidence += 10;

  return Math.min(98, confidence);
}

// Suggerimenti impostazioni
export function recommendSettings(profile: PlayerProfile): SettingsRecommendation {
  const { reactionTime, precision, speed } = profile;

  // Sensibilità base
  let suggestedSens = 5;
  let reason = 'Sensibilità bilanciata per iniziare';

  if (precision.overall > 70 && speed.accelerationPattern === 'controlled') {
    suggestedSens = 4;
    reason = 'Precisione alta e movimento controllato: sensibilità moderata per maggiore accuratezza';
  } else if (speed.accelerationPattern === 'aggressive' && reactionTime.average < 250) {
    suggestedSens = 6;
    reason = 'Reazione rapida e stile aggressivo: sensibilità più alta per flick shot';
  } else if (precision.overall < 50) {
    suggestedSens = 3;
    reason = 'Precisione in sviluppo: sensibilità più bassa per migliorare il controllo';
  }

  // ADS sensitivity
  let suggestedADSSens = 0.8;
  if (precision.overall > 75) {
    suggestedADSSens = 1.0;
  } else if (precision.overall < 50) {
    suggestedADSSens = 0.6;
  }

  // FOV
  let suggestedFOV = 100;
  if (speed.accelerationPattern === 'aggressive') {
    suggestedFOV = 110;
    reason += '. FOV ampio per maggiore consapevolezza situazionale';
  }

  return {
    sensitivity: {
      current: 5,
      suggested: suggestedSens,
      reason,
    },
    adsSensitivity: {
      suggested: suggestedADSSens,
      reason: precision.overall > 70 
        ? 'ADSens 1:1 per precisione massima' 
        : 'ADSens ridotto per maggiore stabilità',
    },
    fov: {
      suggested: suggestedFOV,
      reason: suggestedFOV > 100 
        ? 'FOV ampio per visione periferica migliorata' 
        : 'FOV standard per target più grandi',
    },
  };
}

// Genera tips personalizzati
export function generateTips(profile: PlayerProfile): string[] {
  const tips: string[] = [];

  // Tips basati sulla precisione
  if (profile.precision.byZone.left < profile.precision.overall * 0.8) {
    tips.push('Allena i movimenti verso sinistra: la tua precisione è più bassa in quella direzione');
  }
  if (profile.precision.byZone.right < profile.precision.overall * 0.8) {
    tips.push('Esercitati su bersagli a destra per bilanciare il tuo aim');
  }

  // Tips reazione
  if (profile.reactionTime.average > 300) {
    tips.push('Prova mappe come "Shipment" per allenare il tempo di reazione con scontri frequenti');
  } else if (profile.reactionTime.average < 200) {
    tips.push('Tempo di reazione eccellente! Prova il quickscoping con fucili da precisione');
  }

  // Tips movimento
  if (profile.movement.overCorrection) {
    tips.push('Evita la sovra-correzione: quando sbagli, non correggere troppo violentemente');
    tips.push('Abbassa leggermente la sensibilità per ridurre l\'over-correction');
  }

  if (profile.movement.type === 'jerky') {
    tips.push('Il tuo movimento è troppo "a scatti". Prova a muovere il mirino più fluidamente');
  }

  // Tips per distanza
  if (profile.precision.byDistance.far < 40) {
    tips.push('La tua precisione a lunga distanza è bassa. Usa armi da corto/medio raggio o allenati con burst controllati');
  }

  return tips;
}

// Rating complessivo
export function calculateOverallRating(profile: PlayerProfile): 'S' | 'A' | 'B' | 'C' | 'D' {
  let score = 0;

  // Precisione (max 40 punti)
  score += profile.precision.overall * 0.4;

  // Reazione (max 30 punti) - più basso è meglio
  const reactionScore = Math.max(0, 30 - (profile.reactionTime.average - 150) / 10);
  score += reactionScore;

  // Consistenza movimento (max 20 punti)
  score += profile.movement.consistency * 0.2;

  // Pattern movimento (max 10 punti)
  if (profile.movement.type === 'smooth') score += 10;
  else if (profile.movement.type === 'linear') score += 5;

  if (score >= 80) return 'S';
  if (score >= 65) return 'A';
  if (score >= 50) return 'B';
  if (score >= 35) return 'C';
  return 'D';
}

// Funzione principale che combina tutto
export function generateAIAnalysis(data: RawTelemetryData): AIAnalysisResult {
  const profile = analyzePlayerProfile(data);
  const ALL_WEAPONS = recommendWeapons(profile);
  const settings = recommendSettings(profile);
  const tips = generateTips(profile);
  const rating = calculateOverallRating(profile);

  // Training focus
  const trainingFocus: string[] = [];
  if (profile.precision.overall < 60) trainingFocus.push('Precisione base');
  if (profile.precision.byDistance.far < 40) trainingFocus.push('Long range');
  if (profile.reactionTime.average > 300) trainingFocus.push('Tempo di reazione');
  if (profile.movement.overCorrection) trainingFocus.push('Controllo movimento');
  if (trainingFocus.length === 0) trainingFocus.push('Affinamento tecnica avanzata');

  return {
    playerProfile: profile,
    primaryWeapon: ALL_WEAPONS.primary,
    secondaryWeapon: ALL_WEAPONS.secondary,
    settings,
    tips,
    trainingFocus,
    overallRating: rating,
  };
}
