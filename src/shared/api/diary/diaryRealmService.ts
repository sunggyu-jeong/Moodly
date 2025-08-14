import { ApiResponse } from '@entities/common/response';
import { EmotionDiary, EmotionDiaryDTO } from '@entities/diary';
import { EmotionDiaryToDTO } from '@features/diary/service/EmotionDiaryMapper';
import { isNotEmpty } from '@shared/lib';
import dayjs from 'dayjs';

import { ApiCode, HttpStatus } from '@/shared/config';
import { getRealm } from '@/shared/lib';

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
    const start = dayjs().startOf('day');
    const end = dayjs().endOf('day');
    const results = realm
      .objects<EmotionDiary>('EmotionDiary')
      .filtered('record_date >= $0 && record_date <= $1', start, end);
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

export async function selectByDay(date: string): Promise<ApiResponse<EmotionDiaryDTO | null>> {
  try {
    const realm = getRealm();
    const start = dayjs(date).startOf('day').toDate();
    const end = dayjs(date).endOf('day').toDate();
    const results = realm
      .objects<EmotionDiary>('EmotionDiary')
      .filtered('record_date >= $0 AND record_date <= $1', start, end);
    return { data: results.length > 0 ? EmotionDiaryToDTO(results[0]) : null };
  } catch (err) {
    throw baseFormatError(err as Error);
  }
}

export async function createDiary(data: EmotionDiaryDTO): Promise<ApiResponse<number>> {
  try {
    const realm = getRealm();
    const maxId = realm.objects('EmotionDiary').max('emotion_id');
    const nextId = (typeof maxId === 'number' ? maxId : 0) + 1;
    const now = dayjs().toDate();

    realm.write(() => {
      realm.create<EmotionDiary>('EmotionDiary', {
        emotion_id: nextId,
        icon_id: data.iconId,
        record_date: data.recordDate ? dayjs(data.recordDate).toDate() : now,
        description: data.description,
        created_at: data.recordDate ? dayjs(data.recordDate).toDate() : now,
        updated_at: data.recordDate ? dayjs(data.recordDate).toDate() : now,
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
      target.updated_at = dayjs().toDate();
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
