import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface TextSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
  delay?: number;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({
  segments,
  className = '',
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  let wordCounter = 0;

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap justify-center ${className}`}>
      {segments.map((segment, segIdx) => {
        const words = segment.text.split(' ');

        return (
          <span key={segIdx} className={`inline-flex flex-wrap ${segment.className || ''}`}>
            {words.map((word, wordIdx) => {
              const currentDelay = delay + wordCounter * 0.08;
              wordCounter++;

              return (
                <span key={wordIdx} className="inline-block overflow-hidden mr-[0.25em] last:mr-[0.1em]">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: currentDelay,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
