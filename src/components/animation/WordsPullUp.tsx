import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  delay?: number;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({
  text,
  className = '',
  showAsterisk = false,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const words = text.split(' ');

  return (
    <h1
      ref={containerRef}
      className={`inline-flex flex-wrap whitespace-nowrap items-baseline ${className}`}
      style={{ color: '#E1E0CC' }}
    >
      {words.map((word, wordIdx) => {
        const isLastWord = wordIdx === words.length - 1;
        const lastChar = word.slice(-1);
        const wordHead = word.slice(0, -1);

        return (
          <span key={wordIdx} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
            <motion.span
              className="inline-block relative"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + wordIdx * 0.08,
              }}
            >
              {isLastWord && showAsterisk ? (
                <>
                  {wordHead}
                  <span className="relative inline-block">
                    {lastChar}
                    <sup className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] font-normal leading-none select-none">
                      *
                    </sup>
                  </span>
                </>
              ) : (
                word
              )}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
};
