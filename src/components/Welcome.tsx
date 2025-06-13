import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setTimeout(onComplete, 1000); // Wait for exit animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-center px-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="mb-6 inline-block"
            >
              <ClipboardCheck className="h-16 w-16 text-white" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              Welcome to
            </motion.h1>
            <div className="space-y-2 md:space-y-0">
              <motion.h2 
                className="text-3xl md:text-5xl font-bold text-white/90"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Kaya Online
              </motion.h2>
              <motion.h2 
                className="text-3xl md:text-5xl font-bold text-white/90 md:inline md:ml-2"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Attendance System
              </motion.h2>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}