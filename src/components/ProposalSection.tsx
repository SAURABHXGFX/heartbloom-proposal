import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessDialog from "./SuccessDialog";

const ProposalSection = () => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNoEscape = () => {
    // Random escape in a circular pattern around current position
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 60;
    
    const newX = Math.cos(angle) * distance;
    const newY = Math.sin(angle) * distance;
    
    // Keep within reasonable bounds
    const boundedX = Math.max(-120, Math.min(120, noButtonPosition.x + newX));
    const boundedY = Math.max(-100, Math.min(100, noButtonPosition.y + newY));
    
    setNoButtonPosition({ x: boundedX, y: boundedY });
    setEscapeCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setShowSuccess(true);
  };

  const getNoButtonText = () => {
    const texts = ["No", "babe!", "Sure?", "Really?", "🥺", "Please?", "Why not?", "💔"];
    return texts[Math.min(escapeCount, texts.length - 1)];
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating hearts background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/15 text-3xl"
              style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            >
              ♥
            </motion.div>
          ))}
        </div>

        {/* Central glow */}
        <div className="absolute w-72 h-72 rounded-full bg-primary/15 blur-3xl" />

        {/* Main content */}
        <motion.div
          className="relative z-10 text-center w-full max-w-sm px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Animated heart */}
          <motion.div
            className="text-5xl md:text-6xl mb-5"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            💕
          </motion.div>

          {/* Proposal text */}
          <motion.h1
            className="font-romantic text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Will you be my
            <span className="block text-primary mt-1">Valentine?</span>
          </motion.h1>

          <motion.p
            className="font-soft text-muted-foreground text-base md:text-lg mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            I've been waiting to ask you this...
          </motion.p>

          {/* Buttons */}
          <motion.div 
            className="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[140px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {/* Yes button - always centered and prominent */}
            <motion.button
              className="px-10 py-4 bg-primary text-primary-foreground font-soft font-semibold text-lg rounded-full shadow-glow z-10"
              onClick={handleYesClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Yes! 💖
            </motion.button>

            {/* No button - escapes on hover/touch */}
            <motion.button
              className="absolute px-6 py-3 bg-muted/80 text-muted-foreground font-soft font-medium text-base rounded-full border border-border/50 touch-none"
              style={{ right: "10%", top: "50%" }}
              onMouseEnter={handleNoEscape}
              onTouchStart={handleNoEscape}
              onClick={handleNoEscape}
              animate={{
                x: noButtonPosition.x,
                y: noButtonPosition.y,
                rotate: escapeCount > 3 ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              whileHover={{ scale: 0.9 }}
            >
              {getNoButtonText()}
            </motion.button>
          </motion.div>

          {/* Hint text */}
          <AnimatePresence>
            {escapeCount >= 2 && (
              <motion.p
                className="mt-6 text-blush/50 font-soft text-sm italic"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {escapeCount >= 5 ? "Just say yes! 🥰" : "Hmm, that button is shy... 💕"}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom sparkles */}
        <div className="absolute bottom-8 flex gap-3">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="text-primary/30 text-lg"
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
            >
              ✦
            </motion.span>
          ))}
        </div>
      </motion.div>

      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
};

export default ProposalSection;
