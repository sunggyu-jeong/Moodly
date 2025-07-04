import Realm from 'realm';

import { EmotionDiary, EmotionDiaryDTO } from '@entities/diary';
import { isNotEmpty } from '@shared/lib';

import { EmotionDiaryToDTO } from './EmotionDiaryMapper';

export function selectDiaryCountRealm(realm: Realm): number {
  const results = realm.objects<EmotionDiary>('EmotionDiary').length;
  return results;
}

export function hasDiaryForDayRealm(realm: Realm, recordDate: Date): boolean {
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth();
  const day = recordDate.getDate();

  const startOfDay = new Date(year, month, day, 0, 0, 0);
  const endOfDay = new Date(year, month, day + 1, 0, 0, 0);

  const results = realm
    .objects<EmotionDiary>('EmotionDiary')
    .filtered('record_date >= $0 AND record_date < $1', startOfDay, endOfDay);
  return results.length > 0;
}

export function selectDiaryByMonthRealm(realm: Realm, recordDate: Date): EmotionDiaryDTO[] {
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth();

  const startDate = new Date(year, month, 1, 0, 0, 0);
  const endDate = new Date(year, month + 1, 1, 0, 0, 0);

  const raw = realm
    .objects<EmotionDiary>('EmotionDiary')
    .filtered('record_date >= $0 AND record_date < $1', startDate, endDate)
    .map(el => EmotionDiaryToDTO(el));

  return [...raw];
}

export function selectDiaryByIdRealm(realm: Realm, emotionId: number): EmotionDiaryDTO | null {
  const raw = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
  return isNotEmpty(raw) ? EmotionDiaryToDTO(raw) : null;
}

export function createDiaryRealm(realm: Realm, data: EmotionDiaryDTO): number {
  const maxId = realm.objects('EmotionDiary').max('emotion_id');
  const nextId = (typeof maxId === 'number' ? maxId : 0) + 1;
  realm.write(() => {
    realm.create<EmotionDiary>('EmotionDiary', {
      emotion_id: nextId,
      icon_id: data.iconId,
      record_date: new Date(),
      description: data.description,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });
  return nextId;
}

export function updateDiaryRealm(
  realm: Realm,
  emotionId: number,
  updates: Partial<EmotionDiaryDTO>
): number {
  realm.write(() => {
    const target = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);

    if (isNotEmpty(target)) {
      const fieldMap: Record<string, string> = {
        emotionId: 'emotion_id',
        iconId: 'icon_id',
        recordDate: 'record_date',
        description: 'description',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      };
      Object.entries(updates).forEach(([key, value]) => {
        const realmKey = fieldMap[key];
        if (realmKey && value !== undefined) {
          (target as EmotionDiary & Record<string, unknown>)[realmKey] = value;
        }
      });
      target.updated_at = new Date();
    }
  });
  return emotionId;
}

export function deleteDiaryRealm(realm: Realm, emotionId: number): void | Error {
  realm.write(() => {
    const target = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    if (isNotEmpty(target)) {
      realm.delete(target);
    }
  });
}
