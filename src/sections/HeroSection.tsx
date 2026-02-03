import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Crosshair, Target, ChevronDown, Trophy, BarChart3, Shield, 
  ArrowRight, Users, Lock,
  TrendingUp, Award, ZapIcon, Radio, ScanLine, CrosshairIcon
} from 'lucide-react';
import { ALL_WEAPONS } from '@/data/weapons-mw3-full';

interface HeroSectionProps {
  onScrollToUpload: () => void;
  onNavigate?: (view: string) => void;
  isAuthenticated?: boolean;
}

export function HeroSection({ onScrollToUpload, onNavigate, isAuthenticated }: HeroSectionProps) {
  const { i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scanLine, setScanLine] = useState(0);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Tactical grid animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }
    
    let animationId: number;
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234, 179, 8, ${p.alpha})`;
          ctx.fill();
        });
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const isItalian = i18n.language === 'it';

  const FEATURES = [
    { 
      icon: Target, 
      label: 'OCR AI', 
      desc: isItalian ? 'Scansione statistiche' : 'Stats scanning',
      color: 'border-l-amber-500',
      action: () => onScrollToUpload(),
      stat: '99%'
    },
    { 
      icon: Crosshair, 
      label: isItalian ? 'BUILD META' : 'META BUILDS', 
      desc: isItalian ? 'Loadout ottimizzati' : 'Optimized loadouts',
      color: 'border-l-orange-500',
      action: () => onNavigate?.('builds'),
      stat: ALL_WEAPONS.filter(w => w.isMeta).length.toString()
    },
    { 
      icon: BarChart3, 
      label: isItalian ? 'ANALISI' : 'ANALYSIS', 
      desc: isItalian ? 'Report tattico' : 'Tactical report',
      color: 'border-l-yellow-500',
      action: () => onScrollToUpload(),
      stat: '30s'
    },
    { 
      icon: Trophy, 
      label: isItalian ? 'RANKING' : 'RANKING', 
      desc: isItalian ? 'Classifica globale' : 'Global leaderboard',
      color: 'border-l-amber-600',
      action: () => onNavigate?.('leaderboard'),
      stat: 'TOP 100'
    },
    { 
      icon: Shield, 
      label: isItalian ? 'ARSENALE' : 'ARSENAL', 
      desc: isItalian ? '56 armi complete' : '56 complete weapons',
      color: 'border-l-orange-600',
      action: () => onNavigate?.('builds'),
      stat: ALL_WEAPONS.length.toString()
    },
    { 
      icon: Radio, 
      label: 'AI COACH', 
      desc: isItalian ? 'Supporto tattico' : 'Tactical support',
      color: 'border-l-yellow-600',
      action: () => onScrollToUpload(),
      stat: 'GPT-4'
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Military scan lines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(234, 179, 8, 0.1) 2px,
            rgba(234, 179, 8, 0.1) 4px
          )`,
        }}
      />
      
      {/* Moving scan line */}
      <div 
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none z-20"
        style={{ top: `${scanLine}%` }}
      />

      {/* Tactical grid */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(234, 179, 8, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234, 179, 8, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Canvas particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0"
      />
      
      {/* HUD Corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-amber-500/40 z-30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-amber-500/40 z-30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-amber-500/40 z-30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-amber-500/40 z-30" />

      {/* Crosshair center decoration */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10"
        style={{ transform: `translate(calc(-50% + ${mousePosition.x}px), calc(-50% + ${mousePosition.y}px))` }}
      >
        <CrosshairIcon className="w-[600px] h-[600px] text-amber-500" strokeWidth={0.5} />
      </div>

      {/* Top Status Bar - Military Style */}
      <div className="relative z-40 border-b border-amber-500/20 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-mono tracking-wider">ONLINE</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-amber-500/60 font-mono">
              <span>SYS.COD-9.2</span>
              <span>|</span>
              <span>WPN:{ALL_WEAPONS.length}</span>
              <span>META:{ALL_WEAPONS.filter(w => w.isMeta).length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-amber-500/60">
              <ScanLine className="w-4 h-4 inline mr-1" />
              SCANNING...
            </div>
            {!isAuthenticated ? (
              <button 
                onClick={() => onNavigate?.('profile')}
                className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 border border-amber-500/30 px-3 py-1"
              >
                <Lock className="w-3 h-3" />
                {isItalian ? 'ACCESSO' : 'LOGIN'}
              </button>
            ) : (
              <span className="text-green-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                OPERATIVE
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
          
          {/* Military Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500/40 bg-black/60 backdrop-blur-sm">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-mono tracking-[0.2em]">
                ADVANCED ANALYSIS SYSTEM
              </span>
            </div>
          </div>
          
          {/* Main Title - Military Stencil Style */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {/* Decorative brackets */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-amber-500/40 text-2xl font-mono hidden md:block">[</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-amber-500/40 text-2xl font-mono hidden md:block">]</div>
              
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-2 tracking-tighter">
                <span className="text-gray-300" style={{ fontFamily: 'Black Ops One, cursive' }}>COD</span>
                <span 
                  className="text-amber-500" 
                  style={{ fontFamily: 'Black Ops One, cursive' }}
                >
                  COACHING
                </span>
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
              <p className="text-sm md:text-base text-amber-500/70 tracking-[0.4em] font-mono">
                TACTICAL LOADOUT OPTIMIZER
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed mb-6 px-4">
              {isItalian 
                ? 'Piattaforma di analisi tattica per Call of Duty. Sistema AI avanzato per ottimizzare performance e loadout.'
                : 'Tactical analysis platform for Call of Duty. Advanced AI system to optimize performance and loadouts.'
              }
            </p>
          </div>

          {/* CTA Buttons - Military Style */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <button 
              onClick={onScrollToUpload}
              className="group relative px-8 py-4 bg-amber-500 text-black font-bold text-sm tracking-wider uppercase overflow-hidden border-2 border-amber-400 hover:bg-amber-400 transition-colors"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                {isItalian ? 'INIZIA SCANSIONE' : 'START SCAN'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => onNavigate?.('builds')}
              className="group px-8 py-4 border-2 border-amber-500/50 text-amber-400 font-bold text-sm tracking-wider uppercase hover:border-amber-500 hover:bg-amber-500/10 transition-all"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              <span className="flex items-center justify-center gap-2">
                <Crosshair className="w-4 h-4" />
                {isItalian ? 'ARSENALE' : 'ARSENAL'}
              </span>
            </button>
          </div>

          {/* Feature Grid - Military Panels */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 max-w-6xl mx-auto">
            {FEATURES.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative p-3 md:p-4 text-left transition-all duration-200 border bg-black/40 backdrop-blur-sm ${
                  hoveredFeature === i 
                    ? `border-amber-500 ${item.color} bg-amber-500/10` 
                    : 'border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                {/* Corner accents */}
                <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${
                  hoveredFeature === i ? 'border-amber-500' : 'border-amber-500/30'
                }`} />
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${
                  hoveredFeature === i ? 'border-amber-500' : 'border-amber-500/30'
                }`} />
                
                {/* Stat badge - military style */}
                <div className="absolute top-2 right-2 text-[9px] font-mono px-1 bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {item.stat}
                </div>
                
                {/* Icon */}
                <div className={`w-8 h-8 md:w-10 md:h-10 mb-2 flex items-center justify-center border ${
                  hoveredFeature === i 
                    ? 'bg-amber-500 border-amber-500' 
                    : 'bg-transparent border-amber-500/30'
                } transition-colors`}>
                  <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${
                    hoveredFeature === i ? 'text-black' : 'text-amber-500'
                  }`} />
                </div>
                
                {/* Label */}
                <h3 className={`text-[10px] md:text-xs font-bold font-mono tracking-wider mb-1 ${
                  hoveredFeature === i ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {item.label}
                </h3>
                
                {/* Description */}
                <p className="text-[9px] text-gray-600 leading-tight hidden md:block">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Bottom Info Bar */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8 pt-6 border-t border-amber-500/10">
            <div className="flex items-center gap-2 text-xs text-amber-500/60 font-mono">
              <TrendingUp className="w-4 h-4" />
              <span>{isItalian ? 'EFFICIENZA: 99.2%' : 'EFFICIENCY: 99.2%'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-500/60 font-mono">
              <Award className="w-4 h-4" />
              <span>ARSENAL: {ALL_WEAPONS.length} WPN</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-500/60 font-mono">
              <ZapIcon className="w-4 h-4" />
              <span>AI: NEURAL V2</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="relative z-30 flex justify-center pb-6">
        <button 
          onClick={onScrollToUpload}
          className="flex flex-col items-center gap-1 text-amber-500/50 hover:text-amber-400 transition-colors group"
        >
          <span className="text-[10px] font-mono tracking-widest">{isItalian ? 'SCROLL' : 'SCROLL'}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>

      {/* Bottom tactical overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
