import Realm from 'realm';

export interface EmotionDiaryDTO {
  emotionId?: number;
  userId?: number;
  iconId?: number;
  recordDate?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class EmotionDiary extends Realm.Object<EmotionDiary> {
  // 감정기록 고유번호(PK)
  emotion_id!: number;
  // 유저 ID
  id!: number;
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
      id: 'int',
      icon_id: 'int',
      record_date: 'date',
      description: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  };

  toDTO(): EmotionDiaryDTO {
    return {
      emotionId: this.emotion_id,
      userId: this.id,
      iconId: this.icon_id,
      recordDate: new Date(this.record_date).toISOString(),
      description: this.description,
      createdAt: new Date(this.created_at).toISOString(),
      updatedAt: new Date(this.updated_at).toISOString(),
    };
  }
}