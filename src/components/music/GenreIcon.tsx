import React from 'react';
import {
  Waves,
  Headphones,
  Activity,
  Zap,
  Coffee,
  Music,
  Target,
  Music2,
  Cloud,
  Radio,
  Cpu,
  Volume2,
} from 'lucide-react';

interface GenreIconProps {
  genre: string;
  className?: string;
}

export const GenreIcon: React.FC<GenreIconProps> = ({ genre, className = 'w-3.5 h-3.5' }) => {
  switch (genre.toLowerCase()) {
    case 'ambient':
      return <Waves className={className} />;
    case 'lofi beat':
    case 'lofi':
      return <Headphones className={className} />;
    case 'synthwave':
      return <Activity className={className} />;
    case 'electronic':
      return <Zap className={className} />;
    case 'indie chill':
      return <Coffee className={className} />;
    case 'orchestral':
      return <Music className={className} />;
    case 'deep focus':
      return <Target className={className} />;
    case 'neo-classical':
      return <Music2 className={className} />;
    case 'dream pop':
      return <Cloud className={className} />;
    case 'chillhop':
      return <Radio className={className} />;
    case 'cyberpunk':
      return <Cpu className={className} />;
    default:
      return <Volume2 className={className} />;
  }
};
