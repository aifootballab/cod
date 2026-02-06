import { useEffect, useRef, useCallback, useState } from 'react';
import nipplejs from 'nipplejs';
import { 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Trophy,
  Timer,
  Crosshair as CrosshairIcon,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import type { Crosshair } from '@/types/aim-trainer';
import { useAimTrainer } from '@/hooks/useAimTrainer';
import { useAimTelemetry } from '@/hooks/useAimTelemetry';
import { useAudio } from '@/hooks/useAudio';
import { GameState, DEFAULT_CONFIG, type JoystickData } from '@/types/aim-trainer';
import { generateAIAnalysis } from '@/services/ai-analysis';
import type { AIAnalysisResult } from '@/types/aim-analytics';

interface AimTrainerSectionProps {
  onBack: () => void;
}

// Hook per rilevare se è mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return isMobile;
}

export function AimTrainerSection({ onBack }: AimTrainerSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isMobile = useIsMobile();
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [showSettings, setShowSettings] = useState(false);
  const [sensitivity, setSensitivity] = useState(5);
  
  // Responsive canvas
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isMobileView = window.innerWidth < 768;
        setDimensions({
          width: Math.min(rect.width - (isMobileView ? 16 : 32), 1200),
          height: isMobileView 
            ? Math.min(window.innerHeight - 280, 500)
            : Math.min(window.innerHeight - 250, 600),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const config = { ...DEFAULT_CONFIG, sensitivity };
  const [state, actions] = useAimTrainer(
    dimensions.width,
    dimensions.height,
    config
  );

  const { gameState, crosshair, targets, score, timeRemaining, session } = state;
  
  // Telemetry & AI Analysis
  const telemetry = useAimTelemetry();
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Visual effects state
  const [hitEffects, setHitEffects] = useState<Array<{id: string; x: number; y: number; timestamp: number}>>([]);
  const [damageNumbers, setDamageNumbers] = useState<Array<{id: string; x: number; y: number; value: number; timestamp: number}>>([]);
  const [screenShake, setScreenShake] = useState(0);
  
  // Audio
  const audio = useAudio();
  
  // Input mode detection
  const [inputMode, setInputMode] = useState<'mouse' | 'gamepad' | 'touch'>('mouse');
  const gamepadRef = useRef<Gamepad | null>(null);

  // Detect input mode
  useEffect(() => {
    if (isMobile) {
      setInputMode('touch');
      return;
    }
    
    // Check for gamepad
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (gp) {
          gamepadRef.current = gp;
          setInputMode('gamepad');
          return;
        }
      }
      // No gamepad, use mouse
      if (inputMode !== 'mouse') {
        setInputMode('mouse');
      }
    };
    
    checkGamepad();
    const interval = setInterval(checkGamepad, 1000);
    
    window.addEventListener('gamepadconnected', () => {
      setInputMode('gamepad');
    });
    
    window.addEventListener('gamepaddisconnected', () => {
      setInputMode('mouse');
    });
    
    return () => clearInterval(interval);
  }, [isMobile]);

  // Track crosshair position for telemetry during gameplay
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;
    
    const interval = setInterval(() => {
      telemetry.recordCrosshairPosition(crosshair.x, crosshair.y);
    }, 50); // 20Hz sampling
    
    return () => clearInterval(interval);
  }, [gameState, crosshair, telemetry]);

  // Start telemetry when game starts
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      telemetry.startTelemetry();
      setAiAnalysis(null);
      setShowAnalysis(false);
    }
  }, [gameState, telemetry]);

  // Generate AI analysis when game finishes
  useEffect(() => {
    if (gameState === GameState.FINISHED && !aiAnalysis) {
      const data = telemetry.getTelemetryData();
      const analysis = generateAIAnalysis(data);
      setAiAnalysis(analysis);
    }
  }, [gameState, telemetry, aiAnalysis]);

  // MOUSE INPUT (Desktop) - Direct mouse tracking
  useEffect(() => {
    if (inputMode !== 'mouse' || gameState !== GameState.PLAYING) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert to canvas coordinates
      const targetX = (x / rect.width) * dimensions.width;
      const targetY = (y / rect.height) * dimensions.height;
      
      // Set crosshair directly to mouse position
      actions.setCrosshairPosition(targetX, targetY);
    };
    
    const handleClick = () => {
      handleShoot();
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleShoot();
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputMode, gameState, actions, dimensions]);

  // GAMEPAD INPUT
  useEffect(() => {
    if (inputMode !== 'gamepad' || gameState !== GameState.PLAYING) return;
    
    let animationId: number;
    
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0]; // First gamepad
      
      if (gp) {
        // Right stick for aiming (axes 2 and 3)
        const rightX = gp.axes[2] || 0;
        const rightY = gp.axes[3] || 0;
        
        // Deadzone
        const deadzone = 0.15;
        const magnitude = Math.sqrt(rightX * rightX + rightY * rightY);
        
        if (magnitude > deadzone) {
          const joystickData: JoystickData = {
            angle: Math.atan2(-rightY, rightX) * 180 / Math.PI,
            force: Math.min(magnitude, 1),
            vector: { 
              x: (Math.abs(rightX) > deadzone ? rightX : 0), 
              y: (Math.abs(rightY) > deadzone ? rightY : 0) 
            },
          };
          
          actions.moveCrosshair(joystickData);
        }
        
        // Right trigger (RT) to shoot (button 7 usually)
        // or Right shoulder (R1) button 5
        if (gp.buttons[7].pressed || gp.buttons[5].pressed) {
          handleShoot();
        }
      }
      
      animationId = requestAnimationFrame(pollGamepad);
    };
    
    animationId = requestAnimationFrame(pollGamepad);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [inputMode, gameState, actions]);

  // TOUCH INPUT (Joystick - Mobile only)
  useEffect(() => {
    if (inputMode !== 'touch' || !joystickRef.current || gameState !== GameState.PLAYING) return;

    const joystick = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(245, 158, 11, 0.9)',
      size: 100,
      fadeTime: 0,
      threshold: 0.1,
      lockX: false,
      lockY: false,
    });

    joystickInstanceRef.current = joystick;

    joystick.on('move', (_evt: any, data: any) => {
      const angle = data.angle.radian;
      const force = Math.min(data.force, 1);
      
      const joystickData: JoystickData = {
        angle: data.angle.degree,
        force,
        vector: {
          x: Math.cos(angle) * force,
          y: -Math.sin(angle) * force,
        },
      };
      
      actions.moveCrosshair(joystickData);
    });

    return () => {
      joystick.destroy();
    };
  }, [inputMode, gameState, actions, sensitivity]);

  // Canvas rendering con animazione smooth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (timestamp: number) => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Grid background animata
      const gridOffset = (timestamp / 50) % 50;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = gridOffset; x <= dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Radar sweep effect (usa timestamp per consistenza)
      const sweepAngle = (timestamp / 2000) * Math.PI * 2;
      const gradient = ctx.createConicGradient(sweepAngle, dimensions.width / 2, dimensions.height / 2);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0)');
      gradient.addColorStop(0.02, 'rgba(245, 158, 11, 0.1)');
      gradient.addColorStop(0.04, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Render targets con effetti
      targets.forEach(target => {
        const age = Date.now() - target.spawnTime;
        const remaining = 1 - (age / target.maxLifetime);
        const pulse = Math.sin(timestamp / 200) * 0.1 + 1;
        
        // Glow effect
        const glowRadius = target.radius * 1.5 * pulse;
        const glowGradient = ctx.createRadialGradient(
          target.x, target.y, 0,
          target.x, target.y, glowRadius
        );
        glowGradient.addColorStop(0, `rgba(239, 68, 68, ${remaining * 0.8})`);
        glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(target.x - glowRadius, target.y - glowRadius, glowRadius * 2, glowRadius * 2);
        
        // Target circle
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${remaining})`;
        ctx.fill();
        
        // Target ring
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner cross
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(target.x - 5, target.y);
        ctx.lineTo(target.x + 5, target.y);
        ctx.moveTo(target.x, target.y - 5);
        ctx.lineTo(target.x, target.y + 5);
        ctx.stroke();
      });

      // Render damage numbers (+100)
      damageNumbers.forEach(dmg => {
        const age = Date.now() - dmg.timestamp;
        const progress = age / 800;
        const yOffset = -progress * 50; // Float up
        const alpha = 1 - progress;
        const scale = 1 + progress * 0.5;
        
        ctx.save();
        ctx.translate(dmg.x, dmg.y + yOffset);
        ctx.scale(scale, scale);
        
        // Glow effect
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`+${dmg.value}`, 0, 0);
        
        ctx.restore();
      });

      // Render hit effects (X mark like COD)
      hitEffects.forEach(effect => {
        const age = Date.now() - effect.timestamp;
        const progress = age / 500; // 500ms duration
        const size = 20 + progress * 30;
        const alpha = 1 - progress;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        
        // X mark
        ctx.beginPath();
        ctx.moveTo(effect.x - size/2, effect.y - size/2);
        ctx.lineTo(effect.x + size/2, effect.y + size/2);
        ctx.moveTo(effect.x + size/2, effect.y - size/2);
        ctx.lineTo(effect.x - size/2, effect.y + size/2);
        ctx.stroke();
        
        // Hit marker text "HIT"
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.font = 'bold 12px monospace';
        ctx.fillText('HIT', effect.x - 15, effect.y - size/2 - 5);
      });

      // Render crosshair con effetti
      renderCrosshair(ctx, crosshair, timestamp);
      
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [targets, crosshair, dimensions, hitEffects, damageNumbers]);

  const renderCrosshair = (ctx: CanvasRenderingContext2D, cross: Crosshair, timestamp: number) => {
    const { x, y, size, color } = cross;
    
    // Dynamic outer ring (rotating)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(timestamp / 1000);
    
    ctx.beginPath();
    ctx.arc(0, 0, size + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    
    // Main outer ring
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner dot con glow
    const dotGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    dotGradient.addColorStop(0, color);
    dotGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = dotGradient;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Cross lines
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    const gap = 8;
    const length = size + 10;
    
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(x - length, y);
    ctx.lineTo(x - gap, y);
    ctx.moveTo(x + gap, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
    
    // Vertical
    ctx.beginPath();
    ctx.moveTo(x, y - length);
    ctx.lineTo(x, y - gap);
    ctx.moveTo(x, y + gap);
    ctx.lineTo(x, y + length);
    ctx.stroke();
    
    // Corner brackets (military style)
    const bracketSize = size * 0.6;
    const bracketOffset = size + 5;
    ctx.lineWidth = 2;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x - bracketOffset - bracketSize, y - bracketOffset);
    ctx.lineTo(x - bracketOffset, y - bracketOffset);
    ctx.lineTo(x - bracketOffset, y - bracketOffset - bracketSize);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + bracketOffset + bracketSize, y - bracketOffset);
    ctx.lineTo(x + bracketOffset, y - bracketOffset);
    ctx.lineTo(x + bracketOffset, y - bracketOffset - bracketSize);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x - bracketOffset - bracketSize, y + bracketOffset);
    ctx.lineTo(x - bracketOffset, y + bracketOffset);
    ctx.lineTo(x - bracketOffset, y + bracketOffset + bracketSize);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + bracketOffset + bracketSize, y + bracketOffset);
    ctx.lineTo(x + bracketOffset, y + bracketOffset);
    ctx.lineTo(x + bracketOffset, y + bracketOffset + bracketSize);
    ctx.stroke();
  };

  // Handle shoot with telemetry, audio and effects
  const handleShoot = useCallback(() => {
    const result = actions.shoot();
    
    if (!result || gameState !== GameState.PLAYING) return;
    
    // Audio feedback
    audio.playShootSound();
    
    // Screen shake effect
    setScreenShake(5);
    setTimeout(() => setScreenShake(0), 100);
    
    // Trova il bersaglio più vicino al mirino
    let targetX = crosshair.x;
    let targetY = crosshair.y;
    
    if (result.hit && result.targetId) {
      const target = targets.find(t => t.id === result.targetId);
      if (target) {
        targetX = target.x;
        targetY = target.y;
        
        // Hit sound and effect
        audio.playHitSound();
        
        // Hit marker effect
        const newEffect = {
          id: `hit-${Date.now()}`,
          x: target.x,
          y: target.y,
          timestamp: Date.now(),
        };
        setHitEffects(prev => [...prev, newEffect]);
        
        // Damage number (+100)
        const damageNum = {
          id: `dmg-${Date.now()}`,
          x: target.x,
          y: target.y - 30,
          value: 100,
          timestamp: Date.now(),
        };
        setDamageNumbers(prev => [...prev, damageNum]);
        
        // Remove old effects
        setTimeout(() => {
          setHitEffects(prev => prev.filter(e => e.id !== newEffect.id));
          setDamageNumbers(prev => prev.filter(d => d.id !== damageNum.id));
        }, 800);
      }
    } else {
      // Miss sound
      audio.playMissSound();
    }
    
    // Registra telemetria
    telemetry.recordShot(
      targetX,
      targetY,
      crosshair.x,
      crosshair.y,
      result.reactionTime,
      result.hit,
      dimensions.width,
      dimensions.height
    );
  }, [actions, gameState, crosshair, targets, telemetry, dimensions, audio]);

  const handleCanvasClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleShoot();
  }, [handleShoot]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Stats
  const accuracy = session 
    ? Math.round((session.targetsHit / (session.targetsHit + session.targetsMissed)) * 100) || 0
    : 0;
  const avgReaction = session?.averageReactionTime 
    ? Math.round(session.averageReactionTime)
    : 0;

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-amber-500 overflow-hidden">
      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-5">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-amber-500 to-transparent animate-scan" />
      </div>
      
      {/* Header - più compatto su mobile */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-amber-600/30 bg-black/90 backdrop-blur">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-amber-600 text-amber-500 hover:bg-amber-600/20 rounded text-sm md:text-base transition-all active:scale-95"
            >
              ← <span className="hidden md:inline">Indietro</span>
            </button>
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-wider">
              <span className="text-orange-600">AIM</span>
              <span className="hidden md:inline"> TRAINER</span>
            </h1>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 border border-amber-600 text-amber-500 hover:bg-amber-600/20 rounded transition-all active:scale-95"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-amber-600/30 bg-zinc-900/90">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <span className="text-sm text-zinc-400">Sensibilità:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="flex-1 max-w-xs accent-amber-600"
            />
            <span className="text-amber-500 font-mono w-8">{sensitivity}</span>
          </div>
        </div>
      )}

      {/* HUD Stats - Responsive grid */}
      <div className="px-3 py-2 md:px-6 md:py-3">
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-7xl mx-auto">
          <div className="bg-zinc-900/90 border border-amber-600/30 p-2 md:p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-1 md:gap-2 text-zinc-500 text-[10px] md:text-xs uppercase">
              <Trophy className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Punti</span>
            </div>
            <div className="text-lg md:text-2xl font-mono font-bold text-amber-500">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-600/30 p-2 md:p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-1 md:gap-2 text-zinc-500 text-[10px] md:text-xs uppercase">
              <Timer className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Tempo</span>
            </div>
            <div className="text-lg md:text-2xl font-mono font-bold text-amber-500">
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-600/30 p-2 md:p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-1 md:gap-2 text-zinc-500 text-[10px] md:text-xs uppercase">
              <Target className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Prec</span>
            </div>
            <div className="text-lg md:text-2xl font-mono font-bold text-amber-500">
              {accuracy}<span className="text-sm">%</span>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-600/30 p-2 md:p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-1 md:gap-2 text-zinc-500 text-[10px] md:text-xs uppercase">
              <Zap className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">React</span>
            </div>
            <div className="text-lg md:text-2xl font-mono font-bold text-amber-500">
              {avgReaction}<span className="text-xs md:text-sm">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="px-2 md:px-6 pb-2 md:pb-4">
        <div className="max-w-7xl mx-auto relative">
          <div className="relative bg-zinc-950 border-2 border-amber-600/50 rounded-lg overflow-hidden shadow-2xl shadow-amber-600/10">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-4 border-l-4 border-amber-600 z-10" />
            <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-4 border-r-4 border-amber-600 z-10" />
            <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-4 border-l-4 border-amber-600 z-10" />
            <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-4 border-r-4 border-amber-600 z-10" />

            {/* Canvas with screen shake */}
            <div 
              style={{
                transform: screenShake > 0 ? `translate(${Math.random() * screenShake - screenShake/2}px, ${Math.random() * screenShake - screenShake/2}px)` : 'none',
                transition: 'transform 0.05s'
              }}
            >
              <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onClick={handleCanvasClick}
                onTouchStart={handleCanvasClick}
                className="block mx-auto cursor-crosshair touch-none"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            {/* Input Mode Indicator */}
            {gameState === GameState.PLAYING && (
              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded border border-amber-600/50">
                <span className="text-xs text-amber-500 uppercase font-bold">
                  {inputMode === 'mouse' && '🖱️ MOUSE'}
                  {inputMode === 'gamepad' && '🎮 CONTROLLER'}
                  {inputMode === 'touch' && '👆 TOUCH'}
                </span>
                {inputMode === 'mouse' && (
                  <span className="text-[10px] text-white ml-2">MUOVI IL MOUSE</span>
                )}
              </div>
            )}

            {/* Joystick - SOLO su touch/mobile */}
            {gameState === GameState.PLAYING && inputMode === 'touch' && (
              <div className="absolute bottom-4 left-4 w-24 h-24 md:w-36 md:h-36 pointer-events-auto">
                <div 
                  ref={joystickRef}
                  className="w-full h-full rounded-full bg-amber-600/10 border-2 border-amber-600/50 backdrop-blur"
                />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-amber-500/60 uppercase tracking-wider whitespace-nowrap">
                  Mirare
                </div>
              </div>
            )}

            {/* Fire button - SOLO su touch */}
            {gameState === GameState.PLAYING && inputMode === 'touch' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleShoot();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleShoot();
                }}
                className="absolute bottom-6 right-6 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-red-500 flex items-center justify-center active:scale-90 active:bg-red-900 transition-all z-20 shadow-2xl shadow-red-600/50"
                style={{
                  boxShadow: '0 0 30px rgba(220, 38, 38, 0.5), inset 0 0 20px rgba(0,0,0,0.3)'
                }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">🔥</div>
                  <span className="text-[10px] md:text-xs text-white uppercase font-black mt-1 block tracking-wider">FIRE</span>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
              </button>
            )}
            
            {/* Desktop controls hint */}
            {gameState === GameState.PLAYING && inputMode === 'mouse' && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-8 text-xs text-zinc-500 pointer-events-none">
                <div className="bg-black/50 px-3 py-2 rounded border border-zinc-700">
                  <span className="text-amber-500 font-bold">MOUSE</span> per mirare
                </div>
                <div className="bg-black/50 px-3 py-2 rounded border border-zinc-700">
                  <span className="text-amber-500 font-bold">CLICK</span> o <span className="text-amber-500 font-bold">SPAZIO</span> per sparare
                </div>
              </div>
            )}
            
            {/* Gamepad controls hint */}
            {gameState === GameState.PLAYING && inputMode === 'gamepad' && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-8 text-xs text-zinc-500 pointer-events-none">
                <div className="bg-black/50 px-3 py-2 rounded border border-zinc-700">
                  <span className="text-amber-500 font-bold">STICK DX</span> per mirare
                </div>
                <div className="bg-black/50 px-3 py-2 rounded border border-zinc-700">
                  <span className="text-amber-500 font-bold">RT</span> o <span className="text-amber-500 font-bold">R1</span> per sparare
                </div>
              </div>
            )}

            {/* Pause button */}
            {gameState === GameState.PLAYING && (
              <button 
                onClick={actions.pauseGame}
                className="absolute top-4 right-4 p-2 md:p-3 border border-amber-600/50 bg-black/50 text-amber-500 rounded hover:bg-amber-600/20 transition-all active:scale-95 z-20"
              >
                <Pause className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}

            {/* Start Screen */}
            {gameState === GameState.IDLE && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center px-4">
                  <div className="mb-6 relative inline-block">
                    <CrosshairIcon className="w-16 h-16 md:w-24 md:h-24 text-orange-600 mx-auto animate-pulse" />
                    <div className="absolute inset-0 bg-orange-600/20 blur-xl rounded-full" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase mb-2">
                    <span className="text-orange-600">Tactical</span> Aim
                  </h2>
                  <p className="text-zinc-400 mb-6 text-sm md:text-base max-w-xs md:max-w-md mx-auto">
                    {inputMode === 'touch' && 'Usa il joystick per mirare. Tocca il bottone rosso per sparare.'}
                    {inputMode === 'mouse' && 'Muovi il MOUSE per mirare. Clicca o premi SPAZIO per sparare.'}
                    {inputMode === 'gamepad' && 'Usa lo STICK DESTRO per mirare. Premi RT o R1 per sparare.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-zinc-500 max-w-xs mx-auto">
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                      <Target className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      Colpisci i bersagli
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                      <Timer className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      60 secondi
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                      <TrendingUp className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      Migliora il tuo K/D
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                      <Award className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      Scala la classifica
                    </div>
                  </div>
                  
                  <button 
                    onClick={actions.startGame}
                    className="bg-amber-600 hover:bg-amber-700 text-black font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-amber-600/30"
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    INIZIA ALLENAMENTO
                  </button>
                </div>
              </div>
            )}

            {/* Pause Screen */}
            {gameState === GameState.PAUSED && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <Pause className="w-12 h-12 md:w-16 md:h-16 text-amber-500 mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 text-amber-500">PAUSA</h2>
                  <div className="flex gap-3 md:gap-4">
                    <button 
                      onClick={actions.resumeGame}
                      className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-4 md:px-6 py-2 md:py-3 rounded transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2" />
                      Riprendi
                    </button>
                    <button 
                      onClick={actions.endGame}
                      className="px-4 md:px-6 py-2 md:py-3 border border-red-600 text-red-500 hover:bg-red-600/20 rounded transition-all"
                    >
                      Termina
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen with AI Analysis */}
            {gameState === GameState.FINISHED && session && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-sm overflow-y-auto">
                <div className="min-h-full px-4 py-6 w-full max-w-2xl mx-auto">
                  {!showAnalysis ? (
                    // Quick Results Screen
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <Award className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mb-4 animate-pulse" />
                      <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 text-center">
                        <span className="text-orange-600">Sessione</span> Completata
                      </h2>
                      <p className="text-zinc-400 mb-6 text-center">La IA sta analizzando i tuoi dati...</p>
                      
                      <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-6">
                        <div className="bg-zinc-900 border border-amber-600/30 p-3 text-center">
                          <div className="text-xs text-zinc-500 uppercase">Punti</div>
                          <div className="text-xl font-bold text-amber-500">{score}</div>
                        </div>
                        <div className="bg-zinc-900 border border-amber-600/30 p-3 text-center">
                          <div className="text-xs text-zinc-500 uppercase">Prec</div>
                          <div className="text-xl font-bold text-amber-500">{accuracy}%</div>
                        </div>
                        <div className="bg-zinc-900 border border-amber-600/30 p-3 text-center">
                          <div className="text-xs text-zinc-500 uppercase">Colp</div>
                          <div className="text-xl font-bold text-amber-500">{session.targetsHit}</div>
                        </div>
                        <div className="bg-zinc-900 border border-amber-600/30 p-3 text-center">
                          <div className="text-xs text-zinc-500 uppercase">React</div>
                          <div className="text-xl font-bold text-amber-500">{avgReaction}ms</div>
                        </div>
                      </div>
                      
                      {aiAnalysis ? (
                        <button 
                          onClick={() => setShowAnalysis(true)}
                          className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-8 py-3 rounded-lg animate-bounce"
                        >
                          <Zap className="w-5 h-5 inline mr-2" />
                          VEDI ANALISI IA
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-500">
                          <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          Analisi in corso...
                        </div>
                      )}
                    </div>
                  ) : aiAnalysis ? (
                    // Detailed AI Analysis
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-black text-4xl font-black mb-2">
                          {aiAnalysis.overallRating}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase">
                          <span className="text-orange-600">Analisi</span> Performance
                        </h2>
                        <p className="text-zinc-500 text-sm">Generata da Neural AI System</p>
                      </div>

                      {/* Weapon Recommendation */}
                      <div className="bg-zinc-900 border border-amber-600/30 p-4 rounded-lg">
                        <h3 className="text-amber-500 text-sm uppercase font-bold mb-3 flex items-center gap-2">
                          <CrosshairIcon className="w-4 h-4" />
                          Arma Consigliata
                        </h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-3xl font-black text-white">
                            {aiAnalysis.primaryWeapon.weaponName}
                          </div>
                          <div className="text-sm bg-amber-600/20 text-amber-500 px-2 py-1 rounded">
                            {aiAnalysis.primaryWeapon.category}
                          </div>
                          <div className="text-sm bg-green-600/20 text-green-500 px-2 py-1 rounded ml-auto">
                            {aiAnalysis.primaryWeapon.confidence}% match
                          </div>
                        </div>
                        <div className="text-sm text-zinc-400 mb-2">
                          Stile: <span className="text-amber-500">{aiAnalysis.primaryWeapon.playstyle}</span>
                        </div>
                        <ul className="text-xs text-zinc-400 space-y-1 mb-3">
                          {aiAnalysis.primaryWeapon.reasons.map((reason: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500">→</span> {reason}
                            </li>
                          ))}
                        </ul>
                        <div className="text-xs">
                          <span className="text-zinc-500">Attachments suggeriti:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {aiAnalysis.primaryWeapon.suggestedAttachments.map((att: string, i: number) => (
                              <span key={i} className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                                {att}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Settings Recommendation */}
                      <div className="bg-zinc-900 border border-amber-600/30 p-4 rounded-lg">
                        <h3 className="text-amber-500 text-sm uppercase font-bold mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Impostazioni Ottimali
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-black/50 p-3 rounded text-center">
                            <div className="text-xs text-zinc-500 uppercase mb-1">Sensibilità</div>
                            <div className="text-2xl font-bold text-amber-500">
                              {aiAnalysis.settings.sensitivity.suggested}
                            </div>
                            <div className="text-[10px] text-zinc-600 line-through">
                              Attuale: {aiAnalysis.settings.sensitivity.current}
                            </div>
                          </div>
                          {aiAnalysis.settings.adsSensitivity && (
                            <div className="bg-black/50 p-3 rounded text-center">
                              <div className="text-xs text-zinc-500 uppercase mb-1">ADS</div>
                              <div className="text-2xl font-bold text-amber-500">
                                {aiAnalysis.settings.adsSensitivity.suggested}
                              </div>
                            </div>
                          )}
                          {aiAnalysis.settings.fov && (
                            <div className="bg-black/50 p-3 rounded text-center">
                              <div className="text-xs text-zinc-500 uppercase mb-1">FOV</div>
                              <div className="text-2xl font-bold text-amber-500">
                                {aiAnalysis.settings.fov.suggested}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">
                          {aiAnalysis.settings.sensitivity.reason}
                        </p>
                      </div>

                      {/* Personalized Tips */}
                      <div className="bg-zinc-900 border border-amber-600/30 p-4 rounded-lg">
                        <h3 className="text-amber-500 text-sm uppercase font-bold mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Suggerimenti Personalizzati
                        </h3>
                        <ul className="text-sm text-zinc-300 space-y-2">
                          {aiAnalysis.tips.map((tip: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Training Focus */}
                      <div className="bg-zinc-900 border border-amber-600/30 p-4 rounded-lg">
                        <h3 className="text-amber-500 text-sm uppercase font-bold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Focus Allenamento
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.trainingFocus.map((focus: string, i: number) => (
                            <span key={i} className="bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full text-sm">
                              {focus}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Profile Stats */}
                      <div className="bg-zinc-900 border border-amber-600/30 p-4 rounded-lg">
                        <h3 className="text-amber-500 text-sm uppercase font-bold mb-3">
                          Statistiche Dettagliate
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-zinc-500">Reazione media</div>
                            <div className="text-lg text-white">{aiAnalysis.playerProfile.reactionTime.average}ms</div>
                          </div>
                          <div>
                            <div className="text-zinc-500">Reazione più veloce</div>
                            <div className="text-lg text-green-500">{aiAnalysis.playerProfile.reactionTime.fastest}ms</div>
                          </div>
                          <div>
                            <div className="text-zinc-500">Precisione close range</div>
                            <div className="text-lg text-white">{aiAnalysis.playerProfile.precision.byDistance.close}%</div>
                          </div>
                          <div>
                            <div className="text-zinc-500">Precisione long range</div>
                            <div className="text-lg text-white">{aiAnalysis.playerProfile.precision.byDistance.far}%</div>
                          </div>
                          <div>
                            <div className="text-zinc-500">Movimento</div>
                            <div className="text-lg text-white capitalize">{aiAnalysis.playerProfile.movement.type}</div>
                          </div>
                          <div>
                            <div className="text-zinc-500">Consistenza</div>
                            <div className="text-lg text-white">{aiAnalysis.playerProfile.movement.consistency}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <button 
                          onClick={actions.resetGame}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-black font-bold px-4 py-3 rounded transition-all active:scale-95"
                        >
                          <RotateCcw className="w-4 h-4 inline mr-2" />
                          Nuovo Allenamento
                        </button>
                        <button 
                          onClick={() => setShowAnalysis(false)}
                          className="px-4 py-3 border border-amber-600 text-amber-500 hover:bg-amber-600/20 rounded transition-all"
                        >
                          Indietro
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Controls hint - solo quando non si gioca */}
          {gameState !== GameState.PLAYING && gameState !== GameState.FINISHED && (
            <div className="mt-3 flex justify-center items-center gap-4 text-[10px] md:text-xs text-zinc-600">
              {inputMode === 'touch' && (
                <>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-amber-600/50 bg-amber-600/20 flex items-center justify-center">
                      <span className="text-amber-500">●</span>
                    </div>
                    Joystick per mirare
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-red-600/50 bg-red-600/20 flex items-center justify-center">
                      <Target className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                    </div>
                    Tocca per sparare
                  </span>
                </>
              )}
              {inputMode === 'mouse' && (
                <>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-amber-600/50 bg-amber-600/20 flex items-center justify-center">
                      <span className="text-amber-500">🖱️</span>
                    </div>
                    Mouse per mirare
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-red-600/50 bg-red-600/20 flex items-center justify-center">
                      <span className="text-red-500 text-xs font-bold">LMB</span>
                    </div>
                    Click o SPAZIO per sparare
                  </span>
                </>
              )}
              {inputMode === 'gamepad' && (
                <>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-amber-600/50 bg-amber-600/20 flex items-center justify-center">
                      <span className="text-amber-500">🎮</span>
                    </div>
                    Stick DX per mirare
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-red-600/50 bg-red-600/20 flex items-center justify-center">
                      <span className="text-red-500 text-xs font-bold">RT</span>
                    </div>
                    RT/R1 per sparare
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
