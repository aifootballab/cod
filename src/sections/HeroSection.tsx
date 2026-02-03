import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Crosshair, Target, Zap, ChevronDown, Trophy, BarChart3, Shield, 
  ArrowRight, Users, Sparkles, Play, Lock,
  TrendingUp, Award, ZapIcon
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

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle animation
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
    
    const particles: { 
      x: number; y: number; vx: number; vy: number; 
      size: number; alpha: number; speed: number;
    }[] = [];
    
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.5,
      });
    }
    
    let animationId: number;
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p) => {
          p.x += p.vx * p.speed;
          p.y += p.vy * p.speed;
          
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
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
      label: isItalian ? 'OCR AI' : 'AI OCR', 
      desc: isItalian ? 'Estrazione automatica statistiche' : 'Auto stats extraction',
      color: 'from-orange-500 to-red-500',
      action: () => onScrollToUpload(),
      stat: '99%'
    },
    { 
      icon: Crosshair, 
      label: isItalian ? 'BUILD META' : 'META BUILDS', 
      desc: isItalian ? 'Loadout ottimizzati per te' : 'Optimized loadouts for you',
      color: 'from-amber-500 to-orange-500',
      action: () => onNavigate?.('builds'),
      stat: ALL_WEAPONS.filter(w => w.isMeta).length.toString()
    },
    { 
      icon: BarChart3, 
      label: isItalian ? 'ANALISI' : 'ANALYSIS', 
      desc: isItalian ? 'Report dettagliato performance' : 'Detailed performance report',
      color: 'from-yellow-500 to-amber-500',
      action: () => onScrollToUpload(),
      stat: '30s'
    },
    { 
      icon: Trophy, 
      label: isItalian ? 'RANKING' : 'RANKING', 
      desc: isItalian ? 'Classifica globale giocatori' : 'Global player leaderboard',
      color: 'from-orange-400 to-yellow-500',
      action: () => onNavigate?.('leaderboard'),
      stat: 'TOP 100'
    },
    { 
      icon: Shield, 
      label: isItalian ? 'LOADOUT' : 'LOADOUT', 
      desc: isItalian ? '56+ armi complete' : '56+ complete weapons',
      color: 'from-red-500 to-orange-500',
      action: () => onNavigate?.('builds'),
      stat: ALL_WEAPONS.length.toString()
    },
    { 
      icon: Zap, 
      label: 'AI COACH', 
      desc: isItalian ? 'Consigli personalizzati' : 'Personalized tips',
      color: 'from-yellow-400 to-orange-400',
      action: () => onScrollToUpload(),
      stat: 'GPT-4'
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#050505]">
      {/* Canvas for particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0"
      />
      
      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Parallax glow orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full blur-[120px] transition-transform duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] transition-transform duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)',
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
        }}
      />

      {/* Top bar with stats */}
      <div className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-mono">SYSTEM ONLINE</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 font-mono">
              <span>ARMI: {ALL_WEAPONS.length}</span>
              <span>META: {ALL_WEAPONS.filter(w => w.isMeta).length}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <button 
                onClick={() => onNavigate?.('profile')}
                className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                {isItalian ? 'ACCEDI' : 'LOGIN'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                <span>PRO</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20">
          
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-500/30 bg-orange-500/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-xs font-mono tracking-widest">
                {isItalian ? 'POWERED BY GPT-4 VISION' : 'POWERED BY GPT-4 VISION'}
              </span>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="text-center mb-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter">
              <span className="text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>COD</span>
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" 
                style={{ fontFamily: 'Black Ops One, cursive' }}
              >
                COACHING
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 tracking-[0.3em] font-mono mb-4">
              TACTICAL LOADOUT OPTIMIZER
            </p>
            
            <div className="w-32 md:w-48 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-8" />
            
            <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8 px-4">
              {isItalian 
                ? 'La prima piattaforma AI italiana per Call of Duty. Analizza le tue statistiche, ricevi build META personalizzate e domina il campo di battaglia.'
                : 'The first Italian AI platform for Call of Duty. Analyze your stats, get personalized META builds and dominate the battlefield.'
              }
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button 
              onClick={onScrollToUpload}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm md:text-base tracking-wider uppercase overflow-hidden"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isItalian ? 'INIZIA ANALISI' : 'START ANALYSIS'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={() => onNavigate?.('builds')}
              className="group px-8 py-4 border border-orange-500/50 text-orange-400 font-bold text-sm md:text-base tracking-wider uppercase hover:bg-orange-500/10 transition-all"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                {isItalian ? 'ESPLORA ARMI' : 'EXPLORE WEAPONS'}
              </span>
            </button>
          </div>

          {/* Feature Cards - CLICCABILI */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto">
            {FEATURES.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative p-4 md:p-6 border text-left transition-all duration-300 ${
                  hoveredFeature === i 
                    ? 'border-orange-500 bg-orange-500/10 scale-105' 
                    : 'border-white/10 bg-black/20 hover:border-orange-500/50'
                }`}
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                {/* Stat badge */}
                <div className={`absolute top-2 right-2 text-[10px] font-mono px-1.5 py-0.5 bg-gradient-to-r ${item.color} text-black font-bold`}>
                  {item.stat}
                </div>
                
                {/* Icon */}
                <div className={`w-10 h-10 md:w-12 md:h-12 mb-3 flex items-center justify-center bg-gradient-to-br ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                
                {/* Label */}
                <h3 className={`text-xs md:text-sm font-bold font-mono tracking-wider mb-1 transition-colors ${
                  hoveredFeature === i ? 'text-orange-400' : 'text-white'
                }`}>
                  {item.label}
                </h3>
                
                {/* Description */}
                <p className="text-[10px] text-gray-500 leading-tight">
                  {item.desc}
                </p>
                
                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${item.color} transition-all duration-300 ${
                  hoveredFeature === i ? 'w-full' : 'w-0'
                }`} />
              </button>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-8 mt-12 text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>{isItalian ? 'Analisi in 30s' : '30s Analysis'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>{isItalian ? '56+ Armi' : '56+ Weapons'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ZapIcon className="w-4 h-4 text-orange-500" />
              <span>GPT-4 Vision</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <button 
          onClick={onScrollToUpload}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors group"
        >
          <span className="text-[10px] font-mono tracking-widest">{isItalian ? 'SCOPRI' : 'DISCOVER'}</span>
          <ChevronDown className="w-5 h-5 animate-bounce group-hover:text-orange-500" />
        </button>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </section>
  );
}
