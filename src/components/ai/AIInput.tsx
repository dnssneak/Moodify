import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIInputProps {
  onSearch: (prompt: string) => void;
  placeholder?: string;
  isGenerating?: boolean;
}

const SAMPLE_PROMPTS = [
  'Peaceful lofi beats for late-night coding',
  'High energy synthwave for workout',
  'Dreamy ambient music for a rainy evening',
  'Upbeat indie chill for study focus',
];

export const AIInput: React.FC<AIInputProps> = ({
  onSearch,
  placeholder = 'Describe your vibe, mood, or context (e.g. "Peaceful ambient for studying on a rainy evening")...',
  isGenerating = false,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isGenerating) {
      onSearch(value.trim());
    }
  };

  const handleSampleClick = (prompt: string) => {
    setValue(prompt);
    onSearch(prompt);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center rounded-2xl glass-input bg-[#121216]/90 p-2 border border-white/15 focus-within:border-[#DEDBC8] shadow-xl transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DEDBC8]/15 text-[#DEDBC8] ml-1">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#E1E0CC] placeholder-gray-400 focus:outline-none"
            disabled={isGenerating}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!value.trim() || isGenerating}
            className="btn-primary py-2 px-4 font-bold text-xs whitespace-nowrap flex-shrink-0"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </motion.button>
        </div>
      </form>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#DEDBC8]" /> Try:
        </span>
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSampleClick(prompt)}
            className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-300 border border-white/10 hover:border-[#DEDBC8]/50 hover:bg-[#DEDBC8]/10 hover:text-[#DEDBC8] transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
