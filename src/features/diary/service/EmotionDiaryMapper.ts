import {
  EmotionDiary,
  EmotionDiaryDTO,
} from '../../../entities/diary/EmotionDiary.scheme';

export function EmotionDiaryToDTO(diary: EmotionDiary): EmotionDiaryDTO {
  return {
    emotionId: diary.emotion_id,
    iconId: diary.icon_id,
    recordDate: diary.record_date.toISOString(),
    description: diary.description,
    createdAt: diary.created_at.toISOString(),
    updatedAt: diary.updated_at.toISOString(),
  };
}
