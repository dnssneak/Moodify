import React from 'react';
import { motion } from 'framer-motion';
import type { Track, AIRecommendation } from '../../types/music';
import { TrackCard } from './TrackCard';

interface TrackGridProps {
  tracks: Track[];
  recommendations?: { track: Track; recommendation: AIRecommendation }[];
}

export const TrackGrid: React.FC<TrackGridProps> = ({ tracks, recommendations }) => {
  const recMap = new Map(recommendations?.map((r) => [r.track.id, r.recommendation]));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 items-stretch"
    >
      {tracks.map((track) => (
        <motion.div key={track.id} variants={itemVariants} className="h-full flex flex-col">
          <TrackCard track={track} recommendation={recMap.get(track.id)} />
        </motion.div>
      ))}
    </motion.div>
  );
};
