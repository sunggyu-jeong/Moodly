import { EmotionDiaryDTO } from '@entities/diary';
import type Realm from 'realm';

export interface DiaryDataSource {
  searchCount(realm?: Realm): Promise<number>;
  searchById(emotionId: number, realm?: Realm): Promise<EmotionDiaryDTO | null>;
  searchByMonth(recordDate: Date, realm?: Realm): Promise<EmotionDiaryDTO[]>;
  add(data: EmotionDiaryDTO, realm?: Realm): Promise<number>;
  modify(emotionId: number, data: EmotionDiaryDTO, realm?: Realm): Promise<number>;
  remove(emotionId: number, realm?: Realm): Promise<void>;
  isExist(recordDate: Date, realm?: Realm): Promise<boolean>;
}
