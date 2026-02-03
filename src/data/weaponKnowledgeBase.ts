// ============================================
// COD WEAPON KNOWLEDGE BASE - MW3 / Warzone
// Complete database for RAG
// ============================================

export interface WeaponKnowledge {
  id: string;
  name: string;
  category: 'assault_rifle' | 'smg' | 'lmg' | 'sniper' | 'shotgun' | 'marksman' | 'pistol';
  description: string;
  stats: {
    damage: number;
    fire_rate: number;
    accuracy: number;
    range: number;
    mobility: number;
    control: number;
  };
  meta_tier: 'S' | 'A' | 'B' | 'C' | 'D';
  playstyle_tags: string[];
  ttk_close?: number;
  ttk_mid?: number;
  ttk_long?: number;
}

export const WEAPON_KNOWLEDGE_BASE: WeaponKnowledge[] = [
  // ASSAULT RIFLES
  {
    id: 'mcw',
    name: 'MCW',
    category: 'assault_rifle',
    description: 'High damage AR with excellent range and low recoil. Current meta favorite for mid-to-long engagements.',
    stats: { damage: 78, fire_rate: 72, accuracy: 82, range: 85, mobility: 68, control: 80 },
    meta_tier: 'S',
    playstyle_tags: ['meta', 'mid_range', 'tactical', 'aggressive'],
    ttk_close: 220,
    ttk_mid: 280,
    ttk_long: 320
  },
  {
    id: 'ram-7',
    name: 'RAM-7',
    category: 'assault_rifle',
    description: 'Fast firing bullpup AR ideal for aggressive playstyles. High RPM with manageable recoil.',
    stats: { damage: 72, fire_rate: 85, accuracy: 75, range: 70, mobility: 75, control: 72 },
    meta_tier: 'A',
    playstyle_tags: ['aggressive', 'close_mid', 'rusher', 'meta'],
    ttk_close: 180,
    ttk_mid: 240,
    ttk_long: 300
  },
  {
    id: 'mtz-556',
    name: 'MTZ-556',
    category: 'assault_rifle',
    description: 'Versatile 5.56 AR with balanced stats. Good for players who want adaptability.',
    stats: { damage: 70, fire_rate: 78, accuracy: 80, range: 75, mobility: 72, control: 78 },
    meta_tier: 'B',
    playstyle_tags: ['balanced', 'versatile', 'beginner_friendly']
  },
  {
    id: 'holger-26',
    name: 'Holger 26',
    category: 'assault_rifle',
    description: 'Converted LMG with AR mobility. High magazine capacity, excellent for sustained fights.',
    stats: { damage: 75, fire_rate: 74, accuracy: 78, range: 80, mobility: 65, control: 76 },
    meta_tier: 'A',
    playstyle_tags: ['sustained', 'tactical', 'high_capacity', 'support']
  },
  {
    id: 'sv-a545',
    name: 'SVA 545',
    category: 'assault_rifle',
    description: 'Russian AR with unique two-round burst mechanic. High skill ceiling weapon.',
    stats: { damage: 76, fire_rate: 70, accuracy: 84, range: 82, mobility: 68, control: 74 },
    meta_tier: 'B',
    playstyle_tags: ['high_skill', 'precision', 'burst', 'tactical']
  },
  
  // SMGs
  {
    id: 'striker',
    name: 'Striker',
    category: 'smg',
    description: 'Classic UMP-style SMG with high damage per shot. Best TTK in class at close range.',
    stats: { damage: 82, fire_rate: 75, accuracy: 72, range: 55, mobility: 85, control: 70 },
    meta_tier: 'S',
    playstyle_tags: ['meta', 'aggressive', 'close_range', 'rusher'],
    ttk_close: 150,
    ttk_mid: 280
  },
  {
    id: 'wsp-swarm',
    name: 'WSP Swarm',
    category: 'smg',
    description: 'Ultra-high fire rate SMG for aggressive rushers. Melts at close range but high recoil.',
    stats: { damage: 68, fire_rate: 92, accuracy: 65, range: 45, mobility: 90, control: 62 },
    meta_tier: 'A',
    playstyle_tags: ['aggressive', 'rusher', 'close_range', 'high_skill'],
    ttk_close: 140,
    ttk_mid: 320
  },
  {
    id: 'amr9',
    name: 'AMR9',
    category: 'smg',
    description: 'Balanced SMG with good range for its class. Reliable secondary for AR users.',
    stats: { damage: 74, fire_rate: 80, accuracy: 78, range: 60, mobility: 82, control: 76 },
    meta_tier: 'A',
    playstyle_tags: ['balanced', 'versatile', 'meta', 'mid_range']
  },
  {
    id: 'rival-9',
    name: 'Rival-9',
    category: 'smg',
    description: 'High mobility SMG with quick ADS. Perfect for run-and-gun playstyles.',
    stats: { damage: 72, fire_rate: 82, accuracy: 70, range: 50, mobility: 88, control: 68 },
    meta_tier: 'B',
    playstyle_tags: ['aggressive', 'rusher', 'mobile', 'close_range']
  },
  
  // LMGS
  {
    id: 'pulemyot',
    name: 'Pulemyot 762',
    category: 'lmg',
    description: 'Hard hitting Russian LMG with slow fire rate but massive damage. Best for holding angles.',
    stats: { damage: 85, fire_rate: 65, accuracy: 75, range: 88, mobility: 45, control: 70 },
    meta_tier: 'B',
    playstyle_tags: ['tactical', 'defensive', 'camper', 'long_range', 'high_capacity']
  },
  {
    id: 'taq-evolvere',
    name: 'TAQ Evolvere',
    category: 'lmg',
    description: 'Modern LMG with controllable recoil and good mobility for its class.',
    stats: { damage: 78, fire_rate: 72, accuracy: 80, range: 85, mobility: 52, control: 78 },
    meta_tier: 'A',
    playstyle_tags: ['sustained', 'tactical', 'support', 'mid_long']
  },
  
  // SNIPERS
  {
    id: 'katt-amr',
    name: 'KATT-AMR',
    category: 'sniper',
    description: 'Heavy anti-material sniper. One-shot kill to upper body. Slowest ADS but highest damage.',
    stats: { damage: 98, fire_rate: 25, accuracy: 90, range: 95, mobility: 30, control: 65 },
    meta_tier: 'S',
    playstyle_tags: ['one_shot', 'camper', 'long_range', 'high_skill', 'meta']
  },
  {
    id: 'longbow',
    name: 'Longbow',
    category: 'sniper',
    description: 'Aggressive sniper with fast ADS and good mobility. Favors quickscopers.',
    stats: { damage: 85, fire_rate: 45, accuracy: 85, range: 88, mobility: 55, control: 72 },
    meta_tier: 'A',
    playstyle_tags: ['aggressive', 'quickscope', 'mobile', 'high_skill']
  },
  {
    id: 'kv-inhibitor',
    name: 'KV Inhibitor',
    category: 'sniper',
    description: 'Semi-auto sniper for follow-up shots. Good for players who struggle with bolt-action.',
    stats: { damage: 78, fire_rate: 55, accuracy: 82, range: 85, mobility: 48, control: 80 },
    meta_tier: 'B',
    playstyle_tags: ['forgiving', 'sustained', 'mid_long', 'beginner_friendly']
  },
  
  // SHOTGUNS
  {
    id: 'haymaker',
    name: 'Haymaker',
    category: 'shotgun',
    description: 'Semi-auto shotgun with drum magazine. Room-clearing capability at close range.',
    stats: { damage: 90, fire_rate: 60, accuracy: 55, range: 35, mobility: 75, control: 60 },
    meta_tier: 'B',
    playstyle_tags: ['aggressive', 'close_range', 'rusher', 'room_clear']
  },
  {
    id: 'lockwood-680',
    name: 'Lockwood 680',
    category: 'shotgun',
    description: 'Pump-action shotgun with longest one-shot range in class. Precision weapon.',
    stats: { damage: 95, fire_rate: 35, accuracy: 65, range: 45, mobility: 70, control: 68 },
    meta_tier: 'B',
    playstyle_tags: ['precision', 'close_range', 'one_shot', 'tactical']
  },
  
  // MARKSMAN
  {
    id: 'mcw-68',
    name: 'MCW 6.8',
    category: 'marksman',
    description: 'Semi-auto marksman rifle. Two-shot kill at most ranges. Bridge between AR and sniper.',
    stats: { damage: 82, fire_rate: 55, accuracy: 85, range: 82, mobility: 60, control: 78 },
    meta_tier: 'B',
    playstyle_tags: ['precision', 'mid_long', 'tactical', 'support']
  },
  {
    id: 'mtz-interceptor',
    name: 'MTZ Interceptor',
    category: 'marksman',
    description: 'Fast firing marksman with low recoil. Good for aggressive mid-range players.',
    stats: { damage: 78, fire_rate: 65, accuracy: 82, range: 78, mobility: 68, control: 82 },
    meta_tier: 'B',
    playstyle_tags: ['aggressive', 'mid_range', 'versatile']
  }
];

// Attachments database
export interface AttachmentKnowledge {
  id: string;
  name: string;
  category: 'optic' | 'muzzle' | 'barrel' | 'magazine' | 'grip' | 'stock' | 'laser' | 'underbarrel';
  description: string;
  pros: string[];
  cons: string[];
  compatible_weapons: string[];
  meta_score: number; // 0-100
}

export const ATTACHMENT_KNOWLEDGE_BASE: AttachmentKnowledge[] = [
  // OPTICS
  {
    id: 'slate-reflector',
    name: 'Slate Reflector',
    category: 'optic',
    description: 'Clear red dot sight for close to mid range',
    pros: ['Clear sight picture', 'Fast ADS'],
    cons: ['No zoom'],
    compatible_weapons: ['MCW', 'Striker', 'RAM-7', 'AMR9', 'WSP Swarm'],
    meta_score: 85
  },
  {
    id: 'corvus-gen2',
    name: 'Corvus Gen-2 4x',
    category: 'optic',
    description: '4x scope for mid to long range engagements',
    pros: ['4x zoom', 'Good for range'],
    cons: ['Slower ADS', 'Glare'],
    compatible_weapons: ['MCW', 'Holger 26', 'SVA 545', 'MCW 6.8'],
    meta_score: 80
  },
  {
    id: 'mk-3-reflector',
    name: 'MK.3 Reflector',
    category: 'optic',
    description: 'Precision optic with 3.5x zoom',
    pros: ['Good zoom level', 'Clean reticle'],
    cons: ['Moderate ADS penalty'],
    compatible_weapons: ['MCW', 'RAM-7', 'MTZ-556', 'Holger 26'],
    meta_score: 75
  },
  
  // MUZZLES
  {
    id: 'vt-7-spiritfire',
    name: 'VT-7 Spiritfire Suppressor',
    category: 'muzzle',
    description: 'Meta suppressor for most ARs and SMGs',
    pros: ['Sound suppression', 'Recoil control', 'Damage range'],
    cons: ['ADS speed', 'Movement speed'],
    compatible_weapons: ['MCW', 'RAM-7', 'Striker', 'AMR9'],
    meta_score: 95
  },
  {
    id: 'l4r-flash',
    name: 'L4R Flash Hider',
    category: 'muzzle',
    description: 'Hides muzzle flash and reduces recoil',
    pros: ['No muzzle flash', 'Recoil control'],
    cons: ['No suppression'],
    compatible_weapons: ['MCW', 'MTZ-556', 'Holger 26', 'SVA 545'],
    meta_score: 70
  },
  
  // BARRELS
  {
    id: 'archon-heavy',
    name: 'Archon Heavy Barrel',
    category: 'barrel',
    description: 'Heavy barrel for maximum range and recoil control',
    pros: ['Bullet velocity', 'Damage range', 'Recoil control'],
    cons: ['ADS speed', 'Movement'],
    compatible_weapons: ['MCW', 'RAM-7'],
    meta_score: 88
  },
  {
    id: 'short-barrel',
    name: 'Short Barrel',
    category: 'barrel',
    description: 'Short barrel for maximum mobility',
    pros: ['ADS speed', 'Movement', 'Hipfire'],
    cons: ['Range', 'Velocity'],
    compatible_weapons: ['MCW', 'Striker', 'WSP Swarm', 'AMR9'],
    meta_score: 82
  },
  
  // MAGAZINES
  {
    id: '40-round',
    name: '40 Round Mag',
    category: 'magazine',
    description: 'Extended magazine for sustained fights',
    pros: ['Ammo capacity'],
    cons: ['Reload speed', 'ADS speed'],
    compatible_weapons: ['MCW', 'RAM-7', 'MTZ-556'],
    meta_score: 90
  },
  {
    id: '60-round',
    name: '60 Round Drum',
    category: 'magazine',
    description: 'High capacity drum for squad wipes',
    pros: ['High capacity'],
    cons: ['Slow reload', 'Heavy ADS penalty'],
    compatible_weapons: ['Holger 26', 'MCW'],
    meta_score: 75
  },
  
  // GRIPS
  {
    id: 'bruen-pivot',
    name: 'Bruen Pivot Vertical Grip',
    category: 'grip',
    description: 'Meta vertical grip for recoil control',
    pros: ['Vertical recoil', 'Gun kick'],
    cons: ['ADS speed'],
    compatible_weapons: ['MCW', 'RAM-7', 'Holger 26', 'MTZ-556'],
    meta_score: 92
  },
  {
    id: 'xtreme-tac',
    name: 'XTEN ERX-10 Tactical',
    category: 'grip',
    description: 'Tactical grip for aggressive players',
    pros: ['ADS speed', 'Sprint to fire'],
    cons: ['Recoil control'],
    compatible_weapons: ['MCW', 'Striker', 'WSP Swarm'],
    meta_score: 85
  },
  
  // STOCKS
  {
    id: 'no-stock',
    name: 'No Stock',
    category: 'stock',
    description: 'Remove stock for maximum mobility',
    pros: ['ADS speed', 'Movement', 'Hipfire'],
    cons: ['Recoil', 'Gun kick', 'Aim stability'],
    compatible_weapons: ['Striker', 'WSP Swarm', 'AMR9'],
    meta_score: 88
  },
  {
    id: 'heavy-stock',
    name: 'Heavy Stock',
    category: 'stock',
    description: 'Heavy stock for stability',
    pros: ['Aim stability', 'Recoil', 'Flinch resistance'],
    cons: ['ADS speed', 'Movement'],
    compatible_weapons: ['MCW', 'Holger 26', 'SVA 545'],
    meta_score: 75
  }
];

// Search function for local fallback
export function searchWeaponsLocal(query: string): WeaponKnowledge[] {
  const lowerQuery = query.toLowerCase();
  return WEAPON_KNOWLEDGE_BASE.filter(w => 
    w.name.toLowerCase().includes(lowerQuery) ||
    w.category.includes(lowerQuery) ||
    w.playstyle_tags.some(tag => tag.includes(lowerQuery))
  );
}

export function findSimilarWeapons(weaponName: string, playstyle?: string): WeaponKnowledge[] {
  const weapon = WEAPON_KNOWLEDGE_BASE.find(w => 
    w.name.toLowerCase() === weaponName.toLowerCase()
  );
  
  if (!weapon) return [];
  
  return WEAPON_KNOWLEDGE_BASE
    .filter(w => w.id !== weapon.id)
    .map(w => ({
      ...w,
      similarity: calculateSimilarity(weapon, w, playstyle)
    }))
    .sort((a, b) => (b as any).similarity - (a as any).similarity)
    .slice(0, 5);
}

function calculateSimilarity(w1: WeaponKnowledge, w2: WeaponKnowledge, playstyle?: string): number {
  let score = 0;
  
  // Same category = high similarity
  if (w1.category === w2.category) score += 40;
  
  // Similar stats
  const statDiff = Math.abs(w1.stats.damage - w2.stats.damage) +
    Math.abs(w1.stats.fire_rate - w2.stats.fire_rate) +
    Math.abs(w1.stats.range - w2.stats.range);
  score += Math.max(0, 30 - statDiff / 5);
  
  // Shared playstyle tags
  const sharedTags = w1.playstyle_tags.filter(tag => 
    w2.playstyle_tags.includes(tag)
  );
  score += sharedTags.length * 10;
  
  // Playstyle preference match
  if (playstyle && w2.playstyle_tags.includes(playstyle)) score += 20;
  
  return Math.min(100, score);
}
