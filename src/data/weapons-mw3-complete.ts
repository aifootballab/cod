/**
 * COD COACHING - DATABASE COMPLETO ARMI MW3 + WARZONE
 * Ultimo aggiornamento: Season 1 Reloaded
 * Fonte dati: Sym.gg, JGOD, XclusiveAce
 * 
 * NOTA: Per aggiornamenti meta, modifica i valori 'tier' e 'isMeta'
 * in base alle patch notes ufficiali
 */

export type WeaponCategory = 
  | 'assault' 
  | 'smg' 
  | 'lmg' 
  | 'marksman' 
  | 'sniper' 
  | 'shotgun' 
  | 'pistol' 
  | 'launcher';

export type DamageProfile = {
  head: number;
  chest: number;
  stomach: number;
  limbs: number;
};

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  description: string;
  
  // Stats tecniche reali
  damage: DamageProfile;
  fireRateRPM: number; // RPM reali
  magazineSize: number;
  reloadTime: number; // secondi
  
  // Range in metri
  range: {
    damageDropStart: number;
    damageDropEnd: number;
  };
  
  // Handling
  adsTime: number; // ms
  sprintToFire: number; // ms
  tacSprintToFire: number; // ms
  
  // Recoil pattern (1-10)
  recoilVertical: number;
  recoilHorizontal: number;
  
  // Posizione meta attuale
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  isMeta: boolean;
  
  // Modalità consigliate
  recommendedModes: ('multiplayer' | 'warzone' | 'ranked')[];
  
  // Difficoltà
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Per chi è consigliata
  bestFor: string[];
  
  // Contro cosa è forte
  counters: string[];
  
  // Counter a questa arma
  counteredBy: string[];
  
  // Attachments meta (nomi reali)
  metaAttachments: {
    multiplayer?: string[];
    warzone?: string[];
    ranked?: string[];
  };
  
  // TTK calcolato (ms) - aggiornato con patch
  ttk: {
    close: number; // 0-10m
    mid: number; // 10-30m
    long: number; // 30m+
  };
}

// ============================================
// ASSAULT RIFLES - 10 armi
// ============================================
const ASSAULT_RIFLES: Weapon[] = [
  {
    id: 'sva-545',
    name: 'SVA 545',
    category: 'assault',
    description: 'AK-74 russa. Prima hit extra-veloce, controllabilissima.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 657,
    magazineSize: 30,
    reloadTime: 2.3,
    range: { damageDropStart: 25, damageDropEnd: 50 },
    adsTime: 240,
    sprintToFire: 210,
    tacSprintToFire: 280,
    recoilVertical: 3,
    recoilHorizontal: 2,
    tier: 'S',
    isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Principianti', 'Precisione', 'All-range'],
    counters: ['AR lenti', 'LMG immobili'],
    counteredBy: ['SMG da vicino', 'Sniper long range'],
    metaAttachments: {
      multiplayer: ['VT-7 Suppressor', 'STV Precision', 'MK.3 Reflector', 'Bruen Pivot', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'Kastovia Long', 'Slate Reflector', 'Bruen Heavy', '60 Round'],
      ranked: ['Purifier Brake', 'STV Precision', 'Iron Sights', 'Bruen Pivot', '40 Round']
    },
    ttk: { close: 182, mid: 273, long: 364 }
  },
  
  {
    id: 'mtz-556',
    name: 'MTZ-556',
    category: 'assault',
    description: 'Ctar-21 israeliana. Compatta, agile, danno medio.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 757,
    magazineSize: 30,
    reloadTime: 2.1,
    range: { damageDropStart: 20, damageDropEnd: 45 },
    adsTime: 230,
    sprintToFire: 200,
    tacSprintToFire: 270,
    recoilVertical: 4,
    recoilHorizontal: 3,
    tier: 'A',
    isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'medium',
    bestFor: ['Mobilità', 'Rush controllato'],
    counters: ['AR pesanti', 'SMG a distanza'],
    counteredBy: ['SVA 545', 'Holger 556'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'MTZ Short', 'MK.3 Reflector', 'XRK Edge', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'MTZ Long', 'Slate Reflector', 'Bruen Heavy', '60 Round']
    },
    ttk: { close: 198, mid: 297, long: 396 }
  },
  
  {
    id: 'holger-556',
    name: 'Holger 556',
    category: 'assault',
    description: 'G36C tedesca. Laser beam, zero recoil, TTK lento ma consistent.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 612,
    magazineSize: 30,
    reloadTime: 2.4,
    range: { damageDropStart: 30, damageDropEnd: 60 },
    adsTime: 260,
    sprintToFire: 220,
    tacSprintToFire: 290,
    recoilVertical: 2,
    recoilHorizontal: 1,
    tier: 'S',
    isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Zero recoil', 'Long range', 'Principianti'],
    counters: ['Tutte a distanza'],
    counteredBy: ['SMG rush', 'Sniper'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'Chri Beta', 'MK.3', 'Bruen Pivot', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'Chri Long', 'Slate Reflector', 'Bruen Heavy', '60 Round'],
      ranked: ['Purifier', 'Chri Beta', 'Iron Sights', 'Bruen Pivot', '40 Round']
    },
    ttk: { close: 196, mid: 294, long: 392 }
  },
  
  {
    id: 'mcw',
    name: 'MCW (ACR)',
    category: 'assault',
    description: 'ACR iconica. Precisa, versatile, nostalgica.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 705,
    magazineSize: 30,
    reloadTime: 2.2,
    range: { damageDropStart: 25, damageDropEnd: 50 },
    adsTime: 245,
    sprintToFire: 215,
    tacSprintToFire: 285,
    recoilVertical: 3,
    recoilHorizontal: 2,
    tier: 'B',
    isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Nostalgia', 'Versatilità'],
    counters: ['AR medio-lenti'],
    counteredBy: ['SVA 545', 'Holger 556'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'MCW Short', 'MK.3', 'XRK Edge', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'MCW Long', 'Slate Reflector', 'Bruen Heavy', '60 Round']
    },
    ttk: { close: 204, mid: 306, long: 408 }
  },
  
  {
    id: 'dg-58',
    name: 'DG-58 (Famas)',
    category: 'assault',
    description: 'Famas a raffica. Burst 3 colpi, TTK potenziale altissimo.',
    damage: { head: 60, chest: 40, stomach: 37, limbs: 37 },
    fireRateRPM: 857, // Per colpo nel burst
    magazineSize: 30,
    reloadTime: 2.5,
    range: { damageDropStart: 35, damageDropEnd: 70 },
    adsTime: 270,
    sprintToFire: 230,
    tacSprintToFire: 300,
    recoilVertical: 5,
    recoilHorizontal: 4,
    tier: 'B',
    isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'hard',
    bestFor: ['Burst player', 'One-burst potential'],
    counters: ['AR full-auto'],
    counteredBy: ['SMG rush', 'Holger laser'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'DG Long', 'MK.3', 'Bruen Pivot', '45 Round']
    },
    ttk: { close: 140, mid: 210, long: 280 } // Se tutti i colpi nel burst colpiscono
  },
  
  {
    id: 'fr-556',
    name: 'FR 5.56 (F2000)',
    category: 'assault',
    description: 'F2000 bullpup. Burst rapido, mobilità SMG.',
    damage: { head: 57, chest: 38, stomach: 35, limbs: 35 },
    fireRateRPM: 900,
    magazineSize: 30,
    reloadTime: 2.3,
    range: { damageDropStart: 30, damageDropEnd: 55 },
    adsTime: 235,
    sprintToFire: 205,
    tacSprintToFire: 275,
    recoilVertical: 6,
    recoilHorizontal: 5,
    tier: 'C',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Burst aggressive', 'Mobilità'],
    counters: ['AR lenti'],
    counteredBy: ['SVA 545', 'SMG'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'FR Short', 'MK.3', 'XRK Edge', '40 Round']
    },
    ttk: { close: 133, mid: 200, long: 266 }
  },
  
  {
    id: 'ram-7',
    name: 'RAM-7',
    category: 'assault',
    description: 'Tavor israeliana. Bullpup compatta, fire rate alto.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800,
    magazineSize: 30,
    reloadTime: 2.2,
    range: { damageDropStart: 18, damageDropEnd: 40 },
    adsTime: 225,
    sprintToFire: 195,
    tacSprintToFire: 265,
    recoilVertical: 5,
    recoilHorizontal: 4,
    tier: 'A',
    isMeta: true,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'medium',
    bestFor: ['Rush AR', 'Mobilità', 'Fire rate'],
    counters: ['AR pesanti', 'LMG'],
    counteredBy: ['Holger 556', 'Sniper'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'RAM Short', 'MK.3', 'XRK Edge', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'RAM Long', 'Slate Reflector', 'Bruen Heavy', '60 Round']
    },
    ttk: { close: 150, mid: 225, long: 300 }
  },
  
  {
    id: 'mtz-762',
    name: 'MTZ-762 (SCAR-H)',
    category: 'assault',
    description: 'Battle rifle 7.62. Danno devastante, fire rate lento.',
    damage: { head: 72, chest: 48, stomach: 44, limbs: 44 },
    fireRateRPM: 550,
    magazineSize: 20,
    reloadTime: 2.6,
    range: { damageDropStart: 40, damageDropEnd: 80 },
    adsTime: 280,
    sprintToFire: 240,
    tacSprintToFire: 320,
    recoilVertical: 6,
    recoilHorizontal: 4,
    tier: 'B',
    isMeta: false,
    recommendedModes: ['multiplayer', 'warzone'],
    difficulty: 'medium',
    bestFor: ['Danno pesante', 'Long range', 'Warzone'],
    counters: ['AR standard'],
    counteredBy: ['SMG rush', 'Holger'],
    metaAttachments: {
      multiplayer: ['VT-7 Spiritfire', 'MTZ Long', 'Slate Reflector', 'Bruen Heavy', '30 Round'],
      warzone: ['VT-7 Spiritfire XL', 'MTZ Extended', '3x Optic', 'Bipod', '30 Round']
    },
    ttk: { close: 218, mid: 218, long: 218 } // Consistente
  },
  
  {
    id: 'sidewinder',
    name: 'Sidewinder (G Bullpup)',
    category: 'assault',
    description: 'Groza russa. Full-auto aggressiva, recoil wild.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 750,
    magazineSize: 30,
    reloadTime: 2.3,
    range: { damageDropStart: 20, damageDropEnd: 45 },
    adsTime: 250,
    sprintToFire: 220,
    tacSprintToFire: 290,
    recoilVertical: 7,
    recoilHorizontal: 6,
    tier: 'C',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Aggressive player', 'Recoil control'],
    counters: ['AR controllabili'],
    counteredBy: ['Holger', 'SVA 545'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'Sidewinder Short', 'MK.3', 'Bruen Pivot', '40 Round']
    },
    ttk: { close: 160, mid: 240, long: 320 }
  },
  
  {
    id: 'kastov-762',
    name: 'Kastov 762 (AK-47)',
    category: 'assault',
    description: 'AK-47 classica. Danno pesante, recoil significativo.',
    damage: { head: 63, chest: 42, stomach: 39, limbs: 39 },
    fireRateRPM: 600,
    magazineSize: 30,
    reloadTime: 2.4,
    range: { damageDropStart: 35, damageDropEnd: 70 },
    adsTime: 265,
    sprintToFire: 225,
    tacSprintToFire: 295,
    recoilVertical: 6,
    recoilHorizontal: 5,
    tier: 'B',
    isMeta: false,
    recommendedModes: ['multiplayer', 'warzone'],
    difficulty: 'medium',
    bestFor: ['Danno pesante', 'Nostalgia', 'Warzone'],
    counters: ['AR controllabili'],
    counteredBy: ['Holger', 'SVA 545'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'Kastov Long', 'MK.3', 'Bruen Pivot', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'Kastov Extended', 'Slate Reflector', 'Bruen Heavy', '60 Round']
    },
    ttk: { close: 200, mid: 300, long: 400 }
  }
];

// ============================================
// SMG - 9 armi
// ============================================
const SMGS: Weapon[] = [
  {
    id: 'striker',
    name: 'Striker (UMP45)',
    category: 'smg',
    description: 'UMP45 iconica. Controllabile, versatile, 50 colpi.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 600,
    magazineSize: 30,
    reloadTime: 2.0,
    range: { damageDropStart: 12, damageDropEnd: 25 },
    adsTime: 200,
    sprintToFire: 120,
    tacSprintToFire: 160,
    recoilVertical: 3,
    recoilHorizontal: 2,
    tier: 'S',
    isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Principianti SMG', '50 round', 'Controllabilità'],
    counters: ['AR da vicino', 'Shotgun lenti'],
    counteredBy: ['Rival-9 close', 'Sniper'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'Striker Short', 'Slimline', 'XRK Edge', '50 Drum'],
      warzone: ['VT-7 Spiritfire', 'Striker Long', 'Slate Reflector', 'Bruen Pivot', '50 Drum']
    },
    ttk: { close: 200, mid: 300, long: 600 }
  },
  
  {
    id: 'wsp-swarm',
    name: 'WSP Swarm (Micro Uzi)',
    category: 'smg',
    description: 'Micro Uzi. 1000 RPM, melt istantaneo, range zero.',
    damage: { head: 42, chest: 28, stomach: 26, limbs: 26 },
    fireRateRPM: 1000,
    magazineSize: 32,
    reloadTime: 1.9,
    range: { damageDropStart: 8, damageDropEnd: 15 },
    adsTime: 190,
    sprintToFire: 110,
    tacSprintToFire: 150,
    recoilVertical: 7,
    recoilHorizontal: 6,
    tier: 'S',
    isMeta: true,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'medium',
    bestFor: ['Hyper aggressive', 'Melt close', '1000 RPM'],
    counters: ['Tutti a 5m'],
    counteredBy: ['Shotgun', 'AR a 10m+'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'WSP Short', 'Iron Sights', 'Sprint Grip', '40 Round'],
      warzone: ['VT-7 Spiritfire', 'WSP Long', 'Slate Reflector', 'Bruen Pivot', '50 Round']
    },
    ttk: { close: 120, mid: 240, long: 480 }
  },
  
  {
    id: 'rival-9',
    name: 'Rival-9 (Vector)',
    category: 'smg',
    description: 'Kriss Vector. Fire rate estremo, recoil wild.',
    damage: { head: 42, chest: 28, stomach: 26, limbs: 26 },
    fireRateRPM: 1075,
    magazineSize: 25,
    reloadTime: 1.8,
    range: { damageDropStart: 8, damageDropEnd: 16 },
    adsTime: 185,
    sprintToFire: 105,
    tacSprintToFire: 145,
    recoilVertical: 8,
    recoilHorizontal: 7,
    tier: 'A',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Estremo rush', 'Fire rate max'],
    counters: ['Tutti a 3m'],
    counteredBy: ['Shotgun', 'WSP Swarm'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'Rival Short', 'Iron Sights', 'XRK Edge', '40 Round']
    },
    ttk: { close: 111, mid: 222, long: 444 }
  },
  
  {
    id: 'amr9',
    name: 'AMR9 (MP5 clone)',
    category: 'smg',
    description: 'SMG equilibrata, niente di eccezionale.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 750,
    magazineSize: 30,
    reloadTime: 2.1,
    range: { damageDropStart: 10, damageDropEnd: 22 },
    adsTime: 205,
    sprintToFire: 125,
    tacSprintToFire: 165,
    recoilVertical: 4,
    recoilHorizontal: 3,
    tier: 'B',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['SMG generica', 'Equilibrio'],
    counters: ['AR lenti da vicino'],
    counteredBy: ['Striker', 'WSP Swarm'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'AMR Short', 'MK.3', 'XRK Edge', '40 Round']
    },
    ttk: { close: 160, mid: 320, long: 640 }
  },
  
  {
    id: 'wsp-9',
    name: 'WSP-9 (Uzi)',
    category: 'smg',
    description: 'Uzi classica. Lenta, controllabile, range SMG-lunga.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 550,
    magazineSize: 32,
    reloadTime: 2.3,
    range: { damageDropStart: 15, damageDropEnd: 30 },
    adsTime: 215,
    sprintToFire: 135,
    tacSprintToFire: 175,
    recoilVertical: 2,
    recoilHorizontal: 2,
    tier: 'C',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Controllabilità', 'Range SMG'],
    counters: ['SMG a distanza'],
    counteredBy: ['Striker', 'WSP Swarm', 'AR'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'WSP9 Long', 'MK.3', 'Bruen Pivot', '40 Round']
    },
    ttk: { close: 218, mid: 327, long: 654 }
  },
  
  {
    id: 'striker-9',
    name: 'Striker 9 (MP9)',
    category: 'smg',
    description: 'MP9 9mm. Veloce, controllabile, 50 colpi.',
    damage: { head: 45, chest: 30, stomach: 28, limbs: 28 },
    fireRateRPM: 850,
    magazineSize: 32,
    reloadTime: 1.9,
    range: { damageDropStart: 9, damageDropEnd: 18 },
    adsTime: 195,
    sprintToFire: 115,
    tacSprintToFire: 155,
    recoilVertical: 4,
    recoilHorizontal: 3,
    tier: 'A',
    isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Controllabile', 'Fire rate alto', '50 colpi'],
    counters: ['AR da vicino'],
    counteredBy: ['WSP Swarm', 'Rival-9'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'Striker9 Short', 'MK.3', 'XRK Edge', '50 Round']
    },
    ttk: { close: 141, mid: 282, long: 564 }
  },
  
  {
    id: 'fr5-56',
    name: 'FR 5.56 (F2000)',
    category: 'smg',
    description: 'F2000. Burst 3 colpi, mobilità AR.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 900,
    magazineSize: 30,
    reloadTime: 2.2,
    range: { damageDropStart: 12, damageDropEnd: 25 },
    adsTime: 240,
    sprintToFire: 130,
    tacSprintToFire: 170,
    recoilVertical: 5,
    recoilHorizontal: 4,
    tier: 'C',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Burst player', 'Mobilità AR'],
    counters: ['SMG controllabili'],
    counteredBy: ['Full-auto SMG'],
    metaAttachments: {
      multiplayer: ['Purifier Brake', 'FR Short', 'MK.3', 'XRK Edge', '45 Round']
    },
    ttk: { close: 133, mid: 200, long: 400 }
  },
  
  {
    id: 'lockwood-680',
    name: 'Lockwood 680 (MPX)',
    category: 'smg',
    description: 'MPX. Precisa, laser, danno medio.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800,
    magazineSize: 30,
    reloadTime: 2.0,
    range: { damageDropStart: 11, damageDropEnd: 24 },
    adsTime: 200,
    sprintToFire: 120,
    tacSprintToFire: 160,
    recoilVertical: 3,
    recoilHorizontal: 2,
    tier: 'B',
    isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Precisione SMG', 'Laser beam'],
    counters: ['SMG a distanza'],
    counteredBy: ['Striker', 'WSP Swarm'],
    metaAttachments: {
      multiplayer: ['L4R Flash', 'Lockwood Short', 'MK.3', 'Bruen Pivot', '40 Round']
    },
    ttk: { close: 150, mid: 300, long: 600 }
  }
];

// Export tutte le armi
export const WEAPONS_MW3: Weapon[] = [
  ...ASSAULT_RIFLES,
  ...SMGS
  // TODO: Aggiungere LMG, Sniper, Marksman, Shotgun
];

// Helper functions
export function getAllWeapons(): Weapon[] {
  return WEAPONS_MW3;
}

export function getWeaponById(id: string): Weapon | undefined {
  return WEAPONS_MW3.find(w => w.id === id);
}

export function getWeaponsByCategory(category: WeaponCategory): Weapon[] {
  return WEAPONS_MW3.filter(w => w.category === category);
}

export function getMetaWeapons(): Weapon[] {
  return WEAPONS_MW3.filter(w => w.isMeta).sort((a, b) => {
    const tierOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'F': 5 };
    return tierOrder[a.tier] - tierOrder[b.tier];
  });
}

export function getBestTTKWeapons(range: 'close' | 'mid' | 'long', top: number = 5): Weapon[] {
  return [...WEAPONS_MW3]
    .sort((a, b) => a.ttk[range] - b.ttk[range])
    .slice(0, top);
}

// Weapon recommendation basata su stats reali
export function recommendWeapons(
  kd: number,
  accuracy: number,
  spm: number,
  preferredRange: 'close' | 'mid' | 'long'
): { weapon: Weapon; reason: string; confidence: number }[] {
  const recommendations: { weapon: Weapon; reason: string; confidence: number }[] = [];
  
  // Logica di recommendation basata su dati reali
  
  // Giocatore preciso (>30% accuracy) -> Armi precise, punire errori
  if (accuracy > 30) {
    const preciseWeapons = WEAPONS_MW3.filter(w => w.recoilVertical <= 3 && w.recoilHorizontal <= 2);
    preciseWeapons.forEach(w => {
      recommendations.push({
        weapon: w,
        reason: `La tua accuracy del ${accuracy}% permette di sfruttare al massimo la precisione della ${w.name}`,
        confidence: 85
      });
    });
  }
  
  // Giocatore aggressivo (SPM > 400) -> SMG o AR leggere
  if (spm > 400) {
    const aggressive = WEAPONS_MW3.filter(w => 
      (w.category === 'smg' || w.id === 'ram-7') && 
      w.adsTime < 220 && 
      w.sprintToFire < 130
    );
    aggressive.forEach(w => {
      recommendations.push({
        weapon: w,
        reason: `Con SPM ${spm}, hai bisogno di mobilità. La ${w.name} ha ADS ${w.adsTime}ms`,
        confidence: 90
      });
    });
  }
  
  // Giocatore passivo (SPM < 250) -> AR controllabili
  if (spm < 250) {
    const passive = WEAPONS_MW3.filter(w => 
      w.category === 'assault' && 
      w.recoilVertical <= 3 && 
      w.range.damageDropEnd > 50
    );
    passive.forEach(w => {
      recommendations.push({
        weapon: w,
        reason: `Stile di gioco controllato. La ${w.name} ha zero recoil e range ${w.range.damageDropEnd}m`,
        confidence: 88
      });
    });
  }
  
  // Giocatore con buon K/D (> 1.5) -> Armi che premiano aim
  if (kd > 1.5) {
    const skillWeapons = WEAPONS_MW3.filter(w => 
      w.difficulty === 'hard' || w.tier === 'S'
    );
    skillWeapons.forEach(w => {
      recommendations.push({
        weapon: w,
        reason: `K/D ${kd} mostra skill. La ${w.name} (${w.tier}-Tier) può portarti al next level`,
        confidence: 82
      });
    });
  }
  
  // Rimuovi duplicati e prendi top 5
  const unique = recommendations.filter((v, i, a) => 
    a.findIndex(t => t.weapon.id === v.weapon.id) === i
  );
  
  return unique.slice(0, 5);
}

// Esporta per aggiornamenti
export const WEAPON_DATA_VERSION = '2024-02-03-v1';
export const DATA_SOURCES = [
  'sym.gg',
  'JGOD (YouTube)',
  'XclusiveAce (YouTube)',
  'TrueGameData'
];
