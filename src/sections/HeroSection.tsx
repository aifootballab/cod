import { useEffect, useRef } from 'react';
import { Crosshair, Target, Zap, ChevronDown, Trophy, BarChart3, Shield } from 'lucide-react';

interface HeroSectionProps {
  onScrollToUpload: () => void;
}

export function HeroSection({ onScrollToUpload }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
    
    let animationId: number;
    
    const animate = () => {
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
        ctx.fillStyle = `rgba(255, 107, 0, ${p.alpha})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Canvas for particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
      
      {/* Orange glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-orange-500/50 bg-orange-500/10">
          <div className="w-2 h-2 bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-mono tracking-widest">SYSTEM ONLINE</span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter">
          <span className="text-white" style={{ fontFamily: 'Black Ops One, cursive' }}>COD</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" style={{ fontFamily: 'Black Ops One, cursive' }}>
            COACHING
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-2 tracking-widest font-mono">
          TACTICAL LOADOUT OPTIMIZER
        </p>
        
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-12" />
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Analisi AI delle tue statistiche. Build META personalizzate. 
          Domina il campo di battaglia.
        </p>
        
        {/* Feature icons */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { icon: Target, label: 'OCR AI', color: 'text-orange-400' },
            { icon: Crosshair, label: 'BUILD META', color: 'text-amber-400' },
            { icon: BarChart3, label: 'ANALISI', color: 'text-yellow-400' },
            { icon: Trophy, label: 'RANKING', color: 'text-orange-400' },
            { icon: Shield, label: 'LOADOUT', color: 'text-amber-400' },
            { icon: Zap, label: 'RAG SYSTEM', color: 'text-yellow-400' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 border border-orange-500/30 bg-orange-500/5 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-all">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-xs text-gray-500 font-mono tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={onScrollToUpload}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 opacity-70 group-hover:opacity-100 blur transition-opacity" />
          <div className="relative px-12 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-lg tracking-widest uppercase clip-path-polygon">
            INIZIA ANALISI
          </div>
        </button>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-600 font-mono">SCROLL</span>
          <ChevronDown className="w-5 h-5 text-orange-500" />
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      
      <style>{`
        .clip-path-polygon {
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
        }
      `}</style>
    </section>
  );
}
