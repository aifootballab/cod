import { useRef, useCallback } from 'react';
import type { 
  CrosshairTelemetry, 
  ShotTelemetry, 
  RawTelemetryData,
  MovementPattern
} from '@/types/aim-analytics';

export function useAimTelemetry() {
  const crosshairPathRef = useRef<CrosshairTelemetry[]>([]);
  const shotsRef = useRef<ShotTelemetry[]>([]);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);

  const startTelemetry = useCallback(() => {
    crosshairPathRef.current = [];
    shotsRef.current = [];
    lastPositionRef.current = null;
    sessionStartRef.current = Date.now();
  }, []);

  const recordCrosshairPosition = useCallback((x: number, y: number) => {
    const now = Date.now();
    const timestamp = now - sessionStartRef.current;
    
    let velocityX = 0;
    let velocityY = 0;
    let acceleration = 0;
    let direction = 0;

    if (lastPositionRef.current && lastTimestampRef.current > 0) {
      const dt = (now - lastTimestampRef.current) / 1000; // in secondi
      
      if (dt > 0) {
        velocityX = (x - lastPositionRef.current.x) / dt;
        velocityY = (y - lastPositionRef.current.y) / dt;
        
        const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        
        // Calcola accelerazione (cambio di velocità)
        const lastEntry = crosshairPathRef.current[crosshairPathRef.current.length - 1];
        if (lastEntry) {
          const lastVelocity = Math.sqrt(
            lastEntry.velocityX * lastEntry.velocityX + 
            lastEntry.velocityY * lastEntry.velocityY
          );
          acceleration = (velocity - lastVelocity) / dt;
        }
        
        // Direzione in gradi (0 = destra, 90 = su, 180 = sinistra, 270 = giù)
        direction = (Math.atan2(-velocityY, velocityX) * 180 / Math.PI + 360) % 360;
      }
    }

    const telemetry: CrosshairTelemetry = {
      timestamp,
      x,
      y,
      velocityX,
      velocityY,
      acceleration: Math.abs(acceleration),
      direction,
    };

    crosshairPathRef.current.push(telemetry);
    lastPositionRef.current = { x, y };
    lastTimestampRef.current = now;

    // Limita la dimensione dell'array (ultimi 10 secondi)
    if (crosshairPathRef.current.length > 600) {
      crosshairPathRef.current = crosshairPathRef.current.slice(-600);
    }
  }, []);

  const recordShot = useCallback((
    targetX: number,
    targetY: number,
    shotX: number,
    shotY: number,
    reactionTime: number,
    hit: boolean,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const dx = shotX - targetX;
    const dy = shotY - targetY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    
    // Determina la zona del bersaglio
    let targetZone: 'center' | 'left' | 'right' | 'top' | 'bottom' = 'center';
    
    // Calcola posizione relativa al canvas (0-1)
    const relX = targetX / canvasWidth;
    const relY = targetY / canvasHeight;
    
    if (relX < 0.33) targetZone = 'left';
    else if (relX > 0.66) targetZone = 'right';
    else if (relY < 0.33) targetZone = 'top';
    else if (relY > 0.66) targetZone = 'bottom';

    const shot: ShotTelemetry = {
      timestamp: Date.now() - sessionStartRef.current,
      targetX,
      targetY,
      shotX,
      shotY,
      distanceFromCenter,
      reactionTime,
      targetZone,
      hit,
    };

    shotsRef.current.push(shot);
  }, []);

  const analyzeMovementPattern = useCallback((): MovementPattern => {
    const path = crosshairPathRef.current;
    if (path.length < 10) {
      return {
        type: 'linear',
        consistency: 50,
        overCorrection: false,
        preferredDirection: 'mixed',
      };
    }

    // Analizza accelerazioni per determinare se è "jerky" o "smooth"
    const accelerations = path.map(p => p.acceleration);
    const avgAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;
    const maxAcceleration = Math.max(...accelerations);
    
    // Over-correction: molte accelerazioni forti seguite da inversioni
    let directionChanges = 0;
    let overCorrections = 0;
    
    for (let i = 2; i < path.length; i++) {
      const prevDir = path[i - 1].direction;
      const currDir = path[i].direction;
      
      // Cambio direzione significativo (>90 gradi)
      const dirDiff = Math.abs(currDir - prevDir);
      if (dirDiff > 90 && dirDiff < 270) {
        directionChanges++;
        if (path[i].acceleration > avgAcceleration * 2) {
          overCorrections++;
        }
      }
    }
    
    const hasOverCorrection = overCorrections > directionChanges * 0.3;
    
    // Determina tipo di pattern
    let type: MovementPattern['type'] = 'linear';
    if (maxAcceleration > avgAcceleration * 5) {
      type = 'jerky';
    } else if (avgAcceleration < 100) {
      type = 'smooth';
    }
    
    // Analizza preferenza direzionale
    const horizontalMoves = path.filter(p => 
      (p.direction >= 315 || p.direction <= 45) || 
      (p.direction >= 135 && p.direction <= 225)
    ).length;
    
    const verticalMoves = path.filter(p => 
      (p.direction > 45 && p.direction < 135) || 
      (p.direction > 225 && p.direction < 315)
    ).length;
    
    let preferredDirection: MovementPattern['preferredDirection'] = 'mixed';
    if (horizontalMoves > verticalMoves * 1.5) preferredDirection = 'horizontal';
    else if (verticalMoves > horizontalMoves * 1.5) preferredDirection = 'vertical';
    
    // Consistency basata su deviazione standard delle velocità
    const velocities = path.map(p => Math.sqrt(p.velocityX ** 2 + p.velocityY ** 2));
    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const variance = velocities.reduce((acc, v) => acc + (v - avgVelocity) ** 2, 0) / velocities.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, Math.min(100, 100 - (stdDev / avgVelocity) * 50));

    return {
      type,
      consistency: Math.round(consistency),
      overCorrection: hasOverCorrection,
      preferredDirection,
    };
  }, []);

  const getTelemetryData = useCallback((): RawTelemetryData => {
    return {
      crosshairPath: [...crosshairPathRef.current],
      shots: [...shotsRef.current],
      sessionDuration: Date.now() - sessionStartRef.current,
      targetsSpawned: shotsRef.current.length,
      targetsHit: shotsRef.current.filter(s => s.hit).length,
    };
  }, []);

  return {
    startTelemetry,
    recordCrosshairPosition,
    recordShot,
    analyzeMovementPattern,
    getTelemetryData,
  };
}
