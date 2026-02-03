// ============================================
// RAG ENGINE - COD Intelligence
// Retrieval Augmented Generation per profilazione giocatori
// ============================================

import { supabase } from './supabase';
import { generateEmbedding } from './openai';
import type { PlayerStats, WeaponBuild } from '@/types';

// Knowledge Base armi (popolato da JSON/crawling)
const WEAPON_DB: WeaponKnowledge[] = [
  // Popolato dinamicamente o importato da JSON
];

interface WeaponKnowledge {
  id: string;
  name: string;
  category: string;
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
}

// ============================================
// 1. WEAPON RECOGNITION + RETRIEVAL
// ============================================

export interface DetectedWeapon {
  name: string;
  confidence: number;
  category: string;
  attachments: DetectedAttachment[];
}

export interface DetectedAttachment {
  slot: string;
  name: string;
  effects: string[];
}

/**
 * Fase 1: OCR + Retrieval
 * Da screenshot arma -> Trova nel DB -> Restituisci dati completi
 */
export async function recognizeWeaponAndRetrieve(
  imageBase64: string
): Promise<{
  detected: DetectedWeapon;
  similarWeapons: WeaponKnowledge[];
  suggestedAttachments: any[];
}> {
  // 1. OCR con Vision per estrarre nome arma e attachments
  const ocrResult = await extractWeaponFromImage(imageBase64);
  
  // 2. Genera embedding della descrizione trovata
  const searchQuery = `${ocrResult.weaponName} ${ocrResult.category} ${ocrResult.attachments.join(' ')}`;
  const embedding = await generateEmbedding(searchQuery);
  
  // 3. RAG: Cerca armi simili nel vector DB
  const { data: similarWeapons } = await supabase.rpc('search_similar_weapons', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: 5
  });
  
  // 4. Recupera best match
  const bestMatch = similarWeapons?.[0];
  
  // 5. Cerca attachments consigliati per quell'arma
  const suggestedAttachments = await findOptimalAttachments(
    bestMatch?.name || ocrResult.weaponName,
    ocrResult.playstyleHint
  );
  
  return {
    detected: {
      name: ocrResult.weaponName,
      confidence: ocrResult.confidence,
      category: ocrResult.category,
      attachments: ocrResult.attachments.map((name, i) => ({
        slot: guessAttachmentSlot(name),
        name,
        effects: [] // Popolato dal DB
      }))
    },
    similarWeapons: similarWeapons || [],
    suggestedAttachments
  };
}

/**
 * OCR specifico per armi COD
 */
async function extractWeaponFromImage(imageBase64: string): Promise<{
  weaponName: string;
  category: string;
  attachments: string[];
  playstyleHint: string;
  confidence: number;
}> {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are analyzing a Call of Duty weapon loadout screenshot.
          Identify:
          1. Weapon name (e.g., "MCW", "Striker", "AMR9")
          2. Weapon category (assault_rifle, smg, lmg, sniper, shotgun, marksman)
          3. All visible attachments
          4. Estimated playstyle based on build (aggressive, tactical, camp, rusher)
          
          Return JSON:
          {
            "weaponName": "string",
            "category": "string", 
            "attachments": ["string"],
            "playstyleHint": "string",
            "confidence": 0.0-1.0
          }`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract weapon info from this COD screenshot' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 500
    })
  });
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error('Could not extract weapon from image');
  }
  
  return JSON.parse(jsonMatch[0]);
}

function guessAttachmentSlot(attachmentName: string): string {
  // Euristiche base
  if (attachmentName.toLowerCase().includes('scope') || attachmentName.toLowerCase().includes('optic')) return 'optic';
  if (attachmentName.toLowerCase().includes('barrel')) return 'barrel';
  if (attachmentName.toLowerCase().includes('muzzle')) return 'muzzle';
  if (attachmentName.toLowerCase().includes('mag') || attachmentName.toLowerCase().includes('round')) return 'magazine';
  if (attachmentName.toLowerCase().includes('grip')) return 'grip';
  if (attachmentName.toLowerCase().includes('stock')) return 'stock';
  return 'unknown';
}

async function findOptimalAttachments(weaponName: string, playstyle: string): Promise<any[]> {
  // Query al DB per attachments ottimali
  const { data } = await supabase
    .from('attachment_knowledge')
    .select('*')
    .contains('compatible_weapons', [weaponName])
    .order('meta_score', { ascending: false })
    .limit(10);
    
  return data || [];
}

// ============================================
// 2. PLAYER PROFILING ENGINE
// ============================================

export interface PlayerProfile {
  id: string;
  personaType: string;
  skillTier: string;
  playstyleTags: string[];
  weaponPreferences: string[];
  engagementScore: number;
  investmentScore: number;
  churnRisk: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: 'weapon' | 'content' | 'tip';
  title: string;
  description: string;
  confidence: number;
}

/**
 * Fase 2: Profilazione Completa
 * Combina Stats profilo + Arma identificata
 */
export async function generatePlayerProfile(
  stats: PlayerStats,
  detectedWeapons: DetectedWeapon[]
): Promise<PlayerProfile> {
  // 1. Analizza pattern d'arma
  const weaponAnalysis = analyzeWeaponChoices(detectedWeapons);
  
  // 2. Cross-reference stats + armi
  const playstyleTags = derivePlaystyle(stats, weaponAnalysis);
  
  // 3. Calcola skill tier
  const skillTier = calculateSkillTier(stats);
  
  // 4. Determina persona type
  const personaType = classifyPersona(stats, weaponAnalysis, playstyleTags);
  
  // 5. Scoring
  const engagementScore = calculateEngagement(stats);
  const investmentScore = calculateInvestment(detectedWeapons);
  const churnRisk = predictChurn(stats, engagementScore);
  
  // 6. Genera raccomandazioni
  const recommendations = await generateRecommendations(
    personaType,
    skillTier,
    weaponAnalysis,
    stats
  );
  
  // 7. Salva nel DB con embedding
  const profile: PlayerProfile = {
    id: crypto.randomUUID(),
    personaType,
    skillTier,
    playstyleTags,
    weaponPreferences: detectedWeapons.map(w => w.name),
    engagementScore,
    investmentScore,
    churnRisk,
    recommendations
  };
  
  // Genera embedding del profilo per ricerca simili
  const profileText = `${personaType} ${skillTier} ${playstyleTags.join(' ')} ${weaponAnalysis.weaponClasses.join(' ')}`;
  const profileEmbedding = await generateEmbedding(profileText);
  
  await supabase.from('player_profiles').insert({
    ...profile,
    extracted_stats: stats,
    detected_loadouts: detectedWeapons,
    profile_embedding: profileEmbedding
  });
  
  return profile;
}

// ============================================
// 3. ANALISI PATTERN
// ============================================

function analyzeWeaponChoices(weapons: DetectedWeapon[]) {
  const classes = weapons.map(w => w.category);
  const uniqueClasses = [...new Set(classes)];
  
  // Determina se gioca meta o no
  const metaWeapons = ['MCW', 'Striker', 'RAM-7', 'AMR9']; // S-tier
  const metaCount = weapons.filter(w => metaWeapons.includes(w.name)).length;
  const metaRatio = metaCount / weapons.length;
  
  // Determina versatilità
  const versatility = uniqueClasses.length;
  
  return {
    weaponClasses: uniqueClasses,
    metaRatio,
    versatility,
    primaryPlaystyle: weapons[0]?.attachments.some(a => 
      a.name.toLowerCase().includes('scope') || a.name.toLowerCase().includes('4x')
    ) ? 'tactical' : 'aggressive'
  };
}

function derivePlaystyle(stats: PlayerStats, weaponAnalysis: any): string[] {
  const tags: string[] = [];
  
  // Da stats
  if (stats.kd_ratio > 1.5) tags.push('fragger');
  if (stats.accuracy > 25) tags.push('precise');
  if (stats.spm > 350) tags.push('aggressive');
  if (stats.spm < 250) tags.push('tactical');
  if (stats.win_rate > 55) tags.push('team_player');
  
  // Da armi
  if (weaponAnalysis.metaRatio > 0.7) tags.push('meta_follower');
  else if (weaponAnalysis.metaRatio < 0.3) tags.push('hipster');
  
  if (weaponAnalysis.versatility > 3) tags.push('versatile');
  else tags.push('specialist');
  
  if (weaponAnalysis.primaryPlaystyle === 'tactical') tags.push('methodical');
  else tags.push('rusher');
  
  return [...new Set(tags)];
}

function calculateSkillTier(stats: PlayerStats): string {
  const score = (stats.kd_ratio * 100) + (stats.accuracy * 10) + (stats.spm / 10);
  
  if (score > 500) return 'iridescent';
  if (score > 450) return 'crimson';
  if (score > 400) return 'diamond';
  if (score > 350) return 'platinum';
  if (score > 300) return 'gold';
  if (score > 250) return 'silver';
  return 'bronze';
}

function classifyPersona(
  stats: PlayerStats, 
  weaponAnalysis: any,
  tags: string[]
): string {
  // Algoritmo di classificazione persona
  if (tags.includes('meta_follower') && stats.play_time_hours > 200) {
    return 'meta_warrior';
  }
  if (tags.includes('hipster') && stats.kd_ratio > 1.2) {
    return 'skilled_hipster';
  }
  if (weaponAnalysis.versatility > 4 && stats.play_time_hours > 300) {
    return 'completionist';
  }
  if (stats.spm > 400 && tags.includes('rusher')) {
    return 'aggressive_grinder';
  }
  if (stats.accuracy > 30 && tags.includes('methodical')) {
    return 'tactical_sniper';
  }
  return 'casual_regular';
}

function calculateEngagement(stats: PlayerStats): number {
  // 0-100 score basato su tempo gioco e partite
  const hoursScore = Math.min(stats.play_time_hours / 10, 50);
  const matchesScore = Math.min((stats.total_kills || 0) / 1000, 50);
  return Math.round(hoursScore + matchesScore);
}

function calculateInvestment(weapons: DetectedWeapon[]): number {
  // Stima investimento basato su camo/blueprint rari
  // Placeholder: implementare riconoscimento camo
  return Math.round(weapons.length * 15); // 15 punti per arma diversa
}

function predictChurn(stats: PlayerStats, engagement: number): number {
  // Alto investimento = low churn
  if (stats.play_time_hours > 300) return 10;
  if (stats.play_time_hours < 20) return 80;
  if (engagement < 30) return 60;
  return 30;
}

// ============================================
// 4. GENERAZIONE RACCOMANDAZIONI
// ============================================

async function generateRecommendations(
  persona: string,
  skillTier: string,
  weaponAnalysis: any,
  stats: PlayerStats
): Promise<Recommendation[]> {
  const recs: Recommendation[] = [];
  
  // Raccomanda prossima arma
  const nextWeapon = await suggestNextWeapon(persona, weaponAnalysis, stats);
  recs.push({
    type: 'weapon',
    title: `Prova ${nextWeapon}`,
    description: `Adatta al tuo stile ${persona}`,
    confidence: 0.85
  });
  
  // Content suggestion
  if (persona === 'meta_warrior') {
    recs.push({
      type: 'content',
      title: 'Meta Tier List Aggiornata',
      description: 'Guarda le ultime tier list per restare ahead',
      confidence: 0.90
    });
  }
  
  // Tip personalizzato
  if (stats.kd_ratio < 1.0) {
    recs.push({
      type: 'tip',
      title: 'Migliora il posizionamento',
      description: 'Con il tuo setup attuale, prova a giocare più cover-to-cover',
      confidence: 0.75
    });
  }
  
  return recs;
}

async function suggestNextWeapon(
  persona: string,
  weaponAnalysis: any,
  stats: PlayerStats
): Promise<string> {
  // Usa RAG per trovare arma simile ma diversa
  const query = `weapon for ${persona} playstyle similar to ${weaponAnalysis.weaponClasses.join(' ')}`;
  const embedding = await generateEmbedding(query);
  
  const { data } = await supabase.rpc('search_similar_weapons', {
    query_embedding: embedding,
    match_threshold: 0.6,
    match_count: 3
  });
  
  return data?.[0]?.name || 'MCW';
}

// ============================================
// 5. LOOKALIKE AUDIENCE (Per Marketing)
// ============================================

export async function findLookalikeAudience(
  targetProfileId: string,
  count: number = 100
): Promise<any[]> {
  const { data } = await supabase.rpc('find_similar_players', {
    player_id: targetProfileId,
    match_count: count
  });
  
  return data || [];
}
