import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIThinkingProps {
  step?: string;
}

export const AIThinking: React.FC<AIThinkingProps> = ({ step = 'Moodify is curating your vibe...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center p-8 rounded-2xl glass-panel border border-[#DEDBC8]/30 bg-[#101014]/90 shadow-2xl text-center my-6"
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DEDBC8]/15 border border-[#DEDBC8]/40 mb-4">
        <Sparkles className="w-8 h-8 text-[#DEDBC8] animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto w-12 h-12 text-[#E1E0CC] animate-spin opacity-40" />
      </div>

      <h4 className="text-base font-bold text-[#E1E0CC] tracking-wide">AI Curator is thinking</h4>
      <p className="text-xs text-[#DEDBC8] mt-1 animate-pulse font-medium">{step}</p>
    </motion.div>
  );
};
