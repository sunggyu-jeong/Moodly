import { EmotionDiary, EmotionDiaryDTO } from '@entities/diary/EmotionDiary.scheme';
import dayjs from 'dayjs';

export function EmotionDiaryToDTO(diary: EmotionDiary): EmotionDiaryDTO {
  return {
    emotionId: diary.emotion_id,
    iconId: diary.icon_id,
    recordDate: dayjs(diary.record_date).toString(),
    description: diary.description,
    createdAt: dayjs(diary.created_at).toString(),
    updatedAt: dayjs(diary.updated_at).toString(),
  };
}
