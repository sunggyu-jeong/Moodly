import Realm from 'realm';
import { EmotionDiary, EmotionDiaryDTO } from "../scheme";
import { isNotEmpty } from "../utils";

export function selectDiaryCount(realm: Realm): number {
  const results = realm
      .objects<EmotionDiary>("EmotionDiary")
      .length
  return results
}

export function hasDiaryForDay(realm: Realm, recordDate: Date): boolean {
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth();
  const day = recordDate.getDate();

  const startOfDay = new Date(year, month, day, 0, 0, 0);
  const endOfDay = new Date(year, month, day + 1, 0, 0, 0);

  const results = realm
    .objects<EmotionDiary>("EmotionDiary")
    .filtered("record_date >= $0 AND record_date < $1", startOfDay, endOfDay);
  return [...results].length > 0;
}

export function selectDiaryByMonth(realm: Realm, recordDate: Date): EmotionDiary[] {
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth(); 
  
  const startDate = new Date(year, month, 1, 0, 0, 0);  
  const endDate = new Date(year, month + 1, 1, 0, 0, 0);

  const results = realm
    .objects<EmotionDiary>("EmotionDiary")
    .filtered("record_date >= $0 AND record_date < $1", startDate, endDate);

  return [...results];
}

export function selectDiaryById(realm: Realm, emotionId: number): EmotionDiary | null {
  return realm.objectForPrimaryKey<EmotionDiary>("EmotionDiary", emotionId) ?? null;
}

export function createDiary(realm: Realm, data: EmotionDiaryDTO): void | Error {
  try {
    const maxId = realm.objects('EmotionDiary').max('emotion_id');
    const nextId = (typeof maxId === 'number' ? maxId : 0) + 1;
    realm.write(() => {
      const newDiary = realm.create<EmotionDiary>("EmotionDiary", {
        emotion_id: nextId,                
        icon_id: data.iconId,               
        record_date: new Date(),
        description: data.description,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log("다이어리 생성 완료:", newDiary);
    });
  } catch(error) {
    console.error("Error creating diary:", error);
    throw new Error("감정기록을 추가하는 도중 오류가 발생했습니다.");
  }
}

export function updateDiary(realm: Realm, emotionId: number, updates: Partial<EmotionDiaryDTO>): void | Error {
  try {
    realm.write(() => {
      const target = realm.objectForPrimaryKey<EmotionDiary>("EmotionDiary", emotionId);
        
      if (isNotEmpty(target)) {
        Object.entries(updates).forEach(([key, value]) => {
          (target as any)[key] = value;
        });
        target.updated_at = new Date();
      }      
    });
  } catch(error) {
    throw new Error("감정기록을 수정하는 도중 오류가 발생했습니다.");
  }
}

export function deleteDiary(realm: Realm, emotionId: number): void | Error {
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