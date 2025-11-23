import type { UIEmotionKey } from '@/entities/ai-report/model/ui';
import { EMOTION_ICONS } from '@/shared/assets/images/emotion';

export const EMOTION_ICON_MAP: Record<UIEmotionKey, any> = {
  joy: EMOTION_ICONS.joySmallSelected,
  calm: EMOTION_ICONS.calmSmallSelected,
  sad: EMOTION_ICONS.sadSmallSelected,
  angry: EMOTION_ICONS.angrySmallSelected,
  anxiety: EMOTION_ICONS.anxietySmallSelected,
};

export const EMOTION_LABEL_MAP: Record<UIEmotionKey, string> = {
  joy: '기쁨',
  sad: '슬픔',
  anxiety: '불안',
  angry: '분노',
  calm: '차분',
};
