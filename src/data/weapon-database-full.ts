/**
 * COD COACHING - DATABASE ARMI COMPLETO
 * MW3 + Warzone - Tutte le arme META e non
 */

export type WeaponCategory = 'assault' | 'smg' | 'lmg' | 'marksman' | 'sniper' | 'shotgun' | 'melee';
export type GameMode = 'multiplayer' | 'warzone' | 'ranked';

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  description: string;
  
  // Stats base (0-100)
  stats: {
    damage: number;
    accuracy: number;
    range: number;
    fireRate: number;
    mobility: number;
    control: number;
  };
  
  // Build consigliate per tipo
  builds: {
    aggressive: AttachmentBuild;
    balanced: AttachmentBuild;
    longRange: AttachmentBuild;
    warzone?: AttachmentBuild;
  };
  
  // Difficoltà d'uso
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Per chi è consigliata
  recommendedFor: string[];
  
  // Contro chi è forte
  strongAgainst: string[];
  
  // META attuale
  isMeta: boolean;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface AttachmentBuild {
  name: string;
  muzzle: string;
  barrel: string;
  optic: string;
  stock: string;
  underbarrel: string;
  magazine: string;
  ammunition: string;
  rearGrip: string;
  
  // Stats modificate dalla build
  modifiedStats: {
    damage: number;
    accuracy: number;
    range: number;
    fireRate: number;
    mobility: number;
    control: number;
  };
  
  pros: string[];
  cons: string[];
}

// ============================================
// ASSAULT RIFLES
// ============================================
const assaultRifles: Weapon[] = [
  {
    id: 'sv-a545',
    name: 'SVA 545',
    category: 'assault',
    description: 'Precisa, controllabile, perfetta per tutte le distanze',
    stats: { damage: 75, accuracy: 82, range: 70, fireRate: 65, mobility: 68, control: 80 },
    difficulty: 'easy',
    isMeta: true,
    tier: 'S',
    recommendedFor: ['Giocatori precisi', 'Long range', 'Principianti'],
    strongAgainst: ['SMG a lunga distanza', 'LMG lenti'],
    builds: {
      aggressive: {
        name: 'SVA Assault',
        muzzle: 'Purifier Muzzle Brake',
        barrel: 'STV Precision Barrel',
        optic: 'MK.3 Reflector',
        stock: 'Ivanov Wood Stock',
        underbarrel: 'Bruen Pivot Vertical Grip',
        magazine: '60 Round Drum',
        ammunition: '5.45 High Velocity',
        rearGrip: 'Mane V6 Stock',
        modifiedStats: { damage: 75, accuracy: 88, range: 65, fireRate: 68, mobility: 75, control: 85 },
        pros: ['Recoil minimo', 'Prima hit precisa', 'Versatile'], 
        cons: ['Fire rate medio', 'TTX leggermente alto']
      },
      balanced: {
        name: 'SVA All-Rounder',
        muzzle: 'VT-7 Spiritfire Suppressor',
        barrel: 'Kastovia Long Barrel',
        optic: 'Slate Reflector',
        stock: 'Buffer Tube Stock',
        underbarrel: 'Bruen Heavy Support',
        magazine: '45 Round Mag',
        ammunition: '5.45 Armor Piercing',
        rearGrip: 'True-Tac Grip',
        modifiedStats: { damage: 78, accuracy: 85, range: 78, fireRate: 65, mobility: 70, control: 82 },
        pros: ['Silent', 'Ottima per Warzone', 'Range esteso'], 
        cons: ['Più lenta ADS']
      },
      longRange: {
        name: 'SVA Marksman',
        muzzle: 'Casus Brake',
        barrel: 'Kastovia Long Barrel',
        optic: 'Corio Eagleseye 2.5x',
        stock: 'Heavy Stock',
        underbarrel: 'Bipod',
        magazine: '45 Round Mag',
        ammunition: '5.45 High Grain',
        rearGrip: 'FSS Combat Grip',
        modifiedStats: { damage: 80, accuracy: 92, range: 90, fireRate: 60, mobility: 55, control: 88 },
        pros: ['Laser a lunga distanza', 'Danno aumentato'], 
        cons: ['Molto lenta', 'Solo statico']
      },
      warzone: {
        name: 'SVA Warzone META',
        muzzle: 'VT-7 Spiritfire Suppressor',
        barrel: 'Kastovia Long Barrel',
        optic: 'Slate Reflector',
        stock: 'Buffer Tube Stock',
        underbarrel: 'Bruen Heavy Support',
        magazine: '60 Round Drum',
        ammunition: '5.45 High Velocity',
        rearGrip: 'Mane V6 Stock',
        modifiedStats: { damage: 78, accuracy: 86, range: 82, fireRate: 65, mobility: 68, control: 83 },
        pros: ['META Warzone', 'Versatile', '60 colpi'], 
        cons: ['ADS medio']
      }
    }
  },
  
  {
    id: 'ram-7',
    name: 'RAM-7',
    category: 'assault',
    description: 'Bullpup compatta, ottima per rushare',
    stats: { damage: 72, accuracy: 75, range: 60, fireRate: 78, mobility: 75, control: 72 },
    difficulty: 'medium',
    isMeta: true,
    tier: 'A',
    recommendedFor: ['Rusher', 'SMG players', 'Movimento aggressivo'],
    strongAgainst: ['SMG lente', 'Sniper da vicino'],
    builds: {
      aggressive: {
        name: 'RAM Aggressor',
        muzzle: 'L4R Flash Hider',
        barrel: 'Forge DX Short',
        optic: 'MK.3 Reflector',
        stock: 'No Stock',
        underbarrel: 'XRK Edge BW-4',
        magazine: '40 Round Mag',
        ammunition: '5.56 NATO High Velocity',
        rearGrip: 'Retort 90 Grip',
        modifiedStats: { damage: 72, accuracy: 72, range: 55, fireRate: 82, mobility: 90, control: 68 },
        pros: ['ADS velocissimo', 'Fire rate alto', 'Mobilità SMG'], 
        cons: ['Recoil difficile', 'Range corto']
      },
      balanced: {
        name: 'RAM Versatile',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'Cronen Long Barrel',
        optic: 'Slate Reflector',
        stock: 'Light Stock',
        underbarrel: 'Bruen Pivot',
        magazine: '45 Round Mag',
        ammunition: '5.56 NATO',
        rearGrip: 'Mane V6',
        modifiedStats: { damage: 75, accuracy: 78, range: 70, fireRate: 78, mobility: 78, control: 76 },
        pros: ['Equilibrata', 'Silent'], 
        cons: ['Nessun vero punto forte']
      },
      warzone: {
        name: 'RAM Warzone',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'Cronen Long Barrel',
        optic: 'Corio 2.5x',
        stock: 'Light Stock',
        underbarrel: 'Bruen Heavy Support',
        magazine: '60 Round',
        ammunition: '5.56 High Velocity',
        rearGrip: 'Mane V6',
        modifiedStats: { damage: 75, accuracy: 80, range: 78, fireRate: 75, mobility: 72, control: 78 },
        pros: ['Mobilità AR', '60 colpi'], 
        cons: ['Danno a distanza medio']
      }
    }
  },
  
  {
    id: 'holger-556',
    name: 'Holger 556',
    category: 'assault',
    description: 'G36C - Precisa, laser beam, controllabilissima',
    stats: { damage: 70, accuracy: 88, range: 75, fireRate: 68, mobility: 65, control: 85 },
    difficulty: 'easy',
    isMeta: true,
    tier: 'S',
    recommendedFor: ['Principianti', 'Giocatori precisi', 'Long range'],
    strongAgainst: ['Tutte le armi a distanza'],
    builds: {
      aggressive: {
        name: 'Holger Laser',
        muzzle: 'Purifier Brake',
        barrel: 'Chri Beta Short',
        optic: 'MK.3 Reflector',
        stock: 'Admiral Stock',
        underbarrel: 'Bruen Pivot',
        magazine: '40 Round',
        ammunition: '5.56 HV',
        rearGrip: 'Mane V6',
        modifiedStats: { damage: 70, accuracy: 90, range: 70, fireRate: 70, mobility: 75, control: 92 },
        pros: ['Recoil ZERO', 'Precisissima'], 
        cons: ['TTX lento', 'Danno medio']
      },
      warzone: {
        name: 'Holger Warzone META',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'Chri Long Barrel',
        optic: 'Slate Reflector',
        stock: 'Buffer Tube',
        underbarrel: 'Bruen Heavy',
        magazine: '60 Round',
        ammunition: '5.56 HV',
        rearGrip: 'True-Tac',
        modifiedStats: { damage: 73, accuracy: 92, range: 88, fireRate: 65, mobility: 68, control: 90 },
        pros: ['META S-tier', 'Laser a 100m', '60 colpi'], 
        cons: ['Fire rate lento', 'Tempo uccisione alto']
      }
    }
  },
  
  // Altre AR...
  {
    id: 'mtz-762',
    name: 'MTZ-762',
    category: 'assault',
    description: 'Battle rifle semi-auto, danno devastante',
    stats: { damage: 88, accuracy: 70, range: 85, fireRate: 50, mobility: 60, control: 65 },
    difficulty: 'hard',
    isMeta: false,
    tier: 'B',
    recommendedFor: ['Giocatori esperti', 'Tap-fire', 'Long range specialist'],
    strongAgainst: ['AR a distanza', 'Sniper'],
    builds: {
      longRange: {
        name: 'MTZ DMR',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'MTZ Long Barrel',
        optic: '7x Scope',
        stock: 'Heavy Stock',
        underbarrel: 'Bipod',
        magazine: '25 Round',
        ammunition: '7.62 Armor Piercing',
        rearGrip: 'FSS Combat',
        modifiedStats: { damage: 92, accuracy: 85, range: 95, fireRate: 50, mobility: 45, control: 75 },
        pros: ['2-shot kill', 'Range infinito'], 
        cons: ['Richiede precisione', 'Lentissima']
      }
    }
  }
];

// ============================================
// SMG
// ============================================
const smgs: Weapon[] = [
  {
    id: 'striker-9',
    name: 'Striker 9',
    category: 'smg',
    description: 'UMP45 - Compatta, controllabile, perfetta per rush',
    stats: { damage: 72, accuracy: 80, range: 45, fireRate: 75, mobility: 85, control: 82 },
    difficulty: 'easy',
    isMeta: true,
    tier: 'S',
    recommendedFor: ['Rusher', 'Close quarter', 'Movimento'],
    strongAgainst: ['AR da vicino', 'Sniper', 'Shotgun lenti'],
    builds: {
      aggressive: {
        name: 'Striker Rush',
        muzzle: 'L4R Flash Hider',
        barrel: 'Striker Short Barrel',
        optic: 'Slimline Reflex',
        stock: 'No Stock',
        underbarrel: 'XRK Edge',
        magazine: '50 Round Drum',
        ammunition: '9mm PBP',
        rearGrip: 'Sprint Grip',
        modifiedStats: { damage: 72, accuracy: 76, range: 40, fireRate: 80, mobility: 95, control: 78 },
        pros: ['Mobilità estrema', 'ADS istantaneo', '50 colpi'], 
        cons: ['Range cortissimo', 'Danno drop']
      },
      warzone: {
        name: 'Striker Warzone META',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'Striker Long Barrel',
        optic: 'Slate Reflector',
        stock: 'Light Stock',
        underbarrel: 'Bruen Pivot',
        magazine: '50 Round Drum',
        ammunition: '9mm HV',
        rearGrip: 'Mane V6',
        modifiedStats: { damage: 75, accuracy: 82, range: 60, fireRate: 75, mobility: 85, control: 84 },
        pros: ['META SMG Warzone', 'Versatile', '50 colpi'], 
        cons: ['Danno medio']
      }
    }
  },
  
  {
    id: 'rival-9',
    name: 'Rival-9',
    category: 'smg',
    description: 'Vector - Fire rate assurdo, melt da vicino',
    stats: { damage: 65, accuracy: 70, range: 35, fireRate: 95, mobility: 90, control: 68 },
    difficulty: 'medium',
    isMeta: true,
    tier: 'A',
    recommendedFor: ['Hyper aggressive', 'Movimento estremo', 'Rush-only'],
    strongAgainst: ['Tutti a 5 metri'],
    builds: {
      aggressive: {
        name: 'Rival Melter',
        muzzle: 'Purifier Brake',
        barrel: 'Rival Short',
        optic: 'Iron Sights',
        stock: 'No Stock',
        underbarrel: 'XRK Edge',
        magazine: '40 Round',
        ammunition: '9mm PBP',
        rearGrip: 'Sprint Grip',
        modifiedStats: { damage: 65, accuracy: 65, range: 30, fireRate: 100, mobility: 100, control: 60 },
        pros: ['1200 RPM', 'Kill in 0.2s'], 
        cons: ['Magazine scarica in 2s', 'Recoil wild', 'Range zero']
      }
    }
  },
  
  {
    id: 'wsp-swarm',
    name: 'WSP Swarm',
    category: 'smg',
    description: 'Micro Uzi - La più piccola, stealth, silenziosa',
    stats: { damage: 60, accuracy: 75, range: 30, fireRate: 88, mobility: 92, control: 75 },
    difficulty: 'medium',
    isMeta: false,
    tier: 'B',
    recommendedFor: ['Stealth', 'Flanking', 'Hit and run'],
    strongAgainst: ['Sniper da vicino', 'AR lenti'],
    builds: {}
  }
];

// ============================================
// LMG
// ============================================
const lmgs: Weapon[] = [
  {
    id: 'taq-evolvere',
    name: 'TAQ Evolvere',
    category: 'lmg',
    description: 'M240 - Belt-fed, 150 colpi, supporto pesante',
    stats: { damage: 80, accuracy: 78, range: 85, fireRate: 70, mobility: 45, control: 72 },
    difficulty: 'medium',
    isMeta: true,
    tier: 'A',
    recommendedFor: ['Supporto', 'Area denial', 'Warzone'],
    strongAgainst: ['Veicoli', 'Rush multipli', 'Long hold'],
    builds: {
      warzone: {
        name: 'TAQ Warzone Beast',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'TAQ Long Barrel',
        optic: '7x Scope',
        stock: 'Heavy Stock',
        underbarrel: 'Bipod',
        magazine: '150 Round Belt',
        ammunition: '7.62 Armor Piercing',
        rearGrip: 'FSS Combat',
        modifiedStats: { damage: 85, accuracy: 85, range: 95, fireRate: 68, mobility: 35, control: 80 },
        pros: ['150 colpi', 'Laser a 100m', 'Danno veicoli'], 
        cons: ['Mobilità ZERO', 'Ricarica 10s']
      }
    }
  },
  
  {
    id: 'bruen-mk9',
    name: 'Bruen Mk9',
    category: 'lmg',
    description: 'M249 - Bilanciata, precisa, versatile',
    stats: { damage: 75, accuracy: 82, range: 80, fireRate: 72, mobility: 50, control: 78 },
    difficulty: 'easy',
    isMeta: false,
    tier: 'B',
    recommendedFor: ['Principianti LMG', 'Supporto mobile'],
    strongAgainst: ['AR a distanza'],
    builds: {}
  }
];

// ============================================
// SNIPER / MARKSMAN
// ============================================
const snipers: Weapon[] = [
  {
    id: 'katt-amr',
    name: 'KATT-AMR',
    category: 'sniper',
    description: 'Barrett .50cal - One shot, one kill',
    stats: { damage: 100, accuracy: 85, range: 100, fireRate: 20, mobility: 30, control: 60 },
    difficulty: 'hard',
    isMeta: true,
    tier: 'S',
    recommendedFor: ['Sniper esperti', 'Quickscope', 'Warzone'],
    strongAgainst: ['Tutti (1-shot)'],
    builds: {
      aggressive: {
        name: 'KATT Quickscope',
        muzzle: 'Sonic Suppressor',
        barrel: 'KATT Short Barrel',
        optic: 'SP-X 80',
        stock: 'Assault Stock',
        bolt: 'FSS ST87 Bolt',
        ammunition: '.50 Explosive',
        rearGrip: 'Sprint Grip',
        modifiedStats: { damage: 95, accuracy: 75, range: 80, fireRate: 30, mobility: 55, control: 50 },
        pros: ['ADS veloce', 'One-shot torso'], 
        cons: ['Bullet drop', 'Ricarica lenta']
      },
      warzone: {
        name: 'KATT Warzone',
        muzzle: 'Sonic Suppressor XL',
        barrel: 'KATT Long Barrel',
        optic: '7x Thermal',
        stock: 'Heavy Stock',
        underbarrel: 'Bipod',
        ammunition: '.50 Explosive',
        rearGrip: 'FSS Combat',
        modifiedStats: { damage: 100, accuracy: 92, range: 100, fireRate: 20, mobility: 20, control: 70 },
        pros: ['One-shot anywhere', 'Silent', 'Thermal'], 
        cons: ['Pesantissima', 'Solo camping']
      }
    }
  },
  
  {
    id: 'mcw-68',
    name: 'MCW 6.8',
    category: 'marksman',
    description: 'Semi-auto DMR, 2-shot kill, versatile',
    stats: { damage: 85, accuracy: 88, range: 90, fireRate: 45, mobility: 55, control: 75 },
    difficulty: 'medium',
    isMeta: true,
    tier: 'A',
    recommendedFor: ['Marksman', 'Long range support', 'Warzone'],
    strongAgainst: ['Sniper', 'AR a distanza'],
    builds: {
      warzone: {
        name: 'MCW Warzone DMR',
        muzzle: 'VT-7 Spiritfire',
        barrel: 'MCW Long',
        optic: 'Corio 3x',
        stock: 'Light Stock',
        underbarrel: 'Bruen Heavy',
        magazine: '30 Round',
        ammunition: '6.8 High Velocity',
        rearGrip: 'Mane V6',
        modifiedStats: { damage: 88, accuracy: 92, range: 95, fireRate: 45, mobility: 60, control: 82 },
        pros: ['2-shot kill', 'Fire rate buono', 'Versatile'], 
        cons: ['Richiede precisione']
      }
    }
  }
];

// ============================================
// SHOTGUN
// ============================================
const shotguns: Weapon[] = [
  {
    id: 'haymaker',
    name: 'Haymaker',
    category: 'shotgun',
    description: 'Semi-auto, spamibile, devastante da vicino',
    stats: { damage: 95, accuracy: 45, range: 20, fireRate: 60, mobility: 80, control: 55 },
    difficulty: 'easy',
    isMeta: true,
    tier: 'A',
    recommendedFor: ['Rush estremo', 'Camping corner', 'Rage play'],
    strongAgainst: ['Tutti a 3 metri'],
    builds: {}
  },
  
  {
    id: 'lockwood-680',
    name: 'Lockwood 680',
    category: 'shotgun',
    description: 'Pump action, one-shot potential',
    stats: { damage: 100, accuracy: 50, range: 25, fireRate: 35, mobility: 75, control: 60 },
    difficulty: 'hard',
    isMeta: false,
    tier: 'B',
    recommendedFor: ['Precisione', 'One-shot kills'],
    strongAgainst: ['Singoli target'],
    builds: {}
  }
];

// ============================================
// ESPORTA TUTTO
// ============================================
export const WEAPON_DATABASE: Weapon[] = [
  ...assaultRifles,
  ...smgs,
  ...lmgs,
  ...snipers,
  ...shotguns
];

// Funzioni helper
export function getWeaponById(id: string): Weapon | undefined {
  return WEAPON_DATABASE.find(w => w.id === id);
}

export function getWeaponsByCategory(category: WeaponCategory): Weapon[] {
  return WEAPON_DATABASE.filter(w => w.category === category);
}

export function getMetaWeapons(): Weapon[] {
  return WEAPON_DATABASE.filter(w => w.isMeta).sort((a, b) => a.tier.localeCompare(b.tier));
}

export function getWeaponRecommendation(
  kd: number,
  accuracy: number,
  spm: number,
  playstyle: 'aggressive' | 'balanced' | 'passive'
): Weapon[] {
  const recommendations: Weapon[] = [];
  
  if (playstyle === 'aggressive' || spm > 400) {
    recommendations.push(...getWeaponsByCategory('smg').filter(w => w.tier === 'S' || w.tier === 'A'));
    recommendations.push(getWeaponById('ram-7')!);
  }
  
  if (accuracy > 30) {
    recommendations.push(getWeaponById('sv-a545')!);
    recommendations.push(getWeaponById('holger-556')!);
  }
  
  if (playstyle === 'passive' || kd > 1.5) {
    recommendations.push(...getWeaponsByCategory('marksman'));
    recommendations.push(...getWeaponsByCategory('sniper'));
  }
  
  // Rimuovi duplicati e prendi top 3
  return [...new Set(recommendations)].slice(0, 3);
}

// Calcola il TTK (Time To Kill) teorico
export function calculateTTK(weapon: Weapon, distance: 'close' | 'mid' | 'long'): number {
  const damage = weapon.stats.damage;
  const fireRate = weapon.stats.fireRate;
  
  // Semplificazione: danno necessario / danno per colpo / fire rate
  const shotsToKill = Math.ceil(100 / damage * 3); // 100 HP, 3 plate in Warzone
  const timeBetweenShots = 60 / fireRate; // in secondi
  
  return shotsToKill * timeBetweenShots;
}
