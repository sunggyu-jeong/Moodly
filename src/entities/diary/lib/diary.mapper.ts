import { toDateOnly } from '@shared/lib/day.util';
import dayjs from 'dayjs';

import type { CreateDiaryInput, DbDiaryRow, Diary, UpdateDiaryInput } from '../model/diary.types';

// DB row -> Domain
export const fromRow = (row: DbDiaryRow): Diary => ({
  emotionId: row.emotion_id,
  iconId: row.icon_id,
  userId: row.user_id,
  recordDate: row.record_date,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Domain -> DB (INSERT)
export const toInsertRow = (input: CreateDiaryInput) => ({
  user_id: input.userId,
  icon_id: input.iconId ?? null,
  record_date: toDateOnly(input.recordDate),
  description: input.description ?? null,
  created_at: dayjs().toISOString(),
  updated_at: dayjs().toISOString(),
});

// Domain -> DB (UPDATE)
export const toUpdateRow = (input: UpdateDiaryInput) => ({
  icon_id: input.iconId ?? undefined,
  description: input.description ?? undefined,
  updated_at: dayjs().toISOString(),
});

export const byIdTag = (d: Diary) => ({ type: 'Diary' as const, id: d.emotionId });
