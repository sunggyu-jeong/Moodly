import { Emotions } from '@/features/emotion/ui/EmotionIcon';

import { EMOTION_ICONS } from '../assets/images/emotion';

export const ICON_DATA: Emotions[] = [
  {
    id: 1,
    icon: EMOTION_ICONS.joyBig,
    text: '기쁨',
    description: '좋은 일이 일어날 것 같아!',
  },
  {
    id: 2,
    icon: EMOTION_ICONS.calmBig,
    text: '평온',
    description: '마음이 고요해.',
  },
  {
    id: 3,
    icon: EMOTION_ICONS.anxietyBig,
    text: '불안',
    description: '나, 잘하고 있는 걸까...?',
  },
  {
    id: 4,
    icon: EMOTION_ICONS.sadBig,
    text: '슬픔',
    description: '그낭 눈물이 나..ㅠ',
  },
  {
    id: 5,
    icon: EMOTION_ICONS.angryBig,
    text: '화남',
    description: '화가난다 화가나!!',
  },
];
