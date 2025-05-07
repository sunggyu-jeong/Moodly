import { ImageSourcePropType } from 'react-native';

import { EMOTION_ICONS } from '../assets/images/emotion';

export interface EmotionIconData {
  id: number;
  iconBig: ImageSourcePropType;
  iconSelected: ImageSourcePropType;
  iconUnSelected: ImageSourcePropType;
  text: string;
  description: string;
}

export const ICON_DATA: EmotionIconData[] = [
  {
    id: 1,
    iconBig: EMOTION_ICONS.joyBig,
    iconSelected: EMOTION_ICONS.joySmallSelected,
    iconUnSelected: EMOTION_ICONS.joySmallUnSelected,
    text: '기쁨',
    description: '좋은 일이 일어날 것 같아!',
  },
  {
    id: 2,
    iconBig: EMOTION_ICONS.calmBig,
    iconSelected: EMOTION_ICONS.calmSmallSelected,
    iconUnSelected: EMOTION_ICONS.calmSmallUnSelected,
    text: '평온',
    description: '마음이 고요해.',
  },
  {
    id: 3,
    iconBig: EMOTION_ICONS.anxietyBig,
    iconSelected: EMOTION_ICONS.anxietySmallSelected,
    iconUnSelected: EMOTION_ICONS.anxietySmallUnSelected,
    text: '불안',
    description: '나, 잘하고 있는 걸까...?',
  },
  {
    id: 4,
    iconBig: EMOTION_ICONS.sadBig,
    iconSelected: EMOTION_ICONS.sadSmallSelected,
    iconUnSelected: EMOTION_ICONS.sadSmallUnSelected,
    text: '슬픔',
    description: '그낭 눈물이 나..ㅠ',
  },
  {
    id: 5,
    iconBig: EMOTION_ICONS.angryBig,
    iconSelected: EMOTION_ICONS.angrySmallSelected,
    iconUnSelected: EMOTION_ICONS.angrySmallUnSelected,
    text: '화남',
    description: '화가난다 화가나!!',
  },
];
