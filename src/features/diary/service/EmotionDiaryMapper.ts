import { EmotionDiary, EmotionDiaryDTO } from '@entities/diary/EmotionDiary.scheme';
import dayjs from 'dayjs';

export function EmotionDiaryToDTO(diary: EmotionDiary): EmotionDiaryDTO {
  return {
    emotionId: diary.emotion_id,
    iconId: diary.icon_id,
    recordDate: dayjs(diary.record_date).toISOString(),
    description: diary.description,
    createdAt: dayjs(diary.created_at).toISOString(),
    updatedAt: dayjs(diary.updated_at).toISOString(),
  };
}
