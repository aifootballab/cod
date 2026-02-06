import { useState, useRef } from 'react';
import { Upload, Target, User, Zap, AlertTriangle, CheckCircle2, Brain } from 'lucide-react';
import { recognizeWeaponAndRetrieve, generatePlayerProfile, type PlayerProfile, type DetectedWeapon } from '@/lib/rag-engine';
import type { PlayerStats } from '@/types';

interface ProfilingStep {
  id: 'profile' | 'weapons' | 'analysis' | 'results';
  title: string;
  description: string;
}

const steps: ProfilingStep[] = [
  { id: 'profile', title: 'PROFILO', description: 'Carica screenshot statistiche' },
  { id: 'weapons', title: 'ARSENALE', description: 'Carica foto delle tue armi' },
  { id: 'analysis', title: 'ANALISI', description: 'AI sta profilando...' },
  { id: 'results', title: 'RISULTATI', description: 'Il tuo profilo completo' }
];

export function EnterpriseProfilingFlow() {
  const [currentStep, setCurrentStep] = useState<ProfilingStep['id']>('profile');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dati raccolti
  const [profileStats, setProfileStats] = useState<PlayerStats | null>(null);
  const [detectedWeapons, setDetectedWeapons] = useState<DetectedWeapon[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  
  // Upload handlers
  const handleProfileUpload = async (_file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Qui andrebbe l'OCR delle statistiche profilo
      // Per ora simuliamo con dati di esempio
      const mockStats: PlayerStats = {
        kd_ratio: 1.45,
        accuracy: 22.5,
        spm: 385,
        win_rate: 52,
        total_kills: 15420,
        total_deaths: 10634,
        headshot_percent: 18.5,
        play_time_hours: 245,
        best_weapon: 'MCW',
        level: 234,
        playstyle_detected: 'aggressive'
      };
      
      setProfileStats(mockStats);
      setCurrentStep('weapons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore analisi profilo');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleWeaponUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      const imageBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const result = await recognizeWeaponAndRetrieve(imageBase64);
      
      setDetectedWeapons(prev => [...prev, result.detected]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore riconoscimento arma');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const runFullAnalysis = async () => {
    if (!profileStats || detectedWeapons.length === 0) return;
    
    setIsAnalyzing(true);
    setCurrentStep('analysis');
    
    try {
      const profile = await generatePlayerProfile(profileStats, detectedWeapons);
      setPlayerProfile(profile);
      setCurrentStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore generazione profilo');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetFlow = () => {
    setCurrentStep('profile');
    setProfileStats(null);
    setDetectedWeapons([]);
    setPlayerProfile(null);
    setError(null);
  };
  
  return (
    <section className="py-16 md:py-24 px-4 bg-[#0a0a0a] min-h-screen pt-20 md:pt-28">
      <div className="max-w-5xl mx-auto">
        {/* Header - Responsive */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-orange-500/30 bg-orange-500/5">
            <Brain className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 text-xs font-mono tracking-widest">ENTERPRISE PROFILING</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
            PROFILAZIONE <span className="text-orange-500">AVANZATA</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base px-2">
            Carica i tuoi screenshot e l'AI analizzerà il tuo stile di gioco, 
            le tue preferenze d'arma e genererà un profilo completo.
          </p>
        </div>
        
        {/* Stepper - Responsive: scrollabile su mobile */}
        <div className="flex justify-between mb-8 md:mb-12 relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2" />
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;
            
            return (
              <div key={step.id} className={`relative z-10 flex flex-col items-center flex-1 ${
                isActive ? 'text-orange-500' : isCompleted ? 'text-emerald-500' : 'text-gray-600'
              }`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-1 md:mb-2 bg-[#0a0a0a] ${
                  isActive ? 'border-orange-500' : isCompleted ? 'border-emerald-500' : 'border-gray-700'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <span className="font-bold text-xs md:text-base">{idx + 1}</span>
                  )}
                </div>
                <span className="text-[10px] md:text-xs font-mono font-bold text-center">{step.title}</span>
                <span className="text-[8px] md:text-[10px] text-gray-600 hidden sm:block text-center">{step.description}</span>
              </div>
            );
          })}
        </div>
        
        {/* Error - Responsive */}
        {error && (
          <div className="mb-6 md:mb-8 p-4 md:p-6 border border-red-500/30 bg-red-500/5 flex flex-col md:flex-row items-start md:items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-red-400 font-bold mb-1">ERRORE</h4>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="w-full md:w-auto px-4 py-2 border border-red-500/50 text-red-400 text-sm"
            >
              RIPROVA
            </button>
          </div>
        )}
        
        {/* Step Content - Responsive padding */}
        <div className="border border-gray-800 bg-[#111] p-4 md:p-8">
          {currentStep === 'profile' && (
            <ProfileUploadStep 
              onUpload={handleProfileUpload}
              isAnalyzing={isAnalyzing}
            />
          )}
          
          {currentStep === 'weapons' && (
            <WeaponsUploadStep
              onUpload={handleWeaponUpload}
              detectedWeapons={detectedWeapons}
              isAnalyzing={isAnalyzing}
              onContinue={() => detectedWeapons.length >= 1 && runFullAnalysis()}
            />
          )}
          
          {currentStep === 'analysis' && (
            <AnalysisStep />
          )}
          
          {currentStep === 'results' && playerProfile && (
            <ResultsStep 
              profile={playerProfile}
              detectedWeapons={detectedWeapons}
              onReset={resetFlow}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// ==================== SUB COMPONENTS ====================

function ProfileUploadStep({ onUpload, isAnalyzing }: { onUpload: (f: File) => void; isAnalyzing: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onUpload(file);
  };
  
  return (
    <div className="text-center">
      <User className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-orange-500" />
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Carica il tuo Profilo COD</h3>
      <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
        Scatta uno screenshot della schermata statistiche del tuo profilo.<br className="hidden md:block" />
        L'AI estrarrà K/D, Accuracy, SPM e altri dati.
      </p>
      
      <div 
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-orange-500 p-8 md:p-12 transition-colors cursor-pointer"
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
        <Upload className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-gray-600" />
        <p className="text-gray-500 text-sm md:text-base">Trascina qui o clicca per selezionare</p>
      </div>
      
      {isAnalyzing && (
        <div className="mt-6 md:mt-8">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-orange-400 font-mono text-sm">Analisi OCR in corso...</p>
        </div>
      )}
    </div>
  );
}

function WeaponsUploadStep({ 
  onUpload, 
  detectedWeapons, 
  isAnalyzing,
  onContinue 
}: { 
  onUpload: (f: File) => void; 
  detectedWeapons: DetectedWeapon[];
  isAnalyzing: boolean;
  onContinue: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onUpload(file);
  };
  
  return (
    <div>
      <div className="text-center mb-6 md:mb-8">
        <Target className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-orange-500" />
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Carica le tue Armi</h3>
        <p className="text-gray-500 text-sm md:text-base">
          Carica screenshot dei tuoi loadout (2-5 armi per analisi completa).<br className="hidden md:block" />
          L'AI riconoscerà armi, attachments e stima il tuo playstyle.
        </p>
      </div>
      
      {/* Detected Weapons List - Responsive */}
      {detectedWeapons.length > 0 && (
        <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
          <h4 className="text-white font-bold text-xs md:text-sm font-mono">ARMI RICONOSCIUTE ({detectedWeapons.length})</h4>
          {detectedWeapons.map((w, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-800 bg-[#0a0a0a]">
              <div className="w-8 h-8 md:w-10 md:h-10 border border-orange-500/30 bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-400 font-bold text-sm md:text-base">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm md:text-base truncate">{w.name}</p>
                <p className="text-gray-500 text-xs md:text-sm">{w.category} • {w.attachments.length} attachments</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-emerald-400 text-xs md:text-sm font-mono">{(w.confidence * 100).toFixed(0)}%</p>
                <p className="text-gray-600 text-[10px] md:text-xs">confidenza</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Area */}
      <div 
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 hover:border-orange-500 p-6 md:p-8 transition-colors cursor-pointer text-center"
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
        {isAnalyzing ? (
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          <>
            <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-gray-500 text-xs md:text-sm">Aggiungi altra arma</p>
          </>
        )}
      </div>
      
      {/* Continue Button */}
      {detectedWeapons.length >= 1 && (
        <button
          onClick={onContinue}
          className="w-full mt-6 md:mt-8 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold tracking-widest hover:opacity-90 transition-opacity text-sm md:text-base"
        >
          AVVIA ANALISI COMPLETA
        </button>
      )}
    </div>
  );
}

function AnalysisStep() {
  return (
    <div className="text-center py-8 md:py-12">
      <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full" />
        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />
        </div>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Analisi RAG in corso...</h3>
      <div className="space-y-2 text-gray-500 font-mono text-xs md:text-sm max-w-md mx-auto px-4">
        <p className="flex items-center gap-2 justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          OCR completato
        </p>
        <p className="flex items-center gap-2 justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Armi identificate
        </p>
        <p className="flex items-center gap-2 justify-center text-orange-400">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Matching con knowledge base...
        </p>
        <p className="flex items-center gap-2 justify-center text-gray-600">
          Generazione profilo persona...
        </p>
      </div>
    </div>
  );
}

function ResultsStep({ 
  profile, 
  detectedWeapons,
  onReset 
}: { 
  profile: PlayerProfile;
  detectedWeapons: DetectedWeapon[];
  onReset: () => void;
}) {
  const personaColors: Record<string, string> = {
    meta_warrior: 'text-cyan-400 border-cyan-500 bg-cyan-500/10',
    skilled_hipster: 'text-purple-400 border-purple-500 bg-purple-500/10',
    completionist: 'text-emerald-400 border-emerald-500 bg-emerald-500/10',
    aggressive_grinder: 'text-red-400 border-red-500 bg-red-500/10',
    tactical_sniper: 'text-amber-400 border-amber-500 bg-amber-500/10',
    casual_rookie: 'text-gray-400 border-gray-500 bg-gray-500/10',
    regular_player: 'text-blue-400 border-blue-500 bg-blue-500/10'
  };
  
  const style = personaColors[profile.personaType] || personaColors.regular_player;
  
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Result - Responsive */}
      <div className={`p-4 md:p-8 border ${style.split(' ')[1]} ${style.split(' ')[2]} text-center`}>
        <p className="text-gray-500 text-xs md:text-sm font-mono mb-2">PROFILO IDENTIFICATO</p>
        <h3 className={`text-3xl md:text-5xl font-black mb-2 md:mb-4 ${style.split(' ')[0]}`} style={{ fontFamily: 'Black Ops One, cursive' }}>
          {profile.personaType.replace('_', ' ').toUpperCase()}
        </h3>
        <p className="text-gray-400 text-sm md:text-base">
          {detectedWeapons.length} armi analizzate • {profile.playstyleTags.length} caratteristiche
        </p>
      </div>
      
      {/* Stats Grid - Responsive: 2 colonne su mobile, 4 su desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="SKILL TIER" value={profile.skillTier.toUpperCase()} color="orange" />
        <StatCard label="ENGAGEMENT" value={`${profile.engagementScore}/100`} color="emerald" />
        <StatCard label="INVESTIMENTO" value={`${profile.investmentScore}/100`} color="cyan" />
        <StatCard label="CHURN RISK" value={`${profile.churnRisk}%`} color={profile.churnRisk > 50 ? 'red' : 'emerald'} />
      </div>
      
      {/* Tags - Responsive */}
      <div className="p-4 md:p-6 border border-gray-800 bg-[#0a0a0a]">
        <h4 className="text-white font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
          PLAYSTYLE TAGS
        </h4>
        <div className="flex flex-wrap gap-2">
          {profile.playstyleTags.map((tag) => (
            <span key={tag} className="px-3 py-1 md:px-4 md:py-2 border border-orange-500/30 text-orange-400 text-xs md:text-sm font-mono">
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      
      {/* Recommendations - Responsive: 1 colonna su mobile, 2 su desktop */}
      <div>
        <h4 className="text-white font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
          <Brain className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
          RACCOMANDAZIONI
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {profile.recommendations.map((rec, i) => (
            <div key={i} className="p-4 md:p-6 border border-gray-800 bg-[#0a0a0a] hover:border-orange-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className={`text-xs font-mono px-2 py-1 ${
                  rec.type === 'weapon' ? 'bg-cyan-500/20 text-cyan-400' :
                  rec.type === 'content' ? 'bg-purple-500/20 text-purple-400' :
                  rec.type === 'tip' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {rec.type.toUpperCase()}
                </span>
                <span className="text-gray-600 text-xs">{(rec.confidence * 100).toFixed(0)}% match</span>
              </div>
              <h5 className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">{rec.title}</h5>
              <p className="text-gray-500 text-xs md:text-sm">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Actions - Responsive: stack su mobile */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <button
          onClick={onReset}
          className="flex-1 py-3 md:py-4 border border-gray-700 text-gray-400 font-mono hover:border-orange-500 hover:text-orange-500 transition-colors text-sm md:text-base"
        >
          NUOVA ANALISI
        </button>
        <button className="flex-1 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold tracking-widest text-sm md:text-base">
          ESPORTA PROFILO
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'text-orange-400 border-orange-500',
    emerald: 'text-emerald-400 border-emerald-500',
    cyan: 'text-cyan-400 border-cyan-500',
    red: 'text-red-400 border-red-500'
  };
  
  return (
    <div className={`p-3 md:p-4 border ${colors[color]?.split(' ')[1] || 'border-gray-700'} bg-[#0a0a0a] text-center`}>
      <p className="text-gray-500 text-[10px] md:text-xs font-mono mb-1">{label}</p>
      <p className={`text-lg md:text-2xl font-black ${colors[color]?.split(' ')[0] || 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
