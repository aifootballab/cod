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
  Crosshair as CrosshairIcon
} from 'lucide-react';
import type { Crosshair } from '@/types/aim-trainer';
import { useAimTrainer } from '@/hooks/useAimTrainer';
import { GameState, DEFAULT_CONFIG, type JoystickData } from '@/types/aim-trainer';

interface AimTrainerSectionProps {
  onBack: () => void;
}

export function AimTrainerSection({ onBack }: AimTrainerSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showSettings, setShowSettings] = useState(false);
  
  // Responsive canvas
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.min(rect.width - 32, 1200),
          height: Math.min(window.innerHeight - 300, 800),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const [state, actions] = useAimTrainer(
    dimensions.width,
    dimensions.height,
    DEFAULT_CONFIG
  );

  const { gameState, crosshair, targets, score, timeRemaining, session } = state;

  // Setup joystick
  useEffect(() => {
    if (!joystickRef.current || gameState !== GameState.PLAYING) return;

    const joystick = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(245, 158, 11, 0.8)', // amber-500 with opacity
      size: 120,
      fadeTime: 0,
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
          y: -Math.sin(angle) * force, // Y inverted for canvas
        },
      };
      
      actions.moveCrosshair(joystickData);
    });

    return () => {
      joystick.destroy();
    };
  }, [gameState, actions]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Grid background (tactical HUD)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x <= dimensions.width; x += gridSize) {
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

    // Render targets
    targets.forEach(target => {
      const age = Date.now() - target.spawnTime;
      const remaining = 1 - (age / target.maxLifetime);
      
      // Target circle
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(239, 68, 68, ${remaining})`; // Fade out
      ctx.fill();
      
      // Target ring
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner dot
      ctx.beginPath();
      ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    // Render crosshair
    renderCrosshair(ctx, crosshair);

  }, [targets, crosshair, dimensions]);

  const renderCrosshair = (ctx: CanvasRenderingContext2D, cross: Crosshair) => {
    const { x, y, size, color } = cross;
    
    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Cross lines
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(x - size - 5, y);
    ctx.lineTo(x - 5, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + size + 5, y);
    ctx.stroke();
    
    // Vertical
    ctx.beginPath();
    ctx.moveTo(x, y - size - 5);
    ctx.lineTo(x, y - 5);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + size + 5);
    ctx.stroke();
    
    // Corner brackets
    const bracketSize = size * 0.5;
    ctx.lineWidth = 2;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x - size - 10, y - size + bracketSize);
    ctx.lineTo(x - size - 10, y - size - 10);
    ctx.lineTo(x - size + bracketSize, y - size - 10);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + size + 10, y - size + bracketSize);
    ctx.lineTo(x + size + 10, y - size - 10);
    ctx.lineTo(x + size - bracketSize, y - size - 10);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x - size - 10, y + size - bracketSize);
    ctx.lineTo(x - size - 10, y + size + 10);
    ctx.lineTo(x - size + bracketSize, y + size + 10);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + size + 10, y + size - bracketSize);
    ctx.lineTo(x + size + 10, y + size + 10);
    ctx.lineTo(x + size - bracketSize, y + size + 10);
    ctx.stroke();
  };

  // Handle shoot (tap on canvas)
  const handleCanvasClick = useCallback(() => {
    actions.shoot();
  }, [actions]);

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
    <div ref={containerRef} className="min-h-screen bg-black text-amber-500 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 border border-amber-600 text-amber-500 hover:bg-amber-600/20 rounded"
            >
              ← Indietro
            </button>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">
              <span className="text-orange-600">AIM</span> TRAINER
            </h1>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 border border-amber-600 text-amber-500 hover:bg-amber-600/20 rounded"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* HUD Stats */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/80 border border-amber-600/30 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Trophy className="w-4 h-4" />
              PUNTEGGIO
            </div>
            <div className="text-2xl font-mono font-bold text-amber-500">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-amber-600/30 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Timer className="w-4 h-4" />
              TEMPO
            </div>
            <div className="text-2xl font-mono font-bold text-amber-500">
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-amber-600/30 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Target className="w-4 h-4" />
              PRECISIONE
            </div>
            <div className="text-2xl font-mono font-bold text-amber-500">
              {accuracy}%
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-amber-600/30 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600" />
            
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <CrosshairIcon className="w-4 h-4" />
              REAZIONE
            </div>
            <div className="text-2xl font-mono font-bold text-amber-500">
              {avgReaction}ms
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-zinc-950 border-2 border-amber-600/50 rounded-lg overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-600 z-10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-600 z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-600 z-10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-600 z-10" />

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            onClick={handleCanvasClick}
            className="block mx-auto cursor-crosshair touch-none"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          {/* Joystick overlay (solo durante il gioco) */}
          {gameState === GameState.PLAYING && (
            <div className="absolute bottom-8 left-8 w-32 h-32 md:w-40 md:h-40">
              <div 
                ref={joystickRef}
                className="w-full h-full rounded-full bg-amber-600/20 border-2 border-amber-600/50"
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-amber-500/60 uppercase tracking-wider">
                Movimento
              </div>
            </div>
          )}

          {/* Tap to shoot area (destra) */}
          {gameState === GameState.PLAYING && (
            <div 
              onClick={handleCanvasClick}
              className="absolute bottom-8 right-8 w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-600/20 border-2 border-red-600/50 flex items-center justify-center cursor-pointer hover:bg-red-600/30 transition-colors"
            >
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto text-red-500" />
                <span className="text-xs text-red-500/80 uppercase mt-1 block">SPARA</span>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {gameState === GameState.IDLE && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-black uppercase mb-4">
                  <span className="text-orange-600">Pronto</span> per l'allenamento?
                </h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                  Usa il joystick per muovere il mirino. Tocca lo schermo per sparare ai bersagli rossi.
                </p>
                <button 
                  onClick={actions.startGame}
                  
                  className="bg-amber-600 hover:bg-amber-700 text-black font-bold text-lg px-8 py-6"
                >
                  <Play className="w-6 h-6 mr-2" />
                  INIZIA ALLENAMENTO
                </button>
              </div>
            </div>
          )}

          {/* Pause Screen */}
          {gameState === GameState.PAUSED && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-black uppercase mb-6 text-amber-500">PAUSA</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={actions.resumeGame}
                    className="bg-amber-600 hover:bg-amber-700 text-black"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Riprendi
                  </button>
                  <button 
                    onClick={actions.endGame}
                    className="px-4 py-2 border border-red-600 text-red-500 hover:bg-red-600/20 rounded"
                  >
                    Termina
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === GameState.FINISHED && session && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
              <div className="text-center max-w-md">
                <h2 className="text-4xl font-black uppercase mb-2">
                  <span className="text-orange-600">Allenamento</span> Completato
                </h2>
                
                <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-zinc-900/80 border border-amber-600/30 p-4">
                    <div className="text-sm text-zinc-400">PUNTEGGIO</div>
                    <div className="text-3xl font-mono font-bold text-amber-500">{score}</div>
                  </div>
                  <div className="bg-zinc-900/80 border border-amber-600/30 p-4">
                    <div className="text-sm text-zinc-400">PRECISIONE</div>
                    <div className="text-3xl font-mono font-bold text-amber-500">{accuracy}%</div>
                  </div>
                  <div className="bg-zinc-900/80 border border-amber-600/30 p-4">
                    <div className="text-sm text-zinc-400">BERSAGLI COLPITI</div>
                    <div className="text-3xl font-mono font-bold text-amber-500">{session.targetsHit}</div>
                  </div>
                  <div className="bg-zinc-900/80 border border-amber-600/30 p-4">
                    <div className="text-sm text-zinc-400">TEMPO MEDIO</div>
                    <div className="text-3xl font-mono font-bold text-amber-500">{avgReaction}ms</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={actions.resetGame}
                    className="bg-amber-600 hover:bg-amber-700 text-black"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Riprova
                  </button>
                  <button 
                    onClick={onBack}
                    className="px-4 py-2 border border-amber-600 text-amber-500 hover:bg-amber-600/20 rounded"
                  >
                    Esci
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls hint */}
        <div className="mt-4 flex justify-between items-center text-sm text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-amber-600/50 bg-amber-600/20" />
              Joystick: muovi mirino
            </span>
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-red-600/50 bg-red-600/20" />
              Tappa: spara
            </span>
          </div>
          
          {gameState === GameState.PLAYING && (
            <button 
              onClick={actions.pauseGame}
              className="px-3 py-1 text-sm border border-amber-600/50 text-amber-500 hover:bg-amber-600/20 rounded"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
