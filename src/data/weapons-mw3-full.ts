/**
 * COD COACHING - DATABASE COMPLETO TUTTE LE ARMI MW3
 * 37+ armi con stats reali
 * Aggiornato: Season 1 Reloaded
 */

export type WeaponCategory = 
  | 'assault' | 'smg' | 'lmg' | 'marksman' | 'sniper' 
  | 'shotgun' | 'pistol' | 'launcher' | 'melee';

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  description: string;
  damage: { head: number; chest: number; stomach: number; limbs: number };
  fireRateRPM: number;
  magazineSize: number;
  reloadTime: number;
  range: { damageDropStart: number; damageDropEnd: number };
  adsTime: number;
  sprintToFire: number;
  tacSprintToFire: number;
  recoilVertical: number;
  recoilHorizontal: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  isMeta: boolean;
  recommendedModes: ('multiplayer' | 'warzone' | 'ranked')[];
  difficulty: 'easy' | 'medium' | 'hard';
  bestFor: string[];
  metaAttachments?: string[];
  ttk: { close: number; mid: number; long: number };
}

// ============================================
// BATTLE RIFLES (categoria separata) - 5 armi
// ============================================
const BATTLE_RIFLES: Weapon[] = [
  {
    id: 'bas-b', name: 'BAS-B', category: 'assault',
    description: 'Battle rifle 7.62. Danno pesante, semi-auto versatile.',
    damage: { head: 75, chest: 50, stomach: 46, limbs: 46 },
    fireRateRPM: 500, magazineSize: 20, reloadTime: 2.7,
    range: { damageDropStart: 45, damageDropEnd: 90 },
    adsTime: 290, sprintToFire: 250, tacSprintToFire: 320,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'A', isMeta: true,
    recommendedModes: ['warzone', 'multiplayer'],
    difficulty: 'medium',
    bestFor: ['Danno pesante', '2-shot potential', 'Versatile'],
    metaAttachments: ['VT-7 Spiritfire', 'BAS-B Long', '3x Optic', 'Bruen Heavy', '30 Round'],
    ttk: { close: 240, mid: 240, long: 360 }
  },
  {
    id: 'soa-subverter', name: 'SOA Subverter', category: 'assault',
    description: 'FAL moderna. Semi-auto veloce, controllabile.',
    damage: { head: 72, chest: 48, stomach: 44, limbs: 44 },
    fireRateRPM: 550, magazineSize: 20, reloadTime: 2.5,
    range: { damageDropStart: 40, damageDropEnd: 80 },
    adsTime: 275, sprintToFire: 235, tacSprintToFire: 305,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Semi-auto veloce', 'Controllabile'],
    ttk: { close: 218, mid: 218, long: 327 }
  },
  {
    id: 'dtir-30-06', name: 'DTIR 30-06', category: 'assault',
    description: 'Garand M1 moderna. Ping nostalgico, 2-shot.',
    damage: { head: 90, chest: 60, stomach: 55, limbs: 55 },
    fireRateRPM: 400, magazineSize: 8, reloadTime: 3.0,
    range: { damageDropStart: 60, damageDropEnd: 120 },
    adsTime: 310, sprintToFire: 260, tacSprintToFire: 330,
    recoilVertical: 6, recoilHorizontal: 5,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Nostalgia', '2-shot kill', 'Garand'],
    ttk: { close: 300, mid: 300, long: 450 }
  },
  {
    id: 'marksman-receiver', name: 'MTZ-762 Receiver', category: 'assault',
    description: 'MTZ in modalità battle rifle. Danno + range.',
    damage: { head: 78, chest: 52, stomach: 48, limbs: 48 },
    fireRateRPM: 480, magazineSize: 20, reloadTime: 2.8,
    range: { damageDropStart: 50, damageDropEnd: 100 },
    adsTime: 295, sprintToFire: 255, tacSprintToFire: 325,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'C', isMeta: false,
    recommendedModes: ['warzone'],
    difficulty: 'medium',
    bestFor: ['MTZ alternativa', 'Danno'],
    ttk: { close: 250, mid: 250, long: 375 }
  },
  {
    id: 'mcw-receiver', name: 'MCW 6.8 Receiver', category: 'assault',
    description: 'MCW come battle rifle. Precisa, lenta.',
    damage: { head: 69, chest: 46, stomach: 42, limbs: 42 },
    fireRateRPM: 520, magazineSize: 20, reloadTime: 2.6,
    range: { damageDropStart: 55, damageDropEnd: 110 },
    adsTime: 285, sprintToFire: 245, tacSprintToFire: 315,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Precisione', 'Controllabile'],
    ttk: { close: 231, mid: 231, long: 346 }
  }
];

// ============================================
// ASSAULT RIFLES - 10 armi
// ============================================
const ASSAULT_RIFLES: Weapon[] = [
  {
    id: 'sva-545', name: 'SVA 545', category: 'assault',
    description: 'AK-74 russa. Prima hit extra-veloce, controllabilissima.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 657, magazineSize: 30, reloadTime: 2.3,
    range: { damageDropStart: 25, damageDropEnd: 50 },
    adsTime: 240, sprintToFire: 210, tacSprintToFire: 280,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'S', isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Principianti', 'Precisione', 'All-range'],
    metaAttachments: ['VT-7 Suppressor', 'STV Precision', 'MK.3 Reflector', 'Bruen Pivot', '60 Round'],
    ttk: { close: 182, mid: 273, long: 364 }
  },
  {
    id: 'holger-556', name: 'Holger 556', category: 'assault',
    description: 'G36C tedesca. Laser beam, zero recoil.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 612, magazineSize: 30, reloadTime: 2.4,
    range: { damageDropStart: 30, damageDropEnd: 60 },
    adsTime: 260, sprintToFire: 220, tacSprintToFire: 290,
    recoilVertical: 2, recoilHorizontal: 1,
    tier: 'S', isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Zero recoil', 'Long range'],
    metaAttachments: ['VT-7 Spiritfire', 'Chri Long', 'Slate Reflector', 'Bruen Heavy', '60 Round'],
    ttk: { close: 196, mid: 294, long: 392 }
  },
  {
    id: 'ram-7', name: 'RAM-7', category: 'assault',
    description: 'Tavor israeliana. Bullpup compatta, fire rate alto.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800, magazineSize: 30, reloadTime: 2.2,
    range: { damageDropStart: 18, damageDropEnd: 40 },
    adsTime: 225, sprintToFire: 195, tacSprintToFire: 265,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'medium',
    bestFor: ['Rush AR', 'Mobilità'],
    metaAttachments: ['L4R Flash', 'RAM Short', 'MK.3', 'XRK Edge', '40 Round'],
    ttk: { close: 150, mid: 225, long: 300 }
  },
  {
    id: 'mtz-556', name: 'MTZ-556', category: 'assault',
    description: 'Ctar-21 israeliana. Compatta, agile.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 757, magazineSize: 30, reloadTime: 2.1,
    range: { damageDropStart: 20, damageDropEnd: 45 },
    adsTime: 230, sprintToFire: 200, tacSprintToFire: 270,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'A', isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'medium',
    bestFor: ['Mobilità', 'Rush controllato'],
    ttk: { close: 198, mid: 297, long: 396 }
  },
  {
    id: 'mcw', name: 'MCW (ACR)', category: 'assault',
    description: 'ACR iconica. Precisa, versatile.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 705, magazineSize: 30, reloadTime: 2.2,
    range: { damageDropStart: 25, damageDropEnd: 50 },
    adsTime: 245, sprintToFire: 215, tacSprintToFire: 285,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Nostalgia', 'Versatilità'],
    ttk: { close: 204, mid: 306, long: 408 }
  },
  {
    id: 'mtz-762', name: 'MTZ-762 (SCAR-H)', category: 'assault',
    description: 'Battle rifle 7.62. Danno devastante.',
    damage: { head: 72, chest: 48, stomach: 44, limbs: 44 },
    fireRateRPM: 550, magazineSize: 20, reloadTime: 2.6,
    range: { damageDropStart: 40, damageDropEnd: 80 },
    adsTime: 280, sprintToFire: 240, tacSprintToFire: 320,
    recoilVertical: 6, recoilHorizontal: 4,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer', 'warzone'],
    difficulty: 'medium',
    bestFor: ['Danno pesante', 'Warzone'],
    ttk: { close: 218, mid: 218, long: 218 }
  },
  {
    id: 'dg-58', name: 'DG-58 (Famas)', category: 'assault',
    description: 'Famas a raffica. Burst 3 colpi.',
    damage: { head: 60, chest: 40, stomach: 37, limbs: 37 },
    fireRateRPM: 857, magazineSize: 30, reloadTime: 2.5,
    range: { damageDropStart: 35, damageDropEnd: 70 },
    adsTime: 270, sprintToFire: 230, tacSprintToFire: 300,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'hard',
    bestFor: ['Burst player'],
    ttk: { close: 140, mid: 210, long: 280 }
  },
  {
    id: 'kastov-762', name: 'Kastov 762 (AK-47)', category: 'assault',
    description: 'AK-47 classica. Danno pesante.',
    damage: { head: 63, chest: 42, stomach: 39, limbs: 39 },
    fireRateRPM: 600, magazineSize: 30, reloadTime: 2.4,
    range: { damageDropStart: 35, damageDropEnd: 70 },
    adsTime: 265, sprintToFire: 225, tacSprintToFire: 295,
    recoilVertical: 6, recoilHorizontal: 5,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer', 'warzone'],
    difficulty: 'medium',
    bestFor: ['Danno pesante', 'Nostalgia'],
    ttk: { close: 200, mid: 300, long: 400 }
  },
  {
    id: 'sidewinder', name: 'Sidewinder (Groza)', category: 'assault',
    description: 'Groza russa. Full-auto aggressiva.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 750, magazineSize: 30, reloadTime: 2.3,
    range: { damageDropStart: 20, damageDropEnd: 45 },
    adsTime: 250, sprintToFire: 220, tacSprintToFire: 290,
    recoilVertical: 7, recoilHorizontal: 6,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Aggressive player'],
    ttk: { close: 160, mid: 240, long: 320 }
  },
  {
    id: 'fr-556', name: 'FR 5.56 (F2000)', category: 'assault',
    description: 'F2000 bullpup. Burst rapido.',
    damage: { head: 57, chest: 38, stomach: 35, limbs: 35 },
    fireRateRPM: 900, magazineSize: 30, reloadTime: 2.3,
    range: { damageDropStart: 30, damageDropEnd: 55 },
    adsTime: 235, sprintToFire: 205, tacSprintToFire: 275,
    recoilVertical: 6, recoilHorizontal: 5,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Burst aggressive'],
    ttk: { close: 133, mid: 200, long: 266 }
  }
];

// ============================================
// SMG - 12 armi (aggiunte mancanti)
// ============================================
const SMGS: Weapon[] = [
  {
    id: 'striker', name: 'Striker (UMP45)', category: 'smg',
    description: 'UMP45 iconica. Controllabile, 50 colpi.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 600, magazineSize: 30, reloadTime: 2.0,
    range: { damageDropStart: 12, damageDropEnd: 25 },
    adsTime: 200, sprintToFire: 120, tacSprintToFire: 160,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'S', isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Principianti SMG', '50 round'],
    ttk: { close: 200, mid: 300, long: 600 }
  },
  {
    id: 'wsp-swarm', name: 'WSP Swarm (Micro Uzi)', category: 'smg',
    description: 'Micro Uzi. 1000 RPM, melt istantaneo.',
    damage: { head: 42, chest: 28, stomach: 26, limbs: 26 },
    fireRateRPM: 1000, magazineSize: 32, reloadTime: 1.9,
    range: { damageDropStart: 8, damageDropEnd: 15 },
    adsTime: 190, sprintToFire: 110, tacSprintToFire: 150,
    recoilVertical: 7, recoilHorizontal: 6,
    tier: 'S', isMeta: true,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'medium',
    bestFor: ['Hyper aggressive', '1000 RPM'],
    ttk: { close: 120, mid: 240, long: 480 }
  },
  {
    id: 'rival-9', name: 'Rival-9 (Vector)', category: 'smg',
    description: 'Kriss Vector. 1075 RPM estremo.',
    damage: { head: 42, chest: 28, stomach: 26, limbs: 26 },
    fireRateRPM: 1075, magazineSize: 25, reloadTime: 1.8,
    range: { damageDropStart: 8, damageDropEnd: 16 },
    adsTime: 185, sprintToFire: 105, tacSprintToFire: 145,
    recoilVertical: 8, recoilHorizontal: 7,
    tier: 'A', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Estremo rush'],
    ttk: { close: 111, mid: 222, long: 444 }
  },
  {
    id: 'striker-9', name: 'Striker 9 (MP9)', category: 'smg',
    description: 'MP9 9mm. Veloce, controllabile.',
    damage: { head: 45, chest: 30, stomach: 28, limbs: 28 },
    fireRateRPM: 850, magazineSize: 32, reloadTime: 1.9,
    range: { damageDropStart: 9, damageDropEnd: 18 },
    adsTime: 195, sprintToFire: 115, tacSprintToFire: 155,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'A', isMeta: false,
    recommendedModes: ['multiplayer', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Controllabile', 'Fire rate alto'],
    ttk: { close: 141, mid: 282, long: 564 }
  },
  {
    id: 'amr9', name: 'AMR9', category: 'smg',
    description: 'SMG equilibrata.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 750, magazineSize: 30, reloadTime: 2.1,
    range: { damageDropStart: 10, damageDropEnd: 22 },
    adsTime: 205, sprintToFire: 125, tacSprintToFire: 165,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Equilibrio'],
    ttk: { close: 160, mid: 320, long: 640 }
  },
  {
    id: 'lockwood-680', name: 'Lockwood 680 (MPX)', category: 'smg',
    description: 'MPX. Precisa, laser.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800, magazineSize: 30, reloadTime: 2.0,
    range: { damageDropStart: 11, damageDropEnd: 24 },
    adsTime: 200, sprintToFire: 120, tacSprintToFire: 160,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Precisione SMG'],
    ttk: { close: 150, mid: 300, long: 600 }
  },
  {
    id: 'wsp-9', name: 'WSP-9 (Uzi)', category: 'smg',
    description: 'Uzi classica. Lenta, controllabile.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 550, magazineSize: 32, reloadTime: 2.3,
    range: { damageDropStart: 15, damageDropEnd: 30 },
    adsTime: 215, sprintToFire: 135, tacSprintToFire: 175,
    recoilVertical: 2, recoilHorizontal: 2,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Range SMG'],
    ttk: { close: 218, mid: 327, long: 654 }
  },
  {
    id: 'fr5-56-smg', name: 'FR 5.56 (F2000 SMG)', category: 'smg',
    description: 'Burst 3 colpi.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 900, magazineSize: 30, reloadTime: 2.2,
    range: { damageDropStart: 12, damageDropEnd: 25 },
    adsTime: 240, sprintToFire: 130, tacSprintToFire: 170,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Burst'],
    ttk: { close: 133, mid: 200, long: 400 }
  },
  
  // SMG mancanti aggiunti
  {
    id: 'fennec-45', name: 'Fennec 45 (Vector alt)', category: 'smg',
    description: 'Vector alternativa. 1200 RPM estremo.',
    damage: { head: 39, chest: 26, stomach: 24, limbs: 24 },
    fireRateRPM: 1200, magazineSize: 30, reloadTime: 1.7,
    range: { damageDropStart: 6, damageDropEnd: 12 },
    adsTime: 180, sprintToFire: 100, tacSprintToFire: 140,
    recoilVertical: 9, recoilHorizontal: 8,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['RPM estremo', 'Melt istantaneo'],
    ttk: { close: 100, mid: 200, long: 400 }
  },
  {
    id: 'lachmann-sub', name: 'Lachmann Sub (MP5)', category: 'smg',
    description: 'MP5 classica. Leggendaria, versatile.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800, magazineSize: 30, reloadTime: 2.0,
    range: { damageDropStart: 11, damageDropEnd: 22 },
    adsTime: 200, sprintToFire: 120, tacSprintToFire: 160,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer', 'warzone', 'ranked'],
    difficulty: 'easy',
    bestFor: ['Classica', 'Versatile', 'Nostalgia'],
    ttk: { close: 150, mid: 300, long: 600 }
  },
  {
    id: 'iso-45', name: 'ISO 45', category: 'smg',
    description: 'SMG compatta. ADS veloce, controllabile.',
    damage: { head: 45, chest: 30, stomach: 28, limbs: 28 },
    fireRateRPM: 900, magazineSize: 30, reloadTime: 1.9,
    range: { damageDropStart: 9, damageDropEnd: 18 },
    adsTime: 190, sprintToFire: 110, tacSprintToFire: 150,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['ADS veloce', 'Controllabile'],
    ttk: { close: 133, mid: 266, long: 532 }
  },
  {
    id: 'vaznev-9k', name: 'Vaznev-9k', category: 'smg',
    description: 'PP-19 Bizon. 64 colpi, no ricarica.',
    damage: { head: 45, chest: 30, stomach: 28, limbs: 28 },
    fireRateRPM: 750, magazineSize: 64, reloadTime: 2.2,
    range: { damageDropStart: 10, damageDropEnd: 20 },
    adsTime: 210, sprintToFire: 125, tacSprintToFire: 165,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['64 colpi', 'No ricarica', 'Sparare per ore'],
    ttk: { close: 160, mid: 320, long: 640 }
  }
];

// ============================================
// LMG - 6 armi
// ============================================
const LMGS: Weapon[] = [
  {
    id: 'taq-evolvere', name: 'TAQ Evolvere', category: 'lmg',
    description: 'Belt-fed 150 colpi. Area denial.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 650, magazineSize: 150, reloadTime: 8.5,
    range: { damageDropStart: 40, damageDropEnd: 80 },
    adsTime: 450, sprintToFire: 280, tacSprintToFire: 350,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'A', isMeta: true,
    recommendedModes: ['warzone', 'multiplayer'],
    difficulty: 'medium',
    bestFor: ['Supporto', '150 colpi', 'Warzone'],
    ttk: { close: 184, mid: 276, long: 368 }
  },
  {
    id: 'bruen-mk9', name: 'Bruen MK9', category: 'lmg',
    description: 'M249. Bilanciata, precisa.',
    damage: { head: 51, chest: 34, stomach: 31, limbs: 31 },
    fireRateRPM: 750, magazineSize: 100, reloadTime: 7.0,
    range: { damageDropStart: 35, damageDropEnd: 70 },
    adsTime: 400, sprintToFire: 260, tacSprintToFire: 330,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'B', isMeta: false,
    recommendedModes: ['warzone', 'multiplayer'],
    difficulty: 'easy',
    bestFor: ['Supporto mobile'],
    ttk: { close: 160, mid: 320, long: 480 }
  },
  {
    id: 'holger-26', name: 'Holger 26', category: 'lmg',
    description: 'MG36. Compatta per LMG.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 700, magazineSize: 100, reloadTime: 6.5,
    range: { damageDropStart: 30, damageDropEnd: 60 },
    adsTime: 380, sprintToFire: 240, tacSprintToFire: 310,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['LMG leggera'],
    ttk: { close: 171, mid: 342, long: 514 }
  },
  {
    id: 'raal-mg', name: 'RAAL MG', category: 'lmg',
    description: 'LMG pesante .338. Danno enorme.',
    damage: { head: 72, chest: 48, stomach: 44, limbs: 44 },
    fireRateRPM: 550, magazineSize: 75, reloadTime: 9.0,
    range: { damageDropStart: 50, damageDropEnd: 100 },
    adsTime: 500, sprintToFire: 300, tacSprintToFire: 380,
    recoilVertical: 6, recoilHorizontal: 4,
    tier: 'B', isMeta: false,
    recommendedModes: ['warzone'],
    difficulty: 'hard',
    bestFor: ['Danno estremo', 'Anti-vehicle'],
    ttk: { close: 218, mid: 218, long: 218 }
  },
  {
    id: 'pulemyot', name: 'Pulemyot 762', category: 'lmg',
    description: 'PKP Pecheneg russa. 200 colpi.',
    damage: { head: 54, chest: 36, stomach: 33, limbs: 33 },
    fireRateRPM: 600, magazineSize: 200, reloadTime: 10.0,
    range: { damageDropStart: 45, damageDropEnd: 90 },
    adsTime: 480, sprintToFire: 290, tacSprintToFire: 360,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'C', isMeta: false,
    recommendedModes: ['warzone'],
    difficulty: 'hard',
    bestFor: ['200 colpi', 'Camping'],
    ttk: { close: 200, mid: 300, long: 400 }
  },
  {
    id: 'dg-58-lmg', name: 'DG-58 LSW', category: 'lmg',
    description: 'LSW bullpup. Mobile per LMG.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800, magazineSize: 60, reloadTime: 5.5,
    range: { damageDropStart: 25, damageDropEnd: 50 },
    adsTime: 360, sprintToFire: 230, tacSprintToFire: 300,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['LMG mobile'],
    ttk: { close: 150, mid: 300, long: 450 }
  }
];

// ============================================
// SNIPER RIFLES - 4 armi
// ============================================
const SNIPERS: Weapon[] = [
  {
    id: 'katt-amr', name: 'KATT-AMR', category: 'sniper',
    description: 'Barrett .50cal. One-shot torso.',
    damage: { head: 300, chest: 220, stomach: 150, limbs: 150 },
    fireRateRPM: 50, magazineSize: 5, reloadTime: 4.5,
    range: { damageDropStart: 100, damageDropEnd: 200 },
    adsTime: 650, sprintToFire: 400, tacSprintToFire: 500,
    recoilVertical: 8, recoilHorizontal: 6,
    tier: 'S', isMeta: true,
    recommendedModes: ['warzone', 'multiplayer'],
    difficulty: 'medium',
    bestFor: ['One-shot', 'Anti-sniper', 'Warzone'],
    ttk: { close: 1200, mid: 1200, long: 1200 }
  },
  {
    id: 'kv-inhibitor', name: 'KV Inhibitor', category: 'sniper',
    description: 'Sniper bullpup. Bolt-action veloce.',
    damage: { head: 250, chest: 160, stomach: 100, limbs: 100 },
    fireRateRPM: 60, magazineSize: 10, reloadTime: 3.5,
    range: { damageDropStart: 80, damageDropEnd: 150 },
    adsTime: 550, sprintToFire: 350, tacSprintToFire: 450,
    recoilVertical: 7, recoilHorizontal: 5,
    tier: 'A', isMeta: false,
    recommendedModes: ['multiplayer', 'warzone'],
    difficulty: 'hard',
    bestFor: ['Quickscope', 'Aggressive sniper'],
    ttk: { close: 1000, mid: 1000, long: 1000 }
  },
  {
    id: 'longbow', name: 'Longbow', category: 'sniper',
    description: 'Sniper compatta. ADS veloce.',
    damage: { head: 220, chest: 140, stomach: 90, limbs: 90 },
    fireRateRPM: 70, magazineSize: 8, reloadTime: 3.0,
    range: { damageDropStart: 60, damageDropEnd: 120 },
    adsTime: 480, sprintToFire: 300, tacSprintToFire: 400,
    recoilVertical: 6, recoilHorizontal: 4,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Quickscope', 'Aggressive'],
    ttk: { close: 857, mid: 857, long: 857 }
  },
  {
    id: 'xrk-stalker', name: 'XRK Stalker', category: 'sniper',
    description: 'Sniper pesante. Stabile, lenta.',
    damage: { head: 280, chest: 200, stomach: 140, limbs: 140 },
    fireRateRPM: 40, magazineSize: 5, reloadTime: 5.0,
    range: { damageDropStart: 120, damageDropEnd: 250 },
    adsTime: 750, sprintToFire: 450, tacSprintToFire: 550,
    recoilVertical: 5, recoilHorizontal: 3,
    tier: 'B', isMeta: false,
    recommendedModes: ['warzone'],
    difficulty: 'medium',
    bestFor: ['Long range estremo', 'Camping'],
    ttk: { close: 1500, mid: 1500, long: 1500 }
  }
];

// ============================================
// MARKSMAN RIFLES - 5 armi
// ============================================
const MARKSMANS: Weapon[] = [
  {
    id: 'mcw-68', name: 'MCW 6.8', category: 'marksman',
    description: 'DMR semi-auto. 2-shot kill.',
    damage: { head: 108, chest: 72, stomach: 66, limbs: 66 },
    fireRateRPM: 400, magazineSize: 20, reloadTime: 2.8,
    range: { damageDropStart: 60, damageDropEnd: 120 },
    adsTime: 350, sprintToFire: 250, tacSprintToFire: 320,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'A', isMeta: true,
    recommendedModes: ['warzone', 'multiplayer'],
    difficulty: 'medium',
    bestFor: ['2-shot DMR', 'Warzone support'],
    ttk: { close: 300, mid: 300, long: 300 }
  },
  {
    id: 'mtz-interceptor', name: 'MTZ Interceptor', category: 'marksman',
    description: 'DMR 7.62. Danno pesante.',
    damage: { head: 120, chest: 80, stomach: 74, limbs: 74 },
    fireRateRPM: 350, magazineSize: 20, reloadTime: 3.0,
    range: { damageDropStart: 70, damageDropEnd: 140 },
    adsTime: 380, sprintToFire: 270, tacSprintToFire: 340,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'B', isMeta: false,
    recommendedModes: ['warzone'],
    difficulty: 'medium',
    bestFor: ['DMR pesante'],
    ttk: { close: 343, mid: 343, long: 343 }
  },
  {
    id: 'sidewinder-mr', name: 'Sidewinder (DMR)', category: 'marksman',
    description: 'DMR automatica. Veloce, recoil.',
    damage: { head: 90, chest: 60, stomach: 55, limbs: 55 },
    fireRateRPM: 500, magazineSize: 20, reloadTime: 2.5,
    range: { damageDropStart: 50, damageDropEnd: 100 },
    adsTime: 320, sprintToFire: 230, tacSprintToFire: 300,
    recoilVertical: 6, recoilHorizontal: 5,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['DMR automatica'],
    ttk: { close: 360, mid: 360, long: 360 }
  },
  {
    id: 'crossbow', name: 'Crossbow', category: 'marksman',
    description: 'Arbalete. One-shot, progettile.',
    damage: { head: 250, chest: 200, stomach: 150, limbs: 150 },
    fireRateRPM: 30, magazineSize: 1, reloadTime: 3.0,
    range: { damageDropStart: 40, damageDropEnd: 80 },
    adsTime: 400, sprintToFire: 280, tacSprintToFire: 350,
    recoilVertical: 2, recoilHorizontal: 1,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Fun', 'One-shot'],
    ttk: { close: 2000, mid: 2000, long: 2000 }
  },
  {
    id: 'kar98k', name: 'Kar98k', category: 'marksman',
    description: 'Icona WWII. Quickscope nostalgico.',
    damage: { head: 250, chest: 140, stomach: 100, limbs: 100 },
    fireRateRPM: 55, magazineSize: 5, reloadTime: 3.5,
    range: { damageDropStart: 70, damageDropEnd: 130 },
    adsTime: 420, sprintToFire: 300, tacSprintToFire: 380,
    recoilVertical: 7, recoilHorizontal: 5,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Quickscope', 'Nostalgia'],
    ttk: { close: 1091, mid: 1091, long: 1091 }
  }
];

// ============================================
// SHOTGUNS - 5 armi
// ============================================
const SHOTGUNS: Weapon[] = [
  {
    id: 'haymaker', name: 'Haymaker', category: 'shotgun',
    description: 'Semi-auto spam. Rate of fire alto.',
    damage: { head: 300, chest: 150, stomach: 150, limbs: 150 },
    fireRateRPM: 300, magazineSize: 12, reloadTime: 3.0,
    range: { damageDropStart: 5, damageDropEnd: 12 },
    adsTime: 280, sprintToFire: 150, tacSprintToFire: 200,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Spam', 'Multi-kill'],
    ttk: { close: 200, mid: 9999, long: 9999 }
  },
  {
    id: 'lockwood-680-pump', name: 'Lockwood 680', category: 'shotgun',
    description: 'Pump action classica. One-shot potential.',
    damage: { head: 350, chest: 175, stomach: 175, limbs: 175 },
    fireRateRPM: 70, magazineSize: 8, reloadTime: 4.0,
    range: { damageDropStart: 7, damageDropEnd: 15 },
    adsTime: 300, sprintToFire: 180, tacSprintToFire: 240,
    recoilVertical: 6, recoilHorizontal: 5,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['One-shot', 'Precisione'],
    ttk: { close: 857, mid: 9999, long: 9999 }
  },
  {
    id: 'riveter', name: 'Riveter', category: 'shotgun',
    description: 'Shotgun full-auto. Melt istantaneo.',
    damage: { head: 250, chest: 125, stomach: 125, limbs: 125 },
    fireRateRPM: 400, magazineSize: 20, reloadTime: 3.5,
    range: { damageDropStart: 4, damageDropEnd: 10 },
    adsTime: 260, sprintToFire: 140, tacSprintToFire: 190,
    recoilVertical: 7, recoilHorizontal: 6,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Full-auto', 'Melt'],
    ttk: { close: 150, mid: 9999, long: 9999 }
  },
  {
    id: 'reclaimer-18', name: 'Reclaimer 18', category: 'shotgun',
    description: 'Double barrel. 2 shot rapidi.',
    damage: { head: 400, chest: 200, stomach: 200, limbs: 200 },
    fireRateRPM: 200, magazineSize: 2, reloadTime: 2.5,
    range: { damageDropStart: 6, damageDropEnd: 12 },
    adsTime: 250, sprintToFire: 130, tacSprintToFire: 180,
    recoilVertical: 8, recoilHorizontal: 7,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['2-shot burst', 'High risk'],
    ttk: { close: 300, mid: 9999, long: 9999 }
  },
  {
    id: 'model-1887', name: 'Model 1887', category: 'shotgun',
    description: 'Lever action. Akimbo nostalgico.',
    damage: { head: 280, chest: 140, stomach: 140, limbs: 140 },
    fireRateRPM: 90, magazineSize: 7, reloadTime: 4.5,
    range: { damageDropStart: 8, damageDropEnd: 16 },
    adsTime: 320, sprintToFire: 170, tacSprintToFire: 230,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Akimbo', 'Nostalgia'],
    ttk: { close: 667, mid: 9999, long: 9999 }
  }
];

// ============================================
// PISTOLS - 4 armi
// ============================================
const PISTOLS: Weapon[] = [
  {
    id: 'cor-45', name: 'COR-45', category: 'pistol',
    description: 'Pistola standard. Bilanciata.',
    damage: { head: 72, chest: 48, stomach: 44, limbs: 44 },
    fireRateRPM: 450, magazineSize: 13, reloadTime: 1.8,
    range: { damageDropStart: 15, damageDropEnd: 30 },
    adsTime: 150, sprintToFire: 100, tacSprintToFire: 130,
    recoilVertical: 4, recoilHorizontal: 3,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Secondary standard'],
    ttk: { close: 400, mid: 600, long: 900 }
  },
  {
    id: 'renetti', name: 'Renetti', category: 'pistol',
    description: 'Burst 3 colpi. TTK alto.',
    damage: { head: 66, chest: 44, stomach: 40, limbs: 40 },
    fireRateRPM: 900, magazineSize: 15, reloadTime: 1.6,
    range: { damageDropStart: 12, damageDropEnd: 25 },
    adsTime: 140, sprintToFire: 90, tacSprintToFire: 120,
    recoilVertical: 5, recoilHorizontal: 4,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Burst secondary'],
    ttk: { close: 200, mid: 400, long: 800 }
  },
  {
    id: 'tyr', name: 'Tyr', category: 'pistol',
    description: 'Pistola .50. One-shot head.',
    damage: { head: 200, chest: 100, stomach: 90, limbs: 90 },
    fireRateRPM: 120, magazineSize: 5, reloadTime: 2.5,
    range: { damageDropStart: 25, damageDropEnd: 50 },
    adsTime: 200, sprintToFire: 130, tacSprintToFire: 170,
    recoilVertical: 8, recoilHorizontal: 6,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['One-shot potential'],
    ttk: { close: 500, mid: 750, long: 1000 }
  },
  {
    id: 'wsp-stinger', name: 'WSP Stinger', category: 'pistol',
    description: 'Machine pistol. Full-auto.',
    damage: { head: 48, chest: 32, stomach: 29, limbs: 29 },
    fireRateRPM: 800, magazineSize: 20, reloadTime: 1.7,
    range: { damageDropStart: 10, damageDropEnd: 20 },
    adsTime: 160, sprintToFire: 95, tacSprintToFire: 125,
    recoilVertical: 6, recoilHorizontal: 5,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Full-auto secondary'],
    ttk: { close: 225, mid: 450, long: 900 }
  }
];

// ============================================
// LAUNCHERS - 4 armi
// ============================================
const LAUNCHERS: Weapon[] = [
  {
    id: 'stormender', name: 'Stormender', category: 'launcher',
    description: 'Launcher EMP. Disabilita streak.',
    damage: { head: 0, chest: 0, stomach: 0, limbs: 0 },
    fireRateRPM: 30, magazineSize: 1, reloadTime: 4.0,
    range: { damageDropStart: 50, damageDropEnd: 100 },
    adsTime: 400, sprintToFire: 250, tacSprintToFire: 320,
    recoilVertical: 2, recoilHorizontal: 1,
    tier: 'A', isMeta: true,
    recommendedModes: ['multiplayer', 'warzone'],
    difficulty: 'easy',
    bestFor: ['Anti-streak', 'EMP'],
    ttk: { close: 9999, mid: 9999, long: 9999 }
  },
  {
    id: 'rpg-7', name: 'RPG-7', category: 'launcher',
    description: 'Rocket launcher. Danno area.',
    damage: { head: 300, chest: 300, stomach: 300, limbs: 300 },
    fireRateRPM: 15, magazineSize: 1, reloadTime: 5.0,
    range: { damageDropStart: 100, damageDropEnd: 200 },
    adsTime: 450, sprintToFire: 300, tacSprintToFire: 380,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'easy',
    bestFor: ['Area damage', 'Fun'],
    ttk: { close: 4000, mid: 4000, long: 4000 }
  },
  {
    id: 'pilum', name: 'Pilum', category: 'launcher',
    description: 'Guided launcher. Anti-vehicle.',
    damage: { head: 350, chest: 350, stomach: 350, limbs: 350 },
    fireRateRPM: 20, magazineSize: 1, reloadTime: 4.5,
    range: { damageDropStart: 150, damageDropEnd: 300 },
    adsTime: 500, sprintToFire: 320, tacSprintToFire: 400,
    recoilVertical: 2, recoilHorizontal: 1,
    tier: 'B', isMeta: false,
    recommendedModes: ['warzone'],
    difficulty: 'medium',
    bestFor: ['Anti-vehicle', 'Guided'],
    ttk: { close: 3000, mid: 3000, long: 3000 }
  },
  {
    id: ' Tor-35', name: 'TOR-35', category: 'launcher',
    description: 'M320 GLM. Grenade launcher.',
    damage: { head: 200, chest: 200, stomach: 200, limbs: 200 },
    fireRateRPM: 25, magazineSize: 1, reloadTime: 3.0,
    range: { damageDropStart: 80, damageDropEnd: 150 },
    adsTime: 350, sprintToFire: 240, tacSprintToFire: 300,
    recoilVertical: 3, recoilHorizontal: 2,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'medium',
    bestFor: ['Indirect fire'],
    ttk: { close: 2400, mid: 2400, long: 2400 }
  }
];

// ============================================
// MELEE - 2 armi
// ============================================
const MELEES: Weapon[] = [
  {
    id: 'combat-knife', name: 'Combat Knife', category: 'melee',
    description: 'Knife. One-hit melee.',
    damage: { head: 150, chest: 100, stomach: 100, limbs: 100 },
    fireRateRPM: 60, magazineSize: 0, reloadTime: 0,
    range: { damageDropStart: 2, damageDropEnd: 2 },
    adsTime: 100, sprintToFire: 50, tacSprintToFire: 70,
    recoilVertical: 0, recoilHorizontal: 0,
    tier: 'B', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Stealth', 'Fun'],
    ttk: { close: 1000, mid: 9999, long: 9999 }
  },
  {
    id: 'sledgehammer', name: 'Sledgehammer', category: 'melee',
    description: 'Hammer pesante. Range lungo.',
    damage: { head: 200, chest: 150, stomach: 150, limbs: 150 },
    fireRateRPM: 40, magazineSize: 0, reloadTime: 0,
    range: { damageDropStart: 3, damageDropEnd: 3 },
    adsTime: 120, sprintToFire: 60, tacSprintToFire: 80,
    recoilVertical: 0, recoilHorizontal: 0,
    tier: 'C', isMeta: false,
    recommendedModes: ['multiplayer'],
    difficulty: 'hard',
    bestFor: ['Range melee'],
    ttk: { close: 1500, mid: 9999, long: 9999 }
  }
];

// ============================================
// TACTICALS & LETHALS (equipaggiamento)
// ============================================
export const TACTICALS = [
  { id: 'smoke', name: 'Smoke Grenade', use: 'Copertura visiva' },
  { id: 'flash', name: 'Flash Grenade', use: 'Aceccare nemici' },
  { id: 'stun', name: 'Stun Grenade', use: 'Rallentare movimento' },
  { id: 'decoy', name: 'Decoy Grenade', use: 'Confondere radar' },
  { id: 'snapshot', name: 'Snapshot', use: 'Spot nemici' },
  { id: 'tear-gas', name: 'Tear Gas', use: 'Area denial' },
  { id: 'heartbeat', name: 'Heartbeat Sensor', use: 'Radar portatile' }
];

export const LETHALS = [
  { id: 'frag', name: 'Frag Grenade', damage: 150, radius: 8 },
  { id: 'semtex', name: 'Semtex', damage: 140, radius: 7, sticky: true },
  { id: 'c4', name: 'C4', damage: 200, radius: 10, remote: true },
  { id: 'claymore', name: 'Claymore', damage: 180, radius: 5, trap: true },
  { id: 'thermite', name: 'Thermite', damage: 100, radius: 4, burn: true },
  { id: 'molotov', name: 'Molotov', damage: 120, radius: 6, burn: true },
  { id: 'throwing-knife', name: 'Throwing Knife', damage: 200, instantKill: true },
  { id: 'drill-charge', name: 'Drill Charge', damage: 250, wallbang: true }
];

// ============================================
// EXPORT COMPLETO
// ============================================
export const ALL_WEAPONS: Weapon[] = [
  ...BATTLE_RIFLES,
  ...ASSAULT_RIFLES,
  ...SMGS,
  ...LMGS,
  ...SNIPERS,
  ...MARKSMANS,
  ...SHOTGUNS,
  ...PISTOLS,
  ...LAUNCHERS,
  ...MELEES
];

// Statistiche complete
export const WEAPON_STATS = {
  total: ALL_WEAPONS.length,
  byCategory: {
    battleRifle: BATTLE_RIFLES.length,
    assault: ASSAULT_RIFLES.length,
    smg: SMGS.length,
    lmg: LMGS.length,
    sniper: SNIPERS.length,
    marksman: MARKSMANS.length,
    shotgun: SHOTGUNS.length,
    pistol: PISTOLS.length,
    launcher: LAUNCHERS.length,
    melee: MELEES.length
  },
  metaCount: ALL_WEAPONS.filter(w => w.isMeta).length,
  sTier: ALL_WEAPONS.filter(w => w.tier === 'S').length,
  tacticals: TACTICALS.length,
  lethals: LETHALS.length
};

// Helper functions
export const getWeaponById = (id: string) => ALL_WEAPONS.find(w => w.id === id);
export const getWeaponsByCategory = (cat: WeaponCategory) => ALL_WEAPONS.filter(w => w.category === cat);
export const getMetaWeapons = () => ALL_WEAPONS.filter(w => w.isMeta);
export const getBestTTK = (range: 'close'|'mid'|'long', limit=5) => 
  [...ALL_WEAPONS].sort((a,b) => a.ttk[range] - b.ttk[range]).slice(0, limit);

export default ALL_WEAPONS;
