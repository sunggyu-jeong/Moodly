import { toDateOnly } from '@shared/lib/day.util';

import type { CreateDiaryInput, DbDiaryRow, Diary, UpdateDiaryInput } from '../model/diary.types';

// DB row -> Domain
export const fromRow = (row: DbDiaryRow): Diary => ({
  emotionId: row.emotion_id,
  iconId: row.icon_id,
  userId: row.user_id,
  recordDate: toDateOnly(row.record_date),
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Domain -> DB (INSERT)
export const toInsertRow = (input: CreateDiaryInput, nowISO: string) => ({
  user_id: input.userId,
  icon_id: input.iconId ?? null,
  record_date: toDateOnly(input.recordDate),
  description: input.description ?? null,
  created_at: nowISO,
  updated_at: nowISO,
});

// Domain -> DB (UPDATE)
export const toUpdateRow = (input: UpdateDiaryInput, nowISO: string) => ({
  icon_id: input.iconId ?? undefined,
  description: input.description ?? undefined,
  updated_at: nowISO,
});

export const byIdTag = (d: Diary) => ({ type: 'Diary' as const, id: d.emotionId });
