import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ score, size = 'md', showLabel = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm backdrop-blur-md bg-black/60 text-[#DEDBC8] border-[#DEDBC8]/40 ${sizeClasses[size]}`}
    >
      <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#DEDBC8]" />
      <span>{score}%</span>
      {showLabel && <span className="opacity-80 font-normal">AI Match</span>}
    </motion.div>
  );
};
