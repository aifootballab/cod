import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  Crosshair, 
  Target, 
  ShotResult, 
  TrainingSession, 
  AimTrainerConfig, 
  JoystickData
} from '@/types/aim-trainer';
import { GameState, type GameStateType } from '@/types/aim-trainer';
import { DEFAULT_CONFIG } from '@/types/aim-trainer';

interface AimTrainerState {
  gameState: GameStateType;
  crosshair: Crosshair;
  targets: Target[];
  session: TrainingSession | null;
  score: number;
  timeRemaining: number;
}

interface AimTrainerActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  moveCrosshair: (joystickData: JoystickData) => void;
  setCrosshairPosition: (x: number, y: number) => void;
  shoot: () => ShotResult | null;
  spawnTarget: () => void;
  removeTarget: (targetId: string) => void;
}

export function useAimTrainer(
  canvasWidth: number,
  canvasHeight: number,
  config: AimTrainerConfig = DEFAULT_CONFIG
): [AimTrainerState, AimTrainerActions] {
  // Game state
  const [gameState, setGameState] = useState<GameStateType>(GameState.IDLE);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 secondi default
  
  // Entities
  const [crosshair, setCrosshair] = useState<Crosshair>({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    size: config.crosshairSize,
    color: config.crosshairColor,
  });
  
  const [targets, setTargets] = useState<Target[]>([]);
  const [session, setSession] = useState<TrainingSession | null>(null);
  
  // Refs per performance (evitare re-render inutili)
  const sessionRef = useRef<TrainingSession | null>(null);
  const targetsRef = useRef<Target[]>([]);
  const gameLoopRef = useRef<number | null>(null);
  const lastShotTime = useRef<number>(0);
  
  // Sincronizza refs
  useEffect(() => {
    targetsRef.current = targets;
  }, [targets]);
  
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Game loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      // Aggiorna timer
      setTimeRemaining(prev => {
        if (prev <= 0) {
          endGame();
          return 0;
        }
        return prev - 1/60; // 60fps
      });

      // Rimuovi target scaduti
      const now = Date.now();
      setTargets(prev => 
        prev.filter(t => now - t.spawnTime < t.maxLifetime)
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  // Spawn automatico target
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const interval = setInterval(() => {
      if (targetsRef.current.length < config.maxTargets) {
        spawnTarget();
      }
    }, config.targetSpawnRate);

    return () => clearInterval(interval);
  }, [gameState, config.targetSpawnRate, config.maxTargets]);

  const startGame = useCallback(() => {
    const now = Date.now();
    const newSession: TrainingSession = {
      id: `session-${now}`,
      startTime: now,
      shots: [],
      targetsHit: 0,
      targetsMissed: 0,
      averageReactionTime: 0,
      accuracy: 0,
    };
    
    setSession(newSession);
    setScore(0);
    setTimeRemaining(60);
    setTargets([]);
    setCrosshair({
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      size: config.crosshairSize,
      color: config.crosshairColor,
    });
    setGameState(GameState.PLAYING);
  }, [canvasWidth, canvasHeight, config]);

  const pauseGame = useCallback(() => {
    setGameState(GameState.PAUSED);
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const endGame = useCallback(() => {
    setGameState(GameState.FINISHED);
    
    if (sessionRef.current) {
      const finalSession = {
        ...sessionRef.current,
        endTime: Date.now(),
      };
      
      // Calcola statistiche finali
      const totalShots = finalSession.shots.length;
      const hits = finalSession.shots.filter(s => s.hit).length;
      const avgReaction = totalShots > 0 
        ? finalSession.shots.reduce((acc, s) => acc + s.reactionTime, 0) / totalShots 
        : 0;
      
      finalSession.accuracy = totalShots > 0 ? (hits / totalShots) * 100 : 0;
      finalSession.averageReactionTime = avgReaction;
      
      setSession(finalSession);
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GameState.IDLE);
    setScore(0);
    setTimeRemaining(60);
    setTargets([]);
    setSession(null);
  }, []);

  const moveCrosshair = useCallback((joystickData: JoystickData) => {
    if (gameState !== GameState.PLAYING) return;

    const speed = joystickData.force * config.sensitivity * 8; // 8 = base speed
    
    setCrosshair(prev => {
      const newX = prev.x + joystickData.vector.x * speed;
      const newY = prev.y + joystickData.vector.y * speed;
      
      // Boundary check
      return {
        ...prev,
        x: Math.max(prev.size, Math.min(canvasWidth - prev.size, newX)),
        y: Math.max(prev.size, Math.min(canvasHeight - prev.size, newY)),
      };
    });
  }, [gameState, config.sensitivity, canvasWidth, canvasHeight]);

  const setCrosshairPosition = useCallback((x: number, y: number) => {
    if (gameState !== GameState.PLAYING) return;
    
    setCrosshair(prev => ({
      ...prev,
      x: Math.max(prev.size, Math.min(canvasWidth - prev.size, x)),
      y: Math.max(prev.size, Math.min(canvasHeight - prev.size, y)),
    }));
  }, [gameState, canvasWidth, canvasHeight]);

  const shoot = useCallback((): ShotResult | null => {
    if (gameState !== GameState.PLAYING) return null;

    const now = Date.now();
    const reactionTime = now - lastShotTime.current;
    lastShotTime.current = now;

    // Trova target colpiti
    let hit = false;
    let hitTargetId: string | undefined;
    let minDistance = Infinity;

    targetsRef.current.forEach(target => {
      const dx = crosshair.x - target.x;
      const dy = crosshair.y - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < target.radius + crosshair.size / 2) {
        hit = true;
        if (distance < minDistance) {
          minDistance = distance;
          hitTargetId = target.id;
        }
      }
    });

    const result: ShotResult = {
      hit,
      targetId: hitTargetId,
      reactionTime,
      distance: hit ? minDistance : 0,
      timestamp: now,
    };

    // Aggiorna sessione
    if (sessionRef.current) {
      sessionRef.current.shots.push(result);
      if (hit && hitTargetId) {
        sessionRef.current.targetsHit++;
        setScore(s => s + 100);
        removeTarget(hitTargetId);
      } else {
        sessionRef.current.targetsMissed++;
      }
    }

    return result;
  }, [gameState, crosshair]);

  const spawnTarget = useCallback(() => {
    const id = `target-${Date.now()}-${Math.random()}`;
    const radius = config.targetMinSize + Math.random() * (config.targetMaxSize - config.targetMinSize);
    
    // Margine per non spawnare troppo ai bordi
    const margin = radius + 50;
    
    const target: Target = {
      id,
      x: margin + Math.random() * (canvasWidth - margin * 2),
      y: margin + Math.random() * (canvasHeight - margin * 2),
      radius,
      color: '#ef4444', // red-500
      spawnTime: Date.now(),
      maxLifetime: config.targetLifetime,
    };

    setTargets(prev => [...prev, target]);
  }, [canvasWidth, canvasHeight, config]);

  const removeTarget = useCallback((targetId: string) => {
    setTargets(prev => prev.filter(t => t.id !== targetId));
  }, []);

  const state: AimTrainerState = {
    gameState,
    crosshair,
    targets,
    session,
    score,
    timeRemaining,
  };

  const actions: AimTrainerActions = {
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    moveCrosshair,
    setCrosshairPosition,
    shoot,
    spawnTarget,
    removeTarget,
  };

  return [state, actions];
}
