
import type { Diary } from '../model/types';

export const DIARY_LIST_TAG = { type: 'Diary' as const, id: 'LIST' as const };

export function diaryTag(d: Pick<Diary, 'emotionId' | 'userId' | 'recordDate'>) {
  const stableId = d.emotionId ?? `${d.userId}:${d.recordDate}`;
  return { type: 'Diary' as const, id: stableId };
}
