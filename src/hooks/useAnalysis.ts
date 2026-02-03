import { useState, useCallback } from 'react';
import type { Analysis, PlayerStats } from '@/types';
import { extractStatsFromImage, generateAIAnalysis, findBestBuildsWithAI, validateStats } from '@/lib/openai';
import { detectPlaystyle } from '@/data/weaponDatabase';
import { ALL_WEAPONS } from '@/data/weapons-mw3-full';

interface UseAnalysisOptions {
  userId?: string;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'upload' | 'ocr' | 'ai' | 'rag' | 'save' | 'complete' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Stage 1: Upload (0-15%)
      setStage('upload');
      setProgress(15);
      
      // Stage 2: OCR Analysis (15-50%)
      setStage('ocr');
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      // Extract stats from image
      const ocrResult = await extractStatsFromImage(imageBase64);
      
      // Check if valid COD screenshot
      if (!ocrResult.is_valid) {
        throw new Error(ocrResult.error || 'Invalid screenshot');
      }
      
      // Validate extracted stats
      const validation = validateStats(ocrResult.stats || {});
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid stats detected');
      }
      
      const extractedStats = ocrResult.stats!;
      setProgress(50);
      
      // Stage 3: AI Analysis (50-70%)
      setStage('ai');
      
      // Build player stats object - NO FAKE DEFAULTS
      const playerStats: PlayerStats = {
        kd_ratio: extractedStats.kd_ratio ?? 0,
        accuracy: extractedStats.accuracy ?? 0,
        spm: extractedStats.spm ?? 0,
        win_rate: extractedStats.win_rate ?? 0,
        total_kills: extractedStats.total_kills ?? 0,
        total_deaths: extractedStats.total_deaths ?? 0,
        headshot_percent: extractedStats.headshot_percent ?? 0,
        play_time_hours: extractedStats.play_time_hours ?? 0,
        best_weapon: extractedStats.best_weapon || 'Unknown',
        level: extractedStats.level ?? 0,
        playstyle_detected: detectPlaystyle({
          kd_ratio: extractedStats.kd_ratio ?? 0,
          accuracy: extractedStats.accuracy ?? 0,
          spm: extractedStats.spm ?? 0,
        }),
      };
      
      const { analysis: aiAnalysis, tips } = await generateAIAnalysis(playerStats, ALL_WEAPONS.slice(0, 3));
      setProgress(70);
      
      // Stage 4: RAG - Find best builds (70-85%)
      setStage('rag');
      const recommendedBuilds = await findBestBuildsWithAI(playerStats, ALL_WEAPONS);
      setProgress(85);
      
      // Stage 5: Save to database (85-95%)
      setStage('save');
      const newAnalysis: Analysis = {
        id: crypto.randomUUID(),
        extracted_stats: playerStats,
        recommended_builds: recommendedBuilds,
        ai_analysis: aiAnalysis,
        tips,
        created_at: new Date().toISOString(),
      };
      
      setProgress(100);
      setStage('complete');
      setAnalysis(newAnalysis);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setStage('error');
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [options.userId]);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setProgress(0);
    setStage('idle');
    setError(null);
  }, []);

  const getStageText = () => {
    switch (stage) {
      case 'upload': return 'UPLOADING...';
      case 'ocr': return 'OCR ANALYSIS...';
      case 'ai': return 'AI ANALYZING STATS...';
      case 'rag': return 'RAG SEARCHING BUILDS...';
      case 'save': return 'SAVING RESULTS...';
      case 'complete': return 'COMPLETE!';
      case 'error': return 'ERROR';
      default: return 'INITIALIZING...';
    }
  };

  return { 
    analysis, 
    isAnalyzing, 
    progress, 
    stage, 
    error,
    getStageText, 
    startAnalysis, 
    resetAnalysis 
  };
}
