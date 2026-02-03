import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, ChevronRight, ChevronLeft, Target, Crosshair, Trophy, 
  Shield, Zap, Check
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Benvenuto Operatore',
    description: 'COD Coaching è la tua piattaforma tattica per analizzare le performance su Call of Duty. Ti guiderò attraverso le funzionalità principali.',
    icon: Target,
  },
  {
    id: 'analysis',
    title: 'Analisi Performance',
    description: 'Carica uno screenshot delle tue statistiche. Il nostro sistema Neural V2 estrae automaticamente K/D, Accuracy, SPM e altri dati.',
    icon: Crosshair,
    target: 'upload-section',
  },
  {
    id: 'builds',
    title: 'Arsenale Tattico',
    description: 'Esplora 56+ armi con stats reali. Filtra per categoria, tier META e trova il loadout perfetto per il tuo stile.',
    icon: Shield,
    target: 'builds-section',
  },
  {
    id: 'ranking',
    title: 'Classifica Globale',
    description: 'Confrontati con altri operatori. Il Combat Score determina il tuo rank da ROOKIE a TITAN.',
    icon: Trophy,
    target: 'leaderboard-section',
  },
  {
    id: 'hero-points',
    title: 'Hero Points',
    description: 'La valuta della piattaforma. Ottieni HP con l\'analisi, sblocca avatar esclusivi e accedi a funzionalità premium.',
    icon: Zap,
    target: 'credits-section',
  },
  {
    id: 'complete',
    title: 'Pronto per l\'azione',
    description: 'Ora sei pronto per iniziare. Carica la tua prima analisi e scopri il tuo potenziale!',
    icon: Check,
  },
];

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function InteractiveTour({ isOpen, onClose, onComplete }: InteractiveTourProps) {
  const { i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      onComplete?.();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isItalian = i18n.language === 'it';

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop with tactical overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleSkip}
      >
        {/* Scan lines */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(234, 179, 8, 0.1) 2px, rgba(234, 179, 8, 0.1) 4px)`,
          }}
        />
      </div>

      {/* Modal - Military Style */}
      <div 
        className={`relative w-full max-w-lg transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner brackets */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-amber-500" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-amber-500" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-amber-500" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-amber-500" />

        {/* Main container */}
        <div className="bg-[#0a0a0a] border border-amber-500/30 relative overflow-hidden">
          {/* Header bar */}
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 animate-pulse" />
              <span className="text-amber-400 text-xs font-mono tracking-wider">
                TUTORIAL // STEP {currentStep + 1}/{TOUR_STEPS.length}
              </span>
            </div>
            <button 
              onClick={handleSkip}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 border-2 border-amber-500/50 bg-amber-500/10 flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-500" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-500" />
                <Icon className="w-10 h-10 text-amber-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Black Ops One, cursive' }}>
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-center leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-1 bg-gray-800 relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-600">
                <span>PROGRESS</span>
                <span>{Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}%</span>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {TOUR_STEPS.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 border transition-colors ${
                    idx === currentStep 
                      ? 'bg-amber-500 border-amber-500' 
                      : idx < currentStep 
                        ? 'bg-amber-500/30 border-amber-500/30' 
                        : 'bg-transparent border-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-4 py-2 border border-amber-500/30 text-amber-400 font-mono text-sm hover:bg-amber-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                {isItalian ? 'IND' : 'PREV'}
              </button>

              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-300 font-mono text-xs"
              >
                {isItalian ? 'SALTA' : 'SKIP'}
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-amber-500 text-black font-bold font-mono text-sm hover:bg-amber-400 transition-colors"
              >
                {isLast 
                  ? (isItalian ? 'FINE' : 'DONE')
                  : (isItalian ? 'AVAN' : 'NEXT')
                }
                {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-2 w-px h-8 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute top-1/2 right-2 w-px h-8 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-4 gap-4 text-[10px] font-mono text-amber-500/40">
          <span>SYS.TUTORIAL</span>
          <span>|</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

// Hook to manage tour visibility
export function useTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has seen tour
    const hasSeenTour = localStorage.getItem('cod-tour-completed');
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem('cod-tour-completed', 'true');
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem('cod-tour-completed');
    setShowTour(true);
  };

  return { showTour, setShowTour, completeTour, resetTour };
}
