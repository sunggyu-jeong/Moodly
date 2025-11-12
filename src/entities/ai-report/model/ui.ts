import type { ImageSourcePropType } from 'react-native';

export const UI_EMOTIONS = ['joy', 'sad', 'anxiety', 'angry', 'calm'] as const;
export type UIEmotionKey = (typeof UI_EMOTIONS)[number];

export type EmotionStat = {
  key: UIEmotionKey;
  percent: number;
  icon: ImageSourcePropType;
};

export type EmotionDistribution = Readonly<Record<UIEmotionKey, number>>;
