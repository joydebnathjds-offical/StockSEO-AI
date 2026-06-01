import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";

export const CreditWarning: React.FC = () => {
  const { currentUser, setShowPaywall } = useAppStore();
  const [dismissed, setDismissed] = React.useState(false);

  if (!currentUser || dismissed) return null;

  const isLow = currentUser.credits <= 3 && currentUser.credits > 0;
  const isExhausted = currentUser.credits <= 0;

  if (!isLow && !isExhausted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-xl",
          isExhausted
            ? "bg-red-500/20 border-red-400/40 text-red-300"
            : "bg-amber-500/20 border-amber-400/40 text-amber-300"
        )}
      >
        <Zap className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-semibold">
          {isExhausted
            ? "No credits remaining! Upgrade to continue generating."
            : `Only ${currentUser.credits} credit${currentUser.credits !== 1 ? "s" : ""} left! Upgrade soon.`}
        </span>
        {isExhausted && (
          <button
            onClick={() => setShowPaywall(true)}
            className="ml-2 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-bold cursor-pointer transition-all"
          >
            Upgrade
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-all"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreditWarning;
