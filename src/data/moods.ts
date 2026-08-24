export interface MoodOption {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
  gradient: string;
}

export const MOODS: MoodOption[] = [
  {
    id: 'happy',
    name: 'Happy',
    iconName: 'sun',
    description: 'Upbeat, joyful, bright melodies',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-400',
  },
  {
    id: 'calm',
    name: 'Calm',
    iconName: 'wind',
    description: 'Peaceful, ambient, relaxing textures',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-teal-400',
  },
  {
    id: 'energetic',
    name: 'Energetic',
    iconName: 'flame',
    description: 'High tempo, intense beats, driving rhythms',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    id: 'melancholic',
    name: 'Melancholic',
    iconName: 'cloud-rain',
    description: 'Reflective, somber, emotional soundscapes',
    color: '#8b5cf6',
    gradient: 'from-purple-600 to-indigo-500',
  },
  {
    id: 'focused',
    name: 'Focused',
    iconName: 'brain',
    description: 'Deep work, study, distraction-free flow',
    color: '#3b82f6',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    iconName: 'sparkles',
    description: 'Atmospheric synth, floating, ethereal',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-400',
  },
  {
    id: 'nostalgic',
    name: 'Nostalgic',
    iconName: 'radio',
    description: 'Retro synthwave, vintage 80s/90s vibes',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    iconName: 'heart',
    description: 'Warm acoustic, tender harmonies',
    color: '#f43f5e',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'motivated',
    name: 'Motivated',
    iconName: 'zap',
    description: 'Inspiring build-ups, workout fuel',
    color: '#eab308',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'sad',
    name: 'Sad',
    iconName: 'cloud-drizzle',
    description: 'Subdued piano, soft Strings, quiet moments',
    color: '#64748b',
    gradient: 'from-slate-600 to-slate-800',
  },
];

export const GENRES = [
  'Ambient',
  'Lofi Beat',
  'Synthwave',
  'Electronic',
  'Indie Chill',
  'Orchestral',
  'Deep Focus',
  'Neo-Classical',
  'Dream Pop',
  'Chillhop',
  'Cyberpunk',
  'Acoustic',
];
