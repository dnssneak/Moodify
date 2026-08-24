import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { WordsPullUpMultiStyle } from '../animation/WordsPullUpMultiStyle';
import type { TextSegment } from '../animation/WordsPullUpMultiStyle';
import { AnimatedLetter } from '../animation/AnimatedLetter';

export const LandingAbout: React.FC = () => {
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const headingSegments: TextSegment[] = [
    { text: 'I am Moodify AI,', className: 'font-normal font-sans' },
    { text: 'your personal sonic curator.', className: 'italic font-serif' },
    { text: 'I understand emotions, energy, and natural intent to craft soundscapes.', className: 'font-normal font-sans' },
  ];

  const bodyText =
    'Over the last seven years, Moodify has analyzed millions of sonic vectors, combining deep audio characteristics with natural language intent to deliver instant musical resonance across any atmosphere or focus state.';

  const characters = bodyText.split('');

  return (
    <section className="w-full bg-black py-12 md:py-24 px-4 md:px-6 flex justify-center select-none">
      <div className="w-full max-w-6xl rounded-3xl md:rounded-[2.5rem] bg-[#101010] p-8 sm:p-12 md:p-16 lg:p-20 text-center flex flex-col items-center gap-8 md:gap-12 border border-white/5 shadow-2xl">
        {/* Top Label */}
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest" style={{ color: '#DEDBC8' }}>
          AI Music Discovery
        </span>

        {/* Main Heading */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]" style={{ color: '#E1E0CC' }}>
          <WordsPullUpMultiStyle segments={headingSegments} />
        </div>

        {/* Scroll-Linked Body Paragraph Reveal */}
        <p
          ref={paragraphRef}
          className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed mt-4"
          style={{ color: '#DEDBC8' }}
        >
          {characters.map((char, index) => (
            <AnimatedLetter
              key={index}
              char={char}
              index={index}
              totalChars={characters.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  );
};
