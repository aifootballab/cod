// ============================================
// RAG ENGINE - COD Intelligence
// Retrieval Augmented Generation per profilazione giocatori
// ============================================

import { supabase } from './supabase';
import type { PlayerStats } from '@/types';
import { 
  WEAPON_KNOWLEDGE_BASE, 
  ATTACHMENT_KNOWLEDGE_BASE,
  findSimilarWeapons,
  type WeaponKnowledge,
  type AttachmentKnowledge 
} from '@/data/weaponKnowledgeBase';

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

export interface WeaponRecognitionResult {
  detected: DetectedWeapon;
  similarWeapons: WeaponKnowledge[];
  suggestedAttachments: AttachmentKnowledge[];
  knowledgeBaseMatch?: WeaponKnowledge;
}

/**
 * Fase 1: OCR + Retrieval
 * Da screenshot arma -> Trova nel DB -> Restituisci dati completi
 */
export async function recognizeWeaponAndRetrieve(
  imageBase64: string
): Promise<WeaponRecognitionResult> {
  // 1. OCR con Vision per estrarre nome arma e attachments
  const ocrResult = await extractWeaponFromImage(imageBase64);
  
  // 2. Cerca nel knowledge base locale
  const knowledgeMatch = WEAPON_KNOWLEDGE_BASE.find(
    w => w.name.toLowerCase() === ocrResult.weaponName.toLowerCase()
  );
  
  // 3. Trova armi simili (fallback locale se Supabase non disponibile)
  let similarWeapons: WeaponKnowledge[] = [];
  try {
    similarWeapons = findSimilarWeapons(
      ocrResult.weaponName, 
      ocrResult.playstyleHint
    );
  } catch (e) {
    console.log('Using local similarity search');
  }
  
  // 4. Cerca attachments consigliati
  const suggestedAttachments = findOptimalAttachments(
    ocrResult.weaponName,
    ocrResult.attachments,
    ocrResult.playstyleHint
  );
  
  return {
    detected: {
      name: ocrResult.weaponName,
      confidence: ocrResult.confidence,
      category: ocrResult.category || knowledgeMatch?.category || 'unknown',
      attachments: ocrResult.attachments.map((name) => ({
        slot: guessAttachmentSlot(name),
        name,
        effects: getAttachmentEffects(name)
      }))
    },
    similarWeapons,
    suggestedAttachments,
    knowledgeBaseMatch: knowledgeMatch
  };
}

/**
 * OCR specifico per armi COD usando GPT-4 Vision
 */
async function extractWeaponFromImage(imageBase64: string): Promise<{
  weaponName: string;
  category: string;
  attachments: string[];
  playstyleHint: string;
  confidence: number;
}> {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
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
          content: `You are analyzing a Call of Duty weapon loadout screenshot from MW3 or Warzone.
          
          Identify from the visible UI:
          1. Weapon name (e.g., "MCW", "Striker", "AMR9", "KATT-AMR")
          2. Weapon category (assault_rifle, smg, lmg, sniper, shotgun, marksman)
          3. All visible attachment names in the slots
          4. Estimated playstyle based on build (aggressive, tactical, camp, rusher, sniper)
          
          Be precise. If uncertain, use lower confidence.
          
          Return ONLY this JSON format:
          {
            "weaponName": "exact name",
            "category": "category",
            "attachments": ["attachment1", "attachment2"],
            "playstyleHint": "playstyle",
            "confidence": 0.0-1.0
          }`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract weapon info from this COD screenshot. Be precise.' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error('Could not extract weapon from image');
  }
  
  return JSON.parse(jsonMatch[0]);
}

function guessAttachmentSlot(attachmentName: string): string {
  const lower = attachmentName.toLowerCase();
  if (lower.includes('scope') || lower.includes('optic') || lower.includes('reflector') || lower.includes('sight')) return 'optic';
  if (lower.includes('barrel') || lower.includes('long') || lower.includes('short')) return 'barrel';
  if (lower.includes('muzzle') || lower.includes('suppressor') || lower.includes('flash')) return 'muzzle';
  if (lower.includes('mag') || lower.includes('round') || lower.includes('drum')) return 'magazine';
  if (lower.includes('grip') || lower.includes('pivot') || lower.includes('tac')) return 'grip';
  if (lower.includes('stock') || lower.includes('no stock')) return 'stock';
  if (lower.includes('laser')) return 'laser';
  return 'unknown';
}

function getAttachmentEffects(attachmentName: string): string[] {
  const attachment = ATTACHMENT_KNOWLEDGE_BASE.find(
    a => a.name.toLowerCase().includes(attachmentName.toLowerCase()) ||
         attachmentName.toLowerCase().includes(a.name.toLowerCase())
  );
  return attachment ? [...attachment.pros, ...attachment.cons.map(c => `-${c}`)] : [];
}

function findOptimalAttachments(
  weaponName: string, 
  detectedAttachments: string[],
  playstyle?: string
): AttachmentKnowledge[] {
  // Filtra attachments compatibili con l'arma
  const compatible = ATTACHMENT_KNOWLEDGE_BASE.filter(a => 
    a.compatible_weapons.some(w => 
      weaponName.toLowerCase().includes(w.toLowerCase()) ||
      w.toLowerCase().includes(weaponName.toLowerCase())
    )
  );
  
  // Se abbiamo un playstyle, ordina in base alla compatibilità
  if (playstyle) {
    return compatible
      .filter(a => !detectedAttachments.some(da => 
        a.name.toLowerCase().includes(da.toLowerCase())
      ))
      .sort((a, b) => {
        // Preferisci attachments che matchano il playstyle
        const aMatchesPlaystyle = a.pros.some(p => 
          p.toLowerCase().includes(playstyle.toLowerCase())
        );
        const bMatchesPlaystyle = b.pros.some(p => 
          p.toLowerCase().includes(playstyle.toLowerCase())
        );
        if (aMatchesPlaystyle && !bMatchesPlaystyle) return -1;
        if (!aMatchesPlaystyle && bMatchesPlaystyle) return 1;
        return b.meta_score - a.meta_score;
      })
      .slice(0, 5);
  }
  
  return compatible.sort((a, b) => b.meta_score - a.meta_score).slice(0, 5);
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
  type: 'weapon' | 'content' | 'tip' | 'next_unlock';
  title: string;
  description: string;
  confidence: number;
}

interface WeaponAnalysis {
  weaponClasses: string[];
  metaRatio: number;
  versatility: number;
  primaryPlaystyle: string;
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
  const recommendations = generateRecommendations(
    personaType,
    skillTier,
    weaponAnalysis,
    stats,
    detectedWeapons
  );
  
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
  
  // Salva nel DB se disponibile
  try {
    await supabase.from('player_profiles').insert({
      id: profile.id,
      persona_type: personaType,
      skill_tier: skillTier,
      playstyle_tags: playstyleTags,
      weapon_preferences: profile.weaponPreferences,
      engagement_score: engagementScore,
      investment_score: investmentScore,
      churn_risk: churnRisk,
      extracted_stats: stats
    });
  } catch (e) {
    console.log('Supabase not available, profile not saved');
  }
  
  return profile;
}

// ============================================
// 3. ANALISI PATTERN
// ============================================

function analyzeWeaponChoices(weapons: DetectedWeapon[]): WeaponAnalysis {
  const classes = weapons.map(w => w.category);
  const uniqueClasses = [...new Set(classes)];
  
  // Determina se gioca meta o no
  const metaWeapons = ['MCW', 'Striker', 'RAM-7', 'AMR9', 'KATT-AMR']; // S-tier
  const metaCount = weapons.filter(w => 
    metaWeapons.some(mw => w.name.toLowerCase().includes(mw.toLowerCase()))
  ).length;
  const metaRatio = weapons.length > 0 ? metaCount / weapons.length : 0;
  
  // Determina versatilità
  const versatility = uniqueClasses.length;
  
  // Determina playstyle primario dagli attachments
  const hasLongRangeOptic = weapons[0]?.attachments.some(a => 
    a.slot === 'optic' && (a.name.includes('4x') || a.name.includes('Corvus') || a.name.includes('scope'))
  );
  const hasAggressiveSetup = weapons[0]?.attachments.some(a =>
    a.name.toLowerCase().includes('no stock') || a.name.toLowerCase().includes('short barrel')
  );
  
  let primaryPlaystyle = 'balanced';
  if (hasLongRangeOptic) primaryPlaystyle = 'tactical';
  else if (hasAggressiveSetup) primaryPlaystyle = 'aggressive';
  
  return {
    weaponClasses: uniqueClasses,
    metaRatio,
    versatility,
    primaryPlaystyle
  };
}

function derivePlaystyle(stats: PlayerStats, weaponAnalysis: WeaponAnalysis): string[] {
  const tags: string[] = [];
  
  // Da stats
  if (stats.kd_ratio > 1.5) tags.push('fragger');
  if (stats.accuracy > 25) tags.push('precise');
  if (stats.spm > 350) tags.push('aggressive');
  if (stats.spm < 250) tags.push('tactical');
  if (stats.win_rate > 55) tags.push('team_player');
  if (stats.headshot_percent > 25) tags.push('headhunter');
  
  // Da armi
  if (weaponAnalysis.metaRatio > 0.7) tags.push('meta_follower');
  else if (weaponAnalysis.metaRatio < 0.3 && stats.kd_ratio > 1.0) tags.push('hipster');
  
  if (weaponAnalysis.versatility > 3) tags.push('versatile');
  else tags.push('specialist');
  
  if (weaponAnalysis.primaryPlaystyle === 'tactical') tags.push('methodical');
  if (weaponAnalysis.primaryPlaystyle === 'aggressive') tags.push('rusher');
  
  // Da classe arma
  if (weaponAnalysis.weaponClasses.includes('sniper')) tags.push('sniper');
  if (weaponAnalysis.weaponClasses.includes('smg')) tags.push('close_quarters');
  if (weaponAnalysis.weaponClasses.includes('lmg')) tags.push('support');
  
  return [...new Set(tags)];
}

function calculateSkillTier(stats: PlayerStats): string {
  // Formula: K/D * 100 + Accuracy * 10 + SPM / 10
  const score = (stats.kd_ratio * 100) + (stats.accuracy * 10) + (stats.spm / 10);
  
  // Ranked play tiers based on SBMM
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
  weaponAnalysis: WeaponAnalysis,
  tags: string[]
): string {
  // Algoritmo di classificazione persona basato su dati reali
  
  // META WARRIOR: Alta dedizione + usa meta
  if (tags.includes('meta_follower') && stats.play_time_hours > 200 && stats.kd_ratio > 1.2) {
    return 'meta_warrior';
  }
  
  // SKILLED HIPSTER: Buono ma non segue meta
  if (tags.includes('hipster') && stats.kd_ratio > 1.3 && weaponAnalysis.metaRatio < 0.4) {
    return 'skilled_hipster';
  }
  
  // COMPLETIONIST: Tante armi + tanto tempo
  if (weaponAnalysis.versatility >= 4 && stats.play_time_hours > 300) {
    return 'completionist';
  }
  
  // AGGRESSIVE GRINDER: SPM alto + rusher
  if (stats.spm > 400 && tags.includes('rusher') && stats.kd_ratio > 1.0) {
    return 'aggressive_grinder';
  }
  
  // TACTICAL SNIPER: Accuracy alta + methodical
  if (stats.accuracy > 30 && tags.includes('methodical') && stats.kd_ratio > 1.2) {
    return 'tactical_sniper';
  }
  
  // SUPPORT PLAYER: LMG + team oriented
  if (weaponAnalysis.weaponClasses.includes('lmg') && tags.includes('team_player')) {
    return 'support_player';
  }
  
  // CASUAL REGULAR: Default
  if (stats.play_time_hours < 50) {
    return 'casual_rookie';
  }
  
  return 'regular_player';
}

function calculateEngagement(stats: PlayerStats): number {
  // Score 0-100 basato su tempo gioco e attività
  const hoursScore = Math.min(stats.play_time_hours / 10, 50);
  const matchesScore = Math.min((stats.total_kills || 0) / 1000, 30);
  const levelScore = Math.min((stats.level || 1) / 2, 20);
  return Math.round(Math.min(100, hoursScore + matchesScore + levelScore));
}

function calculateInvestment(weapons: DetectedWeapon[]): number {
  // Stima investimento basato su diversità e meta score
  const diversityScore = Math.min(weapons.length * 10, 40);
  const metaScore = weapons.reduce((sum, w) => {
    const knowledge = WEAPON_KNOWLEDGE_BASE.find(kb => 
      kb.name.toLowerCase() === w.name.toLowerCase()
    );
    if (!knowledge) return sum;
    const tierScore = { 'S': 25, 'A': 20, 'B': 15, 'C': 10, 'D': 5 }[knowledge.meta_tier] || 10;
    return sum + tierScore;
  }, 0);
  return Math.round(Math.min(100, diversityScore + metaScore / weapons.length));
}

function predictChurn(stats: PlayerStats, engagement: number): number {
  // Prediction basata su engagement e pattern
  if (stats.play_time_hours > 300 && engagement > 70) return 5;  // Hardcore, molto basso
  if (stats.play_time_hours > 150 && engagement > 50) return 15; // Regular, basso
  if (stats.play_time_hours < 20) return 85; // Nuovo, alto rischio
  if (engagement < 30) return 70; // Low engagement, medio-alto
  return 40; // Default
}

// ============================================
// 4. GENERAZIONE RACCOMANDAZIONI
// ============================================

function generateRecommendations(
  persona: string,
  skillTier: string,
  weaponAnalysis: WeaponAnalysis,
  stats: PlayerStats,
  detectedWeapons: DetectedWeapon[]
): Recommendation[] {
  const recs: Recommendation[] = [];
  
  // 1. Raccomanda prossima arma basata su persona
  const nextWeapon = suggestNextWeapon(persona, weaponAnalysis, stats);
  recs.push({
    type: 'weapon',
    title: `Prova ${nextWeapon.name}`,
    description: `Arma ${nextWeapon.meta_tier}-tier adatta al tuo stile ${persona.replace('_', ' ')}`,
    confidence: 0.85
  });
  
  // 2. Suggerimento attachments
  if (detectedWeapons[0]) {
    const attachments = findOptimalAttachments(
      detectedWeapons[0].name, 
      detectedWeapons[0].attachments.map(a => a.name),
      weaponAnalysis.primaryPlaystyle
    );
    if (attachments[0]) {
      recs.push({
        type: 'next_unlock',
        title: `Sblocca ${attachments[0].name}`,
        description: attachments[0].description,
        confidence: 0.80
      });
    }
  }
  
  // 3. Content suggestion basata su persona
  const contentRec = getContentRecommendation(persona, stats);
  if (contentRec) recs.push(contentRec);
  
  // 4. Tip personalizzato
  const tip = getPersonalizedTip(stats, weaponAnalysis);
  if (tip) recs.push(tip);
  
  return recs;
}

function suggestNextWeapon(
  persona: string,
  weaponAnalysis: WeaponAnalysis,
  stats: PlayerStats
): WeaponKnowledge {
  // Logica di raccomandazione basata su persona
  const candidates = WEAPON_KNOWLEDGE_BASE.filter(w => 
    !weaponAnalysis.weaponClasses.includes(w.category)
  );
  
  // Scoring basato su persona
  const scored = candidates.map(w => {
    let score = 0;
    
    switch (persona) {
      case 'meta_warrior':
        if (w.meta_tier === 'S') score += 50;
        if (w.meta_tier === 'A') score += 30;
        break;
      case 'skilled_hipster':
        if (w.meta_tier === 'B' || w.meta_tier === 'C') score += 40;
        if (w.playstyle_tags.includes('high_skill')) score += 20;
        break;
      case 'aggressive_grinder':
        if (w.playstyle_tags.includes('aggressive')) score += 40;
        if (w.stats.fire_rate > 80) score += 20;
        break;
      case 'tactical_sniper':
        if (w.category === 'sniper' || w.category === 'marksman') score += 50;
        if (w.stats.accuracy > 80) score += 20;
        break;
      default:
        if (w.meta_tier === 'A' || w.meta_tier === 'B') score += 30;
    }
    
    // Preferisci armi dello stesso tier di skill
    if (stats.kd_ratio > 1.5 && w.meta_tier === 'S') score += 20;
    if (stats.kd_ratio < 1.0 && w.meta_tier !== 'S') score += 20;
    
    return { weapon: w, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.weapon || WEAPON_KNOWLEDGE_BASE[0];
}

function getContentRecommendation(persona: string, stats: PlayerStats): Recommendation | null {
  const recommendations: Record<string, Recommendation> = {
    meta_warrior: {
      type: 'content',
      title: 'Meta Tier List - Stagione Corrente',
      description: 'Resta ahead della curva con le ultime tier list aggiornate',
      confidence: 0.90
    },
    aggressive_grinder: {
      type: 'content',
      title: 'Advanced Movement Techniques',
      description: 'Slide cancel, bunny hop, e movement avanzato per rushare meglio',
      confidence: 0.85
    },
    tactical_sniper: {
      type: 'content',
      title: 'Positioning Guide - Map Control',
      description: 'Le migliori posizioni per ogni mappa di Warzone',
      confidence: 0.88
    },
    casual_rookie: {
      type: 'content',
      title: 'Beginner Friendly Loadouts',
      description: 'Setup facili per iniziare a migliorare subito',
      confidence: 0.95
    }
  };
  
  return recommendations[persona] || {
    type: 'content',
    title: 'Improve Your Game Sense',
    description: 'General tips per il tuo livello di skill',
    confidence: 0.70
  };
}

function getPersonalizedTip(stats: PlayerStats, weaponAnalysis: WeaponAnalysis): Recommendation | null {
  if (stats.kd_ratio < 0.8) {
    return {
      type: 'tip',
      title: 'Focus sul posizionamento',
      description: 'Il tuo K/D suggerisce di giocare più cover-to-cover. Evita gli open field.',
      confidence: 0.80
    };
  }
  
  if (stats.accuracy < 20 && stats.spm > 300) {
    return {
      type: 'tip',
      title: 'Calma la mira',
      description: 'Sei aggressivo ma la precisione è bassa. Prova aim training prima di rushare.',
      confidence: 0.75
    };
  }
  
  if (weaponAnalysis.versatility < 2 && stats.play_time_hours > 100) {
    return {
      type: 'tip',
      title: 'Espandi il tuo arsenal',
      description: 'Usi poche armi. Prova nuove classi per adattarti a diverse situazioni.',
      confidence: 0.70
    };
  }
  
  return null;
}

// ============================================
// 5. LOOKALIKE AUDIENCE (Per Marketing)
// ============================================

export async function findLookalikeAudience(
  targetProfileId: string,
  count: number = 100
): Promise<any[]> {
  try {
    const { data } = await supabase.rpc('find_similar_players', {
      player_id: targetProfileId,
      match_count: count
    });
    return data || [];
  } catch (e) {
    console.log('Supabase RPC not available');
    return [];
  }
}
