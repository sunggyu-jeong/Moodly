import { EmotionDiaryDTO } from '@/entities/diary';
import type Realm from 'realm';

export interface DiaryDataSource {
  searchCount(realm?: Realm, recordDate?: Date): Promise<number>;
  searchById(realm: Realm, emotionId: number): Promise<EmotionDiaryDTO | null>;
  searchByMonth(realm: Realm, recordDate: Date): Promise<EmotionDiaryDTO[]>;
  add(realm: Realm, data: EmotionDiaryDTO): Promise<number>;
  modify(realm: Realm, emotionId: number, data: EmotionDiaryDTO): Promise<number>;
  remove(realm: Realm, emotionId: number): Promise<void>;
  isExist(realm: Realm, recordDate: Date): Promise<boolean>;
}
