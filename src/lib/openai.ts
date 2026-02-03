// ============================================
// OPENAI INTEGRATION - OCR + AI Analysis + RAG
// ============================================

import type { PlayerStats, WeaponBuild } from '@/types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

// OCR: Extract stats from screenshot using GPT-4 Vision
export const extractStatsFromImage = async (imageBase64: string): Promise<Partial<PlayerStats>> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
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
          content: `You are a Call of Duty stats extractor. Extract player statistics from the screenshot.
          Return ONLY a JSON object with these fields:
          - kd_ratio: number (e.g., 1.25)
          - accuracy: number (percentage, e.g., 24.5)
          - spm: number (score per minute, e.g., 320)
          - win_rate: number (percentage, e.g., 52.3)
          - total_kills: number
          - total_deaths: number
          - headshot_percent: number
          - play_time_hours: number
          - best_weapon: string
          - level: number
          
          If a value is not visible, use reasonable estimates based on other stats.
          Return ONLY the JSON, no other text.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract all player statistics from this Call of Duty screenshot.' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse stats from image');
  }
  
  return JSON.parse(jsonMatch[0]);
};

// Generate embedding for RAG search
export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
};

// AI Analysis: Generate personalized analysis and tips
export const generateAIAnalysis = async (
  stats: PlayerStats,
  builds: WeaponBuild[]
): Promise<{ analysis: string; tips: string[] }> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Analyze this Call of Duty player profile and provide tactical advice:

PLAYER STATS:
- K/D Ratio: ${stats.kd_ratio}
- Accuracy: ${stats.accuracy}%
- SPM (Score Per Minute): ${stats.spm}
- Win Rate: ${stats.win_rate}%
- Headshot %: ${stats.headshot_percent}%
- Best Weapon: ${stats.best_weapon}
- Level: ${stats.level}
- Playstyle: ${stats.playstyle_detected}

RECOMMENDED BUILDS:
${builds.map((b, i) => `${i + 1}. ${b.weapon_name} - ${b.build_name}: ${b.description}`).join('\n')}

Provide:
1. A brief tactical analysis (2-3 sentences)
2. 3-4 specific tips to improve performance

Format response as JSON:
{
  "analysis": "string",
  "tips": ["string", "string", "string", "string"]
}`;

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
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
          content: 'You are an expert Call of Duty coach. Provide concise, actionable tactical advice.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  // Extract JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      analysis: 'Performance analysis completed. Review your stats and recommended builds.',
      tips: [
        'Practice aim training daily',
        'Review map positioning',
        'Experiment with recommended loadouts',
        'Analyze your gameplay recordings'
      ]
    };
  }
  
  return JSON.parse(jsonMatch[0]);
};

// RAG: Find best builds using AI + vector search
export const findBestBuildsWithAI = async (
  stats: PlayerStats,
  allBuilds: WeaponBuild[]
): Promise<WeaponBuild[]> => {
  if (!OPENAI_API_KEY) {
    // Fallback: use local algorithm
    return getBuildsByStatsLocal(stats.kd_ratio, stats.accuracy, allBuilds);
  }

  const prompt = `Given these player stats, rank the best weapon builds:

PLAYER:
- K/D: ${stats.kd_ratio}
- Accuracy: ${stats.accuracy}%
- SPM: ${stats.spm}
- Playstyle: ${stats.playstyle_detected}

BUILDS:
${allBuilds.map((b, i) => `${i}: ${b.weapon_name} - ${b.build_name} (${b.category}, difficulty: ${b.difficulty}, meta: ${b.is_meta})`).join('\n')}

Return ONLY a JSON array of build indices in order of recommendation (best first).
Example: [2, 0, 4, 1, 3]`;

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a Call of Duty loadout expert. Rank builds based on player stats.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const indices = JSON.parse(jsonMatch[0]);
      return indices.map((i: number) => allBuilds[i]).filter(Boolean);
    }
  } catch (e) {
    console.error('AI build selection failed, using fallback:', e);
  }
  
  return getBuildsByStatsLocal(stats.kd_ratio, stats.accuracy, allBuilds);
};

// Local fallback for build selection
const getBuildsByStatsLocal = (kd: number, accuracy: number, builds: WeaponBuild[]): WeaponBuild[] => {
  // Score each build based on player stats
  const scored = builds.map(build => {
    let score = 0;
    
    // Difficulty match
    if (kd < 1 && accuracy < 20 && build.difficulty === 'easy') score += 30;
    else if (kd > 1.5 && accuracy > 25 && build.difficulty === 'hard') score += 30;
    else if (build.difficulty === 'medium') score += 20;
    
    // META preference for good players
    if (build.is_meta && kd > 1) score += 20;
    
    return { build, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.build);
};
