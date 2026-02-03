// ============================================
// DATABASE ARMI - COD MW3 META
// ============================================

import type { WeaponBuild, PlayerStats } from '@/types';

export const weaponBuilds: WeaponBuild[] = [
  // MCW - META AR
  {
    id: 'mcw-meta',
    weapon_name: 'MCW',
    build_name: 'TACTICAL ELITE',
    description: 'La configurazione META per MCW. Equilibrio perfetto tra precisione e potenza di fuoco.',
    category: 'assault_rifle',
    attachments: [
      { slot: 'CANNA', name: 'Second Line Mammoth Heavy', pros: ['+ Range', '+ Danno'], cons: ['- ADS Speed'] },
      { slot: 'BOCCA', name: 'Shadowstrike Suppressor', pros: ['Silenziata', '+ Range'], cons: [] },
      { slot: 'OTTICA', name: 'MK. 3 Reflector', pros: ['Mira pulita'], cons: [] },
      { slot: 'SOTTOCANNA', name: 'DR-6 Handstop', pros: ['+ Mobilità', '+ Controllo'], cons: [] },
      { slot: 'IMPUGNATURA', name: 'RB Claw-Psl Grip', pros: ['+ Controllo rinculo'], cons: [] },
    ],
    stats: { damage: 82, accuracy: 86, range: 90, fire_rate: 72, mobility: 76, control: 89 },
    pros: ['Versatile a ogni distanza', 'Rinculo controllabile', 'Silenziata', 'TTK competitivo'],
    cons: ['ADS leggermente lento', 'Richiede unlock alto'],
    is_meta: true,
    difficulty: 'medium',
  },
  
  // MCW - AGGRESSIVE
  {
    id: 'mcw-aggro',
    weapon_name: 'MCW',
    build_name: 'RUSH COMMANDER',
    description: 'Configurazione aggressiva per chi vuole dominare il campo. ADS veloce, mobilità estrema.',
    category: 'assault_rifle',
    attachments: [
      { slot: 'CANNA', name: 'Kirmua Blackiron Short', pros: ['+ ADS Speed', '+ Mobilità'], cons: ['- Range'] },
      { slot: 'BOCCA', name: 'Zehmn35 Compensated', pros: ['+ Controllo'], cons: [] },
      { slot: 'CALCIO', name: 'SL Collapsed Stockless', pros: ['+ Mobilità estrema'], cons: ['- Stabilità'] },
      { slot: 'SOTTOCANNA', name: 'XRK Edge BW-4', pros: ['+ ADS', '+ Movimento'], cons: [] },
      { slot: 'CARICATORE', name: '60 Round Drum', pros: ['60 colpi'], cons: ['- Ricarica'] },
    ],
    stats: { damage: 78, accuracy: 82, range: 65, fire_rate: 72, mobility: 92, control: 78 },
    pros: ['ADS velocissimo', 'Mobilità estrema', '60 colpi', 'Perfetta per rushare'],
    cons: ['Range ridotto', 'Rinculo più difficile'],
    is_meta: false,
    difficulty: 'hard',
  },
  
  // STRIKER - META SMG
  {
    id: 'striker-meta',
    weapon_name: 'STRIKER',
    build_name: 'SMG SUPREME',
    description: 'La SMG più letale del gioco. TTK devastante, controllabile, versatile.',
    category: 'smg',
    attachments: [
      { slot: 'CANNA', name: 'Striker Recon Long Barrel', pros: ['+ Range', '+ Danno'], cons: [] },
      { slot: 'BOCCA', name: 'Zehmn35 Compensated', pros: ['+ Controllo verticale'], cons: [] },
      { slot: 'CALCIO', name: 'Assault Stock', pros: ['+ Stabilità ADS'], cons: [] },
      { slot: 'SOTTOCANNA', name: 'DR-6 Handstop', pros: ['+ Mobilità'], cons: [] },
      { slot: 'IMPUGNATURA', name: 'Sakin ZX Grip', pros: ['+ Controllo'], cons: [] },
    ],
    stats: { damage: 74, accuracy: 84, range: 72, fire_rate: 82, mobility: 85, control: 88 },
    pros: ['TTK eccezionale', 'Versatile', 'Controllabile', 'META in Warzone'],
    cons: ['Richiede unlock alto'],
    is_meta: true,
    difficulty: 'medium',
  },
  
  // STRIKER - NOOB FRIENDLY
  {
    id: 'striker-noob',
    weapon_name: 'STRIKER',
    build_name: 'STABILITY MASTER',
    description: 'Configurazione per chi inizia. Controllo rinculo massimo, facile da usare.',
    category: 'smg',
    attachments: [
      { slot: 'CANNA', name: 'Striker Factory', pros: ['+ Controllo'], cons: [] },
      { slot: 'BOCCA', name: 'Purifier Muzzle Brake', pros: ['+ Controllo rinculo'], cons: ['- Velocità'] },
      { slot: 'CALCIO', name: 'Heavy Support Stock', pros: ['+ Stabilità'], cons: ['- Mobilità'] },
      { slot: 'SOTTOCANNA', name: 'SL Skeletal Vertical', pros: ['+ Controllo'], cons: [] },
      { slot: 'IMPUGNATURA', name: 'Rubberized Grip', pros: ['+ Controllo'], cons: [] },
    ],
    stats: { damage: 70, accuracy: 88, range: 60, fire_rate: 82, mobility: 78, control: 95 },
    pros: ['Rinculo minimo', 'Facile da usare', 'Perdonante', 'Ideale per beginners'],
    cons: ['Danno ridotto', 'ADS lento'],
    is_meta: false,
    difficulty: 'easy',
  },
  
  // SUPERI 46 - VERSATILE
  {
    id: 'superi-meta',
    weapon_name: 'SUPERI 46',
    build_name: 'ALL-ROUNDER PRO',
    description: 'SMG che eccelle a tutte le distanze. La scelta dei professionisti.',
    category: 'smg',
    attachments: [
      { slot: 'CANNA', name: 'Superi Long Barrel', pros: ['+ Range', '+ Danno'], cons: [] },
      { slot: 'BOCCA', name: 'Shadowstrike Suppressor', pros: ['Silenziata', '+ Range'], cons: [] },
      { slot: 'OTTICA', name: 'Slate Reflector', pros: ['Mira precisa'], cons: [] },
      { slot: 'SOTTOCANNA', name: 'XRK Edge BW-4', pros: ['+ Mobilità'], cons: [] },
      { slot: 'IMPUGNATURA', name: 'FTAC MSP-98', pros: ['+ Controllo'], cons: [] },
    ],
    stats: { damage: 77, accuracy: 85, range: 78, fire_rate: 80, mobility: 84, control: 84 },
    pros: ['Range eccezionale per SMG', 'Versatile', 'Silenziata', 'TTK ottimo'],
    cons: ['ADS medio', 'Sblocca tardi'],
    is_meta: true,
    difficulty: 'medium',
  },
  
  // KV INHIBITOR - SNIPER
  {
    id: 'kv-sniper',
    weapon_name: 'KV INHIBITOR',
    build_name: 'ONE-SHOT KILL',
    description: 'Sniper bolt-action devastante. One-shot kill alla testa e torso.',
    category: 'sniper',
    attachments: [
      { slot: 'CANNA', name: 'Kastovia Long Barrel', pros: ['+ Velocità proiettile'], cons: [] },
      { slot: 'BOCCA', name: 'Sonic Suppressor XL', pros: ['Silenziata', '+ Range'], cons: [] },
      { slot: 'LASER', name: 'SL Razorhawk', pros: ['+ Stabilità'], cons: ['Visibile'] },
      { slot: 'OTTURATORE', name: 'Quick Bolt', pros: ['+ Rateo fuoco'], cons: [] },
      { slot: 'IMPUGNATURA', name: 'Stip-40 Grip', pros: ['+ Controllo'], cons: [] },
    ],
    stats: { damage: 100, accuracy: 94, range: 110, fire_rate: 30, mobility: 35, control: 78 },
    pros: ['One-shot kill', 'Range infinito', 'Silenziata', 'Danno estremo'],
    cons: ['ADS lento', 'Richiede precisione', 'Punisce errori'],
    is_meta: true,
    difficulty: 'hard',
  },
  
  // BAS-B - BATTLE RIFLE
  {
    id: 'basb-meta',
    weapon_name: 'BAS-B',
    build_name: 'BATTLE RIFLE GOD',
    description: 'Battle rifle devastante. Danno elevato, range eccezionale, TTK basso.',
    category: 'marksman',
    attachments: [
      { slot: 'CANNA', name: 'BAS-B Long Barrel', pros: ['+ Range', '+ Danno'], cons: [] },
      { slot: 'BOCCA', name: 'VT-7 Spiritfire', pros: ['+ Range', '+ Controllo'], cons: [] },
      { slot: 'OTTICA', name: 'JAK Glassless', pros: ['Mira pulita'], cons: [] },
      { slot: 'SOTTOCANNA', name: 'Bruen Heavy Support', pros: ['+ Stabilità'], cons: ['- Mobilità'] },
      { slot: 'IMPUGNATURA', name: 'Stip-40 Grip', pros: ['+ Controllo'], cons: [] },
    ],
    stats: { damage: 92, accuracy: 88, range: 92, fire_rate: 58, mobility: 62, control: 88 },
    pros: ['Danno estremo', 'Range eccezionale', 'TTK basso', 'Versatile'],
    cons: ['Cadenza bassa', 'Richiede buona mira'],
    is_meta: true,
    difficulty: 'hard',
  },
  
  // HOLGER 26 - LMG
  {
    id: 'holger-lmg',
    weapon_name: 'HOLGER 26',
    build_name: 'SUPPORT GUNNER',
    description: 'LMG precisa per supporto a distanza. 100 colpi di fuoco continuo.',
    category: 'lmg',
    attachments: [
      { slot: 'CANNA', name: 'Holger Long Barrel', pros: ['+ Range', '+ Precisione'], cons: [] },
      { slot: 'BOCCA', name: 'VT-7 Spiritfire', pros: ['+ Range'], cons: [] },
      { slot: 'OTTICA', name: '3.0x Scope', pros: ['Precisione media'], cons: [] },
      { slot: 'SOTTOCANNA', name: 'Bruen Heavy Support', pros: ['+ Stabilità'], cons: [] },
      { slot: 'CARICATORE', name: '100 Round Belt', pros: ['100 colpi'], cons: ['- Ricarica'] },
    ],
    stats: { damage: 86, accuracy: 92, range: 100, fire_rate: 72, mobility: 42, control: 92 },
    pros: ['100 colpi', 'Precisione estrema', 'Range infinito', 'Stabilità massima'],
    cons: ['ADS lentissimo', 'Mobilità zero', 'Ricarica eterna'],
    is_meta: false,
    difficulty: 'medium',
  },
];

// Detect playstyle from stats
export const detectPlaystyle = (stats: { kd_ratio: number; accuracy: number; spm: number }): 'aggressive' | 'defensive' | 'balanced' | 'camper' => {
  if (stats.spm > 350 && stats.kd_ratio > 1.2) return 'aggressive';
  if (stats.spm < 200 && stats.kd_ratio < 1.0) return 'camper';
  if (stats.spm > 280 && stats.kd_ratio > 1.0) return 'balanced';
  return 'defensive';
};

// Get rank based on performance
export const getRank = (kd: number, accuracy: number): string => {
  const score = kd * 100 + accuracy * 10;
  if (score >= 400) return 'LEGEND';
  if (score >= 320) return 'ELITE';
  if (score >= 250) return 'VETERAN';
  if (score >= 190) return 'HARDENED';
  if (score >= 140) return 'REGULAR';
  return 'RECRUIT';
};

// Get rank color
export const getRankColor = (rank: string): string => {
  const colors: Record<string, string> = {
    'LEGEND': 'text-yellow-400',
    'ELITE': 'text-purple-400',
    'VETERAN': 'text-emerald-400',
    'HARDENED': 'text-blue-400',
    'REGULAR': 'text-slate-400',
    'RECRUIT': 'text-amber-700',
  };
  return colors[rank] || 'text-slate-400';
};

// Get builds based on stats
export const getBuildsByStats = (kd: number, accuracy: number): WeaponBuild[] => {
  // Beginner (low KD, low accuracy)
  if (kd < 0.9 && accuracy < 20) {
    return [
      weaponBuilds[3], // Striker - Noob Friendly
      weaponBuilds[0], // MCW - Meta
      weaponBuilds[4], // Superi 46
    ];
  }
  
  // Expert (high KD, high accuracy)
  if (kd > 1.5 && accuracy > 25) {
    return [
      weaponBuilds[1], // MCW - Aggressive
      weaponBuilds[5], // KV Sniper
      weaponBuilds[6], // BAS-B
    ];
  }
  
  // Default - balanced
  return [
    weaponBuilds[2], // Striker - Meta
    weaponBuilds[0], // MCW - Meta
    weaponBuilds[4], // Superi 46
  ];
};

// Generate analysis text
export const generateAnalysis = (stats: PlayerStats): string => {
  const playstyle = detectPlaystyle(stats);
  const rank = getRank(stats.kd_ratio, stats.accuracy);
  
  let analysis = `ANALISI OPERATIVA - LIVELLO ${rank}\\n`;
  analysis += `═══════════════════════════════════════\\n\\n`;
  
  // K/D Analysis
  analysis += `[K/D RATIO] ${stats.kd_ratio.toFixed(2)}\\n`;
  if (stats.kd_ratio < 0.9) {
    analysis += `► Stato: SOTTO LA MEDIA\\n`;
    analysis += `► Analisi: Stai morendo più di quanto uccidi.\\n`;
    analysis += `► Raccomandazione: Usa build più perdonanti, focus su posizionamento.\\n\\n`;
  } else if (stats.kd_ratio < 1.3) {
    analysis += `► Stato: BUONO\\n`;
    analysis += `► Analisi: Performance solida, margine di miglioramento.\\n`;
    analysis += `► Raccomandazione: Ottimizza loadout per spingerti oltre 1.5.\\n\\n`;
  } else {
    analysis += `► Stato: ECCELLENTE\\n`;
    analysis += `► Analisi: Performance da top player.\\n`;
    analysis += `► Raccomandazione: Prova build avanzate, sfida te stesso.\\n\\n`;
  }
  
  // Accuracy Analysis
  analysis += `[ACCURACY] ${stats.accuracy}%\\n`;
  if (stats.accuracy < 18) {
    analysis += `► Stato: DA MIGLIORARE\\n`;
    analysis += `► Analisi: Manchi molti colpi.\\n`;
    analysis += `► Raccomandazione: Armi ad alta cadenza compensano accuracy bassa.\\n\\n`;
  } else if (stats.accuracy < 28) {
    analysis += `► Stato: NELLA MEDIA\\n`;
    analysis += `► Analisi: Accuracy discreta.\\n`;
    analysis += `► Raccomandazione: Con la giusta build puoi migliorare.\\n\\n`;
  } else {
    analysis += `► Stato: ECCELLENTE\\n`;
    analysis += `► Analisi: Precisione ottima.\\n`;
    analysis += `► Raccomandazione: Puoi usare armi più impegnative ma rewarding.\\n\\n`;
  }
  
  // SPM Analysis
  analysis += `[SCORE PER MIN] ${stats.spm}\\n`;
  if (stats.spm < 220) {
    analysis += `► Stato: PASSIVO\\n`;
    analysis += `► Analisi: Gioco troppo difensivo.\\n`;
    analysis += `► Raccomandazione: Pusha di più, cerca engagement.\\n\\n`;
  } else if (stats.spm < 320) {
    analysis += `► Stato: ATTIVO\\n`;
    analysis += `► Analisi: Ritmo discreto.\\n`;
    analysis += `► Raccomandazione: Puoi essere più aggressivo.\\n\\n`;
  } else {
    analysis += `► Stato: MOLTO ATTIVO\\n`;
    analysis += `► Analisi: Ottimo ritmo di gioco.\\n`;
    analysis += `► Raccomandazione: Continua così, contribuisci alla squadra.\\n\\n`;
  }
  
  // Playstyle
  analysis += `[STILE DI GIOCO] ${playstyle.toUpperCase()}\\n`;
  analysis += `► Rilevato: ${playstyle === 'aggressive' ? 'Rush, push costante' : playstyle === 'defensive' ? 'Supporto, copertura' : playstyle === 'camper' ? 'Posizionamento, attesa' : 'Equilibrato, adattivo'}\\n\\n`;
  
  analysis += `═══════════════════════════════════════\\n`;
  analysis += `LOADOUT CONSIGLIATO GENERATO\\n`;
  analysis += `═══════════════════════════════════════`;
  
  return analysis;
};

// Generate tips
export const generateTips = (stats: PlayerStats): string[] => {
  const tips: string[] = [];
  
  if (stats.accuracy < 20) {
    tips.push('🎯 TRAINING: Gioca Shoot House contro bot (livello facile) per allenare la mira');
    tips.push('🎯 SENSIBILITÀ: Prova ad abbassare la sensibilità del 10-15%');
    tips.push('🎯 PRE-AIM: Pre-mira gli angoli prima di girare');
  }
  
  if (stats.kd_ratio < 0.9) {
    tips.push('🛡️ POSIZIONAMENTO: Non rushare, usa cover e move cover-to-cover');
    tips.push('🛡️ MINIMAP: Guarda sempre la minimap prima di muoverti');
    tips.push('🛡️ AUDIO: Usa cuffie e ascolta i passi nemici');
  }
  
  if (stats.spm < 220) {
    tips.push('⚡ AGGRESSIVITÀ: Pusha dopo ogni kill, non campeggiare');
    tips.push('⚡ ROTAZIONI: Segui i compagni e aiuta nelle fight');
    tips.push('⚡ UAV: Sparare UAV nemici dà punti e aiuta la squadra');
  }
  
  if (stats.headshot_percent < 15) {
    tips.push('🎯 MIRA ALTA: Mira sempre al petto/testa, non ai piedi');
    tips.push('🎯 RECOIL: Impara i pattern di rinculo delle armi');
  }
  
  if (tips.length === 0) {
    tips.push('✅ OTTIME STATISTICHE! Continua così e sperimenta nuove armi');
    tips.push('✅ RANKED: Prova a giocare ranked per sfidarti con player migliori');
    tips.push('✅ ANALISI: Registra le tue partite e analizza gli errori');
  }
  
  return tips;
};
