import { EmotionDiary, EmotionDiaryDTO } from '@entities/diary';
import { isNotEmpty } from '@shared/lib';

import { ApiResponse } from '@entities/common/response';
import { EmotionDiaryToDTO } from '@features/diary/service/EmotionDiaryMapper';
import dayjs from 'dayjs';
import { ApiCode, HttpStatus } from '../../config/errorCodes';
import { getRealm } from '../../lib/realm-client.util';
import { baseFormatError } from '../base';

export async function getDiaryCount(): Promise<ApiResponse<number>> {
  try {
    const realm = getRealm();
    const count = realm.objects<EmotionDiary>('EmotionDiary').length;
    return { data: count };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function hasDiaryForDay(): Promise<ApiResponse<boolean>> {
  try {
    const realm = getRealm();
    const today = new Date().toISOString().slice(0, 10);
    const results = realm
      .objects<EmotionDiary>('EmotionDiary')
      .filtered('record_date == $0', today);
    return { data: results.length > 0 };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function selectByMonth(
  startDate: string,
  endDate: string
): Promise<ApiResponse<EmotionDiaryDTO[]>> {
  try {
    const realm = getRealm();
    const start = dayjs(startDate).toDate();
    const end = dayjs(endDate).toDate();

    const raw = realm
      .objects<EmotionDiary>('EmotionDiary')
      .filtered('record_date >= $0 AND record_date < $1', start, end)
      .map(el => EmotionDiaryToDTO(el));

    return { data: [...raw] };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function selectById(emotionId: number): Promise<ApiResponse<EmotionDiaryDTO | null>> {
  try {
    const realm = getRealm();
    const raw = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    return { data: isNotEmpty(raw) ? EmotionDiaryToDTO(raw) : null };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function createDiary(data: EmotionDiaryDTO): Promise<ApiResponse<number>> {
  try {
    const realm = getRealm();
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
    throw baseFormatError(err as Error);
  }
}

export async function updateDiary(
  emotionId: number,
  updates: Partial<EmotionDiaryDTO>
): Promise<ApiResponse<number>> {
  try {
    const realm = getRealm();
    const target = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    if (!isNotEmpty(target)) {
      const authErr = baseFormatError(new Error('수정하려는 일기를 찾을 수 없어요.'));
      authErr.status = HttpStatus.NOT_FOUND;
      authErr.code = ApiCode.NOT_FOUND;
      throw authErr;
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
    throw baseFormatError(err as Error);
  }
}

export async function deleteDiary(emotionId: number): Promise<ApiResponse<string>> {
  try {
    const realm = getRealm();
    const target = realm.objectForPrimaryKey<EmotionDiary>('EmotionDiary', emotionId);
    if (!isNotEmpty(target)) {
      const authErr = baseFormatError(new Error('삭제하려는 일기를 찾을 수 없어요.'));
      authErr.status = HttpStatus.NOT_FOUND;
      authErr.code = ApiCode.NOT_FOUND;
      throw authErr;
    }

    realm.write(() => {
      realm.delete(target);
    });

    return { data: ApiCode.SUCCESS };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}
