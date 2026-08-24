import React from 'react';
import {
  Sun,
  Wind,
  Flame,
  CloudRain,
  Brain,
  Sparkles,
  Radio,
  Heart,
  Zap,
  CloudDrizzle,
  Music,
} from 'lucide-react';

interface MoodIconProps {
  moodId: string;
  className?: string;
}

export const MoodIcon: React.FC<MoodIconProps> = ({ moodId, className = 'w-5 h-5' }) => {
  switch (moodId.toLowerCase()) {
    case 'happy':
      return <Sun className={className} />;
    case 'calm':
      return <Wind className={className} />;
    case 'energetic':
      return <Flame className={className} />;
    case 'melancholic':
      return <CloudRain className={className} />;
    case 'focused':
      return <Brain className={className} />;
    case 'dreamy':
      return <Sparkles className={className} />;
    case 'nostalgic':
      return <Radio className={className} />;
    case 'romantic':
      return <Heart className={className} />;
    case 'motivated':
      return <Zap className={className} />;
    case 'sad':
      return <CloudDrizzle className={className} />;
    default:
      return <Music className={className} />;
  }
};
