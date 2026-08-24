import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WordsPullUp } from '../animation/WordsPullUp';
import { useNavigate } from 'react-router-dom';

interface LandingHeroProps {
  onSearchSubmit?: (prompt: string) => void;
  brandName?: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSearchSubmit,
  brandName = 'Moodify',
}) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      if (onSearchSubmit) onSearchSubmit(prompt.trim());
      else navigate(`/discover?q=${encodeURIComponent(prompt.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  return (
    <section className="relative w-full h-screen p-4 md:p-6 bg-black select-none">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black flex flex-col justify-between">
        {/* Background Video */}
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />

        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none z-10" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10 pointer-events-none" />

        {/* Bottom Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8 md:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6 md:gap-8">
            <div className="lg:col-span-8 overflow-visible">
              <WordsPullUp
                text={brandName}
                showAsterisk={true}
                className="text-[17vw] sm:text-[15vw] md:text-[14vw] lg:text-[13vw] xl:text-[12.5vw] 2xl:text-[12vw] font-medium leading-[0.82] tracking-[-0.05em] whitespace-nowrap"
              />
            </div>

            {/* Right 4 Columns: Paragraph, Natural Search & CTA Button */}
            <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6 max-w-md lg:max-w-none">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm md:text-base font-normal leading-[1.2]"
                style={{ color: 'rgba(222, 219, 200, 0.7)' }}
              >
                Moodify is an AI-powered music discovery network that transforms your natural language mood and intent into personalized soundscapes and 3D WebGL visualizers.
              </motion.p>

              {/* Natural Intent Search Bar */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center rounded-full bg-black/60 backdrop-blur-md border border-[#DEDBC8]/30 p-1.5 focus-within:border-[#DEDBC8]"
              >
                <Sparkles className="w-4 h-4 text-[#DEDBC8] ml-3 animate-pulse flex-shrink-0" />
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vibe (e.g. 'Peaceful ambient for studying')..."
                  className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#E1E0CC] placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 shadow-xl flex-shrink-0 group hover:gap-3"
                >
                  <span className="font-bold text-xs sm:text-sm">Launch Lab</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[#E1E0CC] transition-transform duration-300 group-hover:scale-110">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
