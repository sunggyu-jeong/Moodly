import Realm from 'realm';

import { EmotionDiary, EmotionDiaryDTO } from '@entities/diary';
import { isNotEmpty } from '@shared/lib';

import { ApiResponse } from '@entities/common/response';
import { EmotionDiaryToDTO } from '@features/diary/service/EmotionDiaryMapper';
import { ApiCode } from '../../config/errorCodes';
import { baseFormatError } from '../base';

export async function getDiaryCount(realm: Realm): Promise<ApiResponse<number>> {
  try {
    const count = realm.objects<EmotionDiary>('EmotionDiary').length;
    return { data: count };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}

export async function hasDiaryForDay(realm: Realm): Promise<ApiResponse<boolean>> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const results = realm
      .objects<EmotionDiary>('EmotionDiary')
      .filtered('record_date == $0', today);
    return { data: results.length > 0 };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}

export async function selectByMonth(
  realm: Realm,
  recordDate: Date
): Promise<ApiResponse<EmotionDiaryDTO[]>> {
  try {
    const year = recordDate.getFullYear();
    const month = recordDate.getMonth();
    const startDate = new Date(year, month, 1, 0, 0, 0);
    const endDate = new Date(year, month + 1, 1, 0, 0, 0);

    const raw = realm
      .objects<EmotionDiary>('EmotionDiary')
      .filtered('record_date >= $0 AND record_date < $1', startDate, endDate)
      .map(el => EmotionDiaryToDTO(el));

    return { data: [...raw] };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}

export async function selectById(
  realm: Realm,
  emotionId: number
): Promise<ApiResponse<EmotionDiaryDTO>> {
  try {
    const raw = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    return {
      data: isNotEmpty(raw) ? EmotionDiaryToDTO(raw) : null,
    };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}

export async function createDiary(
  realm: Realm,
  data: EmotionDiaryDTO
): Promise<ApiResponse<number>> {
  try {
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

    return { data: nextId };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}

export async function updateDiary(
  realm: Realm,
  emotionId: number,
  updates: Partial<EmotionDiaryDTO>
): Promise<ApiResponse<number>> {
  try {
    const target = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    if (!isNotEmpty(target)) {
      throw new Error('수정할 일기를 찾을 수 없습니다.');
    }

    realm.write(() => {
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
    });

    return { data: emotionId };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}

export async function deleteDiary(realm: Realm, emotionId: number): Promise<ApiResponse<string>> {
  try {
    const target = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    if (!isNotEmpty(target)) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    realm.write(() => {
      realm.delete(target);
    });

    return { data: ApiCode.SUCCESS };
  } catch (err) {
    return { error: baseFormatError(err as Error) };
  }
}
