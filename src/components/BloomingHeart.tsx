import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  delay: number;
  opacity: number;
}

interface BloomingHeartProps {
  onComplete: () => void;
}

const BloomingHeart = ({ onComplete }: BloomingHeartProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [phase, setPhase] = useState<"scatter" | "forming" | "complete">("scatter");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateHeartPoints = (count: number, scale: number, centerX: number, centerY: number) => {
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // Heart parametric equation
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
        });
      }
      // Fill the heart with some interior points
      for (let i = 0; i < count * 0.5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.7;
        const t = angle;
        const x = 16 * Math.pow(Math.sin(t), 3) * radius;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * radius;
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
        });
      }
      return points;
    };

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) / 50;

    const heartPoints = generateHeartPoints(80, scale, centerX, centerY);
    
    const newParticles: Particle[] = heartPoints.map((point, i) => ({
      id: i,
      // Start scattered
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      targetX: point.x,
      targetY: point.y,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 2,
      opacity: 0.6 + Math.random() * 0.4,
    }));

    setParticles(newParticles);
    
    // Start forming after a brief moment
    setTimeout(() => setPhase("forming"), 500);
    
    // Complete after animation
    setTimeout(() => {
      setPhase("complete");
      setTimeout(onComplete, 1500);
    }, 6000);
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-64 h-64 rounded-full bg-primary/20 blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase === "forming" || phase === "complete" ? 1.5 : 0, 
            opacity: phase === "forming" || phase === "complete" ? 0.5 : 0 
          }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
      </div>

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(340 100% 75%) 0%, hsl(340 80% 65%) 50%, transparent 100%)`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(340 100% 70% / 0.6)`,
          }}
          initial={{
            x: particle.x - particle.size / 2,
            y: particle.y - particle.size / 2,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: phase === "scatter" 
              ? particle.x - particle.size / 2 
              : particle.targetX - particle.size / 2,
            y: phase === "scatter" 
              ? particle.y - particle.size / 2 
              : particle.targetY - particle.size / 2,
            opacity: particle.opacity,
            scale: phase === "complete" ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: phase === "forming" ? 4 + particle.delay : 0.5,
            ease: "easeInOut",
            delay: phase === "scatter" ? particle.delay * 0.3 : 0,
            scale: {
              duration: 1.5,
              repeat: phase === "complete" ? 1 : 0,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      {/* Sparkles */}
      {phase !== "scatter" && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-cream"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                delay: 2 + i * 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          ))}
        </>
      )}

      {/* Loading text */}
      <motion.p
        className="absolute bottom-20 text-blush/60 font-soft text-sm tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "scatter" || phase === "forming" ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {phase === "scatter" ? "..." : "💕"}
      </motion.p>
    </div>
  );
};

export default BloomingHeart;
