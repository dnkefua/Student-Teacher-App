import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
  theme?: { solidBg: string; text: string };
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  caption,
  theme = { solidBg: 'bg-emerald-600', text: 'text-emerald-600' }
}: ImageModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-pointer"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center"
          >
            <button
              onClick={onClose}
              className={`absolute -top-12 sm:-top-16 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors`}
              aria-label="Close fullscreen image"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl flex items-center justify-center min-h-[50vh] min-h-[500px]">
               <img
                  src={imageUrl}
                  alt={caption || "Fullscreen diagram"}
                  className="w-full h-[60vh] sm:h-[80vh] object-contain"
                  referrerPolicy="no-referrer"
               />
            </div>
            
            {caption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-center max-w-3xl"
              >
                <p className="text-white text-lg sm:text-xl font-medium tracking-wide drop-shadow-md">
                  {caption}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
