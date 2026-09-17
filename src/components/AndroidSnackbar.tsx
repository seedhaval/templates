import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Copy } from 'lucide-react';
import { SnackbarState } from '../types';

interface AndroidSnackbarProps {
  snackbar: SnackbarState;
  onDismiss: () => void;
}

export const AndroidSnackbar: React.FC<AndroidSnackbarProps> = ({ snackbar, onDismiss }) => {
  useEffect(() => {
    if (!snackbar.visible) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2500);
    return () => clearTimeout(timer);
  }, [snackbar.visible, snackbar.id, onDismiss]);

  return (
    <AnimatePresence>
      {snackbar.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-6 left-4 right-4 max-w-md mx-auto z-50 pointer-events-auto"
          id="clipboard-snackbar"
        >
          <div className="flex items-center gap-3 bg-slate-900/95 text-slate-50 px-4 py-3 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight text-white leading-none">
                {snackbar.message}
              </p>
              {snackbar.detail && (
                <p className="text-xs text-slate-400 truncate mt-1 font-mono">
                  "{snackbar.detail}"
                </p>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 active:scale-95 px-2 py-1 rounded transition-colors"
              id="btn-dismiss-snackbar"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
