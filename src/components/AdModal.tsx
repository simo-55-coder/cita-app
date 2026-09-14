import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlayCircle, Star, ShieldCheck, Heart } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: () => void;
  title?: string;
  description?: string;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  onRewardGranted,
  title = "Unlock Premium Feature",
  description = "Watch this short sponsor message to unlock your feature."
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRewarded, setIsRewarded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setIsPlaying(true);
      setIsRewarded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isPlaying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isOpen && isPlaying && countdown === 0) {
      setIsPlaying(false);
      setIsRewarded(true);
    }
    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, countdown]);

  const handleGrantReward = () => {
    onRewardGranted();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => {
              // Prevent closing while ad is playing
              if (!isPlaying) onClose();
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>

            {/* Video / Ad Area */}
            <div className="w-full bg-slate-900 aspect-video relative flex flex-col items-center justify-center overflow-hidden">
              {!isRewarded ? (
                <>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-400 to-transparent"></div>
                  <PlayCircle className="w-12 h-12 text-white/50 mb-3 animate-pulse" />
                  <p className="text-white font-medium text-lg relative z-10">
                    Sponsor Message
                  </p>
                  <p className="text-white/70 text-sm mt-1 relative z-10">
                    Ad finishes in {countdown}s
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center text-emerald-400"
                >
                  <ShieldCheck className="w-16 h-16 mb-2" />
                  <p className="text-white font-bold text-lg">Reward Unlocked!</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 flex flex-col gap-3">
              {isRewarded ? (
                <button
                  onClick={handleGrantReward}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Continue
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {/* Close Button (only allowed if not currently forcing a view, but we can leave it enabled for UX, or disable while counting) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
