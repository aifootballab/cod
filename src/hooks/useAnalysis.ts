import { useState, useCallback } from 'react';
import type { Analysis, PlayerStats, WeaponBuild } from '@/types';
import { extractStatsFromImage, generateAIAnalysis, findBestBuildsWithAI } from '@/lib/openai';
// import { uploadScreenshot } from '@/lib/supabase';
import { detectPlaystyle } from '@/data/weaponDatabase';

interface UseAnalysisOptions {
  userId?: string;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'upload' | 'ocr' | 'ai' | 'rag' | 'save' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(async (file: File, allBuilds: WeaponBuild[]) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Stage 1: Upload (0-15%) - commented until Supabase storage is configured
      setStage('upload');
      // if (options.userId) {
      //   const { data, error: uploadError } = await uploadScreenshot(file, options.userId);
      //   if (uploadError) throw uploadError;
      // }
      setProgress(15);
      
      // Stage 2: OCR with OpenAI (15-50%)
      setStage('ocr');
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const extractedStats = await extractStatsFromImage(imageBase64);
      setProgress(50);
      
      // Stage 3: AI Analysis (50-70%)
      setStage('ai');
      const playerStats: PlayerStats = {
        kd_ratio: extractedStats.kd_ratio || 1.0,
        accuracy: extractedStats.accuracy || 20,
        spm: extractedStats.spm || 250,
        win_rate: extractedStats.win_rate || 50,
        total_kills: extractedStats.total_kills || 5000,
        total_deaths: extractedStats.total_deaths || 5000,
        headshot_percent: extractedStats.headshot_percent || 15,
        play_time_hours: extractedStats.play_time_hours || 100,
        best_weapon: extractedStats.best_weapon || 'MCW',
        level: extractedStats.level || 55,
        playstyle_detected: detectPlaystyle({
          kd_ratio: extractedStats.kd_ratio || 1.0,
          accuracy: extractedStats.accuracy || 20,
          spm: extractedStats.spm || 250,
        }),
      };
      
      const { analysis: aiAnalysis, tips } = await generateAIAnalysis(playerStats, allBuilds.slice(0, 3));
      setProgress(70);
      
      // Stage 4: RAG - Find best builds (70-85%)
      setStage('rag');
      const recommendedBuilds = await findBestBuildsWithAI(playerStats, allBuilds);
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
      
      // Save to database (commented until Supabase is configured)
      // if (options.userId) {
      //   await supabase.from('analyses').insert({...});
      // }
      
      setProgress(100);
      setStage('complete');
      setAnalysis(newAnalysis);
      
    } catch (err) {
      console.error('Analysis error:', err);
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
      case 'ocr': return 'OCR ANALYSIS (GPT-4V)...';
      case 'ai': return 'AI ANALYZING STATS...';
      case 'rag': return 'RAG SEARCHING BUILDS...';
      case 'save': return 'SAVING RESULTS...';
      case 'complete': return 'COMPLETE!';
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
