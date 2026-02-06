import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessDialog from "./SuccessDialog";

const ProposalSection = () => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoHover = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const maxX = container.width / 2 - 60;
    const maxY = container.height / 3;
    
    // Randomize position with playful movement
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    
    setNoButtonPosition({ x: newX, y: newY });
    setEscapeCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setShowSuccess(true);
  };

  const getNoButtonMessage = () => {
    const messages = [
      "No",
      "Are you sure?",
      "Really?",
      "Think again!",
      "Please? 🥺",
      "One more chance?",
      "Pretty please?",
      "💔",
    ];
    return messages[Math.min(escapeCount, messages.length - 1)];
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating hearts */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/20 text-2xl"
              style={{
                left: `${10 + i * 12}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              ♥
            </motion.div>
          ))}
        </div>

        {/* Central glow */}
        <div className="absolute w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

        {/* Main content */}
        <motion.div
          className="relative z-10 text-center max-w-md"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Heart icon */}
          <motion.div
            className="text-6xl mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.div>

          {/* Proposal text */}
          <motion.h1
            className="font-romantic text-4xl md:text-5xl text-foreground mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Will you be my
            <span className="block text-primary mt-2">Valentine?</span>
          </motion.h1>

          <motion.p
            className="font-soft text-muted-foreground text-lg mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            I've been waiting to ask you this...
          </motion.p>

          {/* Buttons container */}
          <div className="relative h-32 flex items-center justify-center gap-6">
            {/* Yes button */}
            <motion.button
              className="px-10 py-4 bg-primary text-primary-foreground font-soft font-semibold text-lg rounded-full shadow-glow transition-all hover:scale-105 active:scale-95"
              onClick={handleYesClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Yes! 💖
            </motion.button>

            {/* No button - escapes on hover/touch */}
            <motion.button
              className="px-8 py-4 bg-muted text-muted-foreground font-soft font-medium text-lg rounded-full transition-all"
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              animate={{
                x: noButtonPosition.x,
                y: noButtonPosition.y,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 0.95 }}
            >
              {getNoButtonMessage()}
            </motion.button>
          </div>

          {/* Playful hint after escapes */}
          <AnimatePresence>
            {escapeCount >= 3 && (
              <motion.p
                className="mt-8 text-blush/60 font-soft text-sm italic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {escapeCount >= 6 
                  ? "Just say yes already! 🥰" 
                  : "The answer is obvious, isn't it? 💕"}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom sparkles */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="text-primary/40"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
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
