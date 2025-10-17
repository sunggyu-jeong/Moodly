import { formatDate, now } from '@/shared';

import type { CreateDiaryInput, DbDiaryRow, Diary, UpdateDiaryInput } from '../model/diary.types';

// DB row -> Domain
export const fromRow = (row?: DbDiaryRow | null): Diary => ({
  emotionId: row?.emotion_id ?? 0,
  iconId: row?.icon_id ?? 0,
  userId: row?.user_id ?? '',
  recordDate: row?.record_date ?? '',
  description: row?.description ?? '',
  createdAt: row?.created_at ?? '',
  updatedAt: row?.updated_at ?? '',
});

// Domain -> DB (INSERT)
export const toInsertRow = (input: CreateDiaryInput) => ({
  user_id: input.userId,
  icon_id: input.iconId ?? null,
  record_date: formatDate(now(input.recordDate)),
  description: input.description ?? null,
  created_at: formatDate(now()),
  updated_at: formatDate(now()),
});

// Domain -> DB (UPDATE)
export const toUpdateRow = (input: UpdateDiaryInput) => ({
  icon_id: input.iconId ?? undefined,
  description: input.description ?? undefined,
  updated_at: formatDate(now()),
});

export const byIdTag = (d: Diary) => ({ type: 'Diary' as const, id: d.emotionId });
