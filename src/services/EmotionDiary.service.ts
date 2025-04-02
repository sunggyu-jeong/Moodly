import Realm from 'realm';
import { EmotionDiary } from "@/scheme/EmotionDiary.scheme";
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, isNotEmpty } from '@/utils';

export type CreateDiaryInput = Omit<EmotionDiary, "emotion_id" | "created_at" | "updated_at">;

export function getDiaryByMonth(realm: Realm, recordDate: Date): EmotionDiary[] {
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth();

  const startDate = new Date(year, month - 1, 1, 0, 0, 0);
  const endDate = new Date(year, month, 1, 0, 0, 0);

  const results = realm
  .objects<EmotionDiary>("EmotionDiary")
  .filtered("created_at >= $0 && created_at < $1", startDate, endDate);

  return [...results];
}

export function getDiaryById(realm: Realm, emotionId: string): EmotionDiary | null {
  return realm.objectForPrimaryKey<EmotionDiary>("EmotionDiary", emotionId) ?? null;
}

export function addDiary(realm: Realm, data: CreateDiaryInput): void | Error {
  try {
    realm.write(() => {
      realm.create<EmotionDiary>("EmotionDiary", {
        ...data,
        emotion_id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
  } catch(error) {
    throw new Error("감정기록을 추가하는 도중 오류가 발생했습니다.");
  }
}

export function updateDiary(realm: Realm, emotionId: string, updates: Partial<EmotionDiary>): void | Error {
  try {
    realm.write(() => {
      const target = realm.objectForPrimaryKey<EmotionDiary>("EmotionDiary", emotionId);
      if (isEmpty(target)) return;
  
      Object.entries(updates).forEach(([key, value]) => {
        (target as any)[key] = value;
      });
      target.updated_at = new Date();
    });
  } catch(error) {
    throw new Error("감정기록을 수정하는 도중 오류가 발생했습니다.");
  }
}

export function deleteDiary(realm: Realm, emotionId: string): void | Error {
  try {
    realm.write(() => {
      const target = realm.objectForPrimaryKey<EmotionDiary>("EmotionDiary", emotionId);
      if (isNotEmpty(target)) {
        realm.delete(target);
      }
    });
  } catch(error) {
    throw new Error("감정기록을 삭제하는 도중 오류가 발생했습니다.");
  }
}