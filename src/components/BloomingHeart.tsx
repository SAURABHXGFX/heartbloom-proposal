import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  startX: number;
  startY: number;
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

  useEffect(() => {
    const generateHeartPoints = (count: number) => {
      const points: { x: number; y: number }[] = [];
      // Outline of heart
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({ x, y });
      }
      // Fill interior
      for (let i = 0; i < count * 0.6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.8;
        const t = angle;
        const x = 16 * Math.pow(Math.sin(t), 3) * radius;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * radius;
        points.push({ x, y });
      }
      return points;
    };

    const scale = Math.min(window.innerWidth, window.innerHeight) / 55;
    const heartPoints = generateHeartPoints(70);
    
    const newParticles: Particle[] = heartPoints.map((point, i) => ({
      id: i,
      // Start scattered across viewport (in percentage)
      startX: (Math.random() - 0.5) * 80,
      startY: (Math.random() - 0.5) * 80,
      // Target position relative to center (scaled)
      targetX: point.x * scale,
      targetY: point.y * scale,
      size: 5 + Math.random() * 7,
      delay: Math.random() * 1.5,
      opacity: 0.7 + Math.random() * 0.3,
    }));

    setParticles(newParticles);
    
    setTimeout(() => setPhase("forming"), 300);
    setTimeout(() => {
      setPhase("complete");
      setTimeout(onComplete, 1200);
    }, 6500);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/30 blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: phase !== "scatter" ? 2 : 0, 
          opacity: phase !== "scatter" ? 0.6 : 0 
        }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />

      {/* Particles container - centered */}
      <div className="relative w-full h-full flex items-center justify-center">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, hsl(340 100% 80%) 0%, hsl(340 85% 65%) 60%, transparent 100%)`,
              boxShadow: `0 0 ${particle.size * 2}px hsl(340 100% 70% / 0.7)`,
            }}
            initial={{
              x: particle.startX + "vw",
              y: particle.startY + "vh",
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: phase === "scatter" ? particle.startX + "vw" : particle.targetX,
              y: phase === "scatter" ? particle.startY + "vh" : particle.targetY,
              opacity: phase === "scatter" ? 0.5 : particle.opacity,
              scale: phase === "complete" ? [1, 1.15, 1] : 1,
            }}
            transition={{
              duration: phase === "forming" ? 3.5 + particle.delay : 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              delay: phase === "scatter" ? particle.delay * 0.2 : 0,
              scale: {
                duration: 1.2,
                repeat: phase === "complete" ? 1 : 0,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      {phase !== "scatter" && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-cream"
              style={{
                left: `${25 + Math.random() * 50}%`,
                top: `${25 + Math.random() * 50}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                duration: 1.8,
                delay: 2.5 + i * 0.25,
                repeat: Infinity,
                repeatDelay: 2.5,
              }}
            />
          ))}
        </>
      )}

      {/* Loading indicator */}
      <motion.p
        className="absolute bottom-16 text-blush/50 font-soft text-sm tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== "complete" ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {phase === "scatter" ? "✨" : "💕"}
      </motion.p>
    </div>
  );
};

export default BloomingHeart;
