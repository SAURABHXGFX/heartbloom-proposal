import { motion, AnimatePresence } from "framer-motion";
import happyFriends from "@/assets/happy-friends.png";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

const SuccessDialog = ({ open, onClose }: SuccessDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Confetti/hearts explosion */}
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10%",
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: "120vh",
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeIn",
                }}
              >
                {["💕", "💖", "💗", "💓", "✨", "🌸", "💝"][Math.floor(Math.random() * 7)]}
              </motion.div>
            ))}
          </div>

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-card border border-primary/30 rounded-3xl p-8 max-w-sm w-full shadow-glow text-center overflow-hidden"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

              {/* Cute illustration */}
              <motion.div
                className="relative z-10 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <motion.img
                  src={happyFriends}
                  alt="Happy couple"
                  className="w-48 h-48 mx-auto object-contain drop-shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Success message */}
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-romantic text-3xl text-foreground mb-3">
                  Yay! 💕
                </h2>
                <p className="font-soft text-muted-foreground leading-relaxed">
                  You just made me the happiest person in the world! 
                  Can't wait to spend this special day with you!
                </p>

                {/* Hearts decoration */}
                <div className="flex justify-center gap-2 mt-6 text-2xl">
                  {["💖", "💗", "💕"].map((heart, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    >
                      {heart}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Close button */}
              <motion.button
                className="mt-8 px-8 py-3 bg-primary text-primary-foreground font-soft font-semibold rounded-full shadow-glow"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Forever & Always 💝
              </motion.button>

              {/* Corner sparkles */}
              <motion.span
                className="absolute top-4 right-4 text-primary/60"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✦
              </motion.span>
              <motion.span
                className="absolute bottom-4 left-4 text-accent/60"
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ✦
              </motion.span>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessDialog;
