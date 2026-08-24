import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { WordsPullUpMultiStyle } from '../animation/WordsPullUpMultiStyle';
import type { TextSegment } from '../animation/WordsPullUpMultiStyle';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ index, children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.15,
      }}
      className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/5 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const LandingFeatures: React.FC = () => {
  const navigate = useNavigate();

  const headerSegments: TextSegment[] = [
    { text: 'Studio-grade workflows for visionary creators.\n', className: 'block font-normal text-[#E1E0CC]' },
    { text: 'Built for pure vision. Powered by sound.', className: 'block font-normal text-gray-500 mt-1' },
  ];

  return (
    <section className="relative min-h-screen w-full bg-black py-16 md:py-24 px-4 md:px-6 select-none overflow-hidden flex flex-col justify-between">
      {/* Background Noise Filter */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-12 md:mb-16">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          <WordsPullUpMultiStyle segments={headerSegments} />
        </div>
      </div>

      {/* 4-Column Card Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:min-h-[480px] w-full max-w-7xl mx-auto">
        {/* Card 1 - Video Background Card */}
        <FeatureCard index={0} className="relative bg-black min-h-[300px] lg:min-h-0">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <div className="relative z-20 mt-auto">
            <h3 className="text-lg md:text-xl font-medium" style={{ color: '#E1E0CC' }}>
              Your sonic canvas.
            </h3>
          </div>
        </FeatureCard>

        {/* Card 2 - Natural Intent Search */}
        <FeatureCard index={1} className="bg-[#212121]">
          <div className="flex flex-col gap-4">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
              alt="Icon"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/10"
            />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">01</div>
              <h3 className="text-base sm:text-lg font-medium text-[#E1E0CC] mt-0.5">Natural Intent Search.</h3>
            </div>

            <ul className="space-y-2 mt-2">
              {[
                'Natural language prompt parsing',
                'Mood & energy vector matching',
                'Contextual scenario extraction',
                'Instant candidate ranking',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#DEDBC8' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-white/5">
            <button
              onClick={() => navigate('/discover')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              style={{ color: '#DEDBC8' }}
            >
              <span>Explore Search</span>
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </FeatureCard>

        {/* Card 3 - Explainable AI Match */}
        <FeatureCard index={2} className="bg-[#212121]">
          <div className="flex flex-col gap-4">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
              alt="Icon"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/10"
            />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">02</div>
              <h3 className="text-base sm:text-lg font-medium text-[#E1E0CC] mt-0.5">Explainable AI Match.</h3>
            </div>

            <ul className="space-y-2 mt-2">
              {[
                'Transparent match percentage',
                'Reasoning checklist breakdown',
                'BPM & energy level synergy',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#DEDBC8' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-white/5">
            <button
              onClick={() => navigate('/ai-playlist')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              style={{ color: '#DEDBC8' }}
            >
              <span>AI Playlist Generator</span>
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </FeatureCard>

        {/* Card 4 - 3D WebGL Soundscapes */}
        <FeatureCard index={3} className="bg-[#212121]">
          <div className="flex flex-col gap-4">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
              alt="Icon"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/10"
            />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">03</div>
              <h3 className="text-base sm:text-lg font-medium text-[#E1E0CC] mt-0.5">3D WebGL Soundscapes.</h3>
            </div>

            <ul className="space-y-2 mt-2">
              {[
                'Three.js 3D WebGL audio orb',
                '3D spatial cursor tilt cards',
                'Web Audio API ambient synth',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#DEDBC8' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-white/5">
            <button
              onClick={() => navigate('/library')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              style={{ color: '#DEDBC8' }}
            >
              <span>View Library</span>
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};
