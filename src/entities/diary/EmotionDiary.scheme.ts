import Realm from 'realm';

export interface EmotionDiaryDTO {
  emotionId?: number;
  iconId?: number;
  userId?: string;
  recordDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
export function mapSupabaseToDTO(item: EmotionDiarySupabase): EmotionDiaryDTO {
  return {
    emotionId: item.emotion_id,
    iconId: item.icon_id,
    userId: item.user_id,
    recordDate: item.record_date,
    description: item.description,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
export interface EmotionDiarySupabase {
  emotion_id: number; // 감정기록 고유번호 (PK)
  user_id: string; // 유저 ID (uuid, string 타입)
  icon_id: number; // 아이콘 ID
  record_date: string; // 감정 기록일 (ISO date string, e.g. '2025-06-25')
  description: string; // 감정 기록 내용
  created_at: string; // 생성일 (ISO date-time string, e.g. '2025-06-25T15:33:12.111Z')
  updated_at: string; // 변경일 (ISO date-time string)
}

export class EmotionDiary extends Realm.Object<EmotionDiary> {
  // 감정기록 고유번호(PK)
  emotion_id!: number;
  // 유저ID(supabase)
  user_id!: string;
  // 아이콘 ID
  icon_id!: number;
  // 감정 기록일
  record_date!: Date;
  // 감정을 기록한 내용
  description!: string;
  // 기록 생성일
  created_at!: Date;
  // 변경일
  updated_at!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'EmotionDiary',
    primaryKey: 'emotion_id',
    properties: {
      emotion_id: 'int',
      icon_id: 'int',
      userId: 'string',
      record_date: 'date',
      description: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  };
}
