import { appApi } from '@shared/api/AppApi';
import { nowISOUtc, toKstDate } from '@shared/lib/day.util';
import { getUserId } from '@shared/lib/user.util';
import dayjs from 'dayjs';

import { byIdTag, fromRow } from '../lib/diary.mapper';
import type { CreateDiaryInput, DbDiaryRow, Diary, UpdateDiaryInput } from '../model/diary.types';

type DiaryDateRangeQuery = { start: string; end: string };

export const diaryApi = appApi.injectEndpoints({
  endpoints: build => ({
    getDiariesByRange: build.query<Diary[], DiaryDateRangeQuery>({
      query:
        ({ start, end }) =>
        async client => {
          const userId = await getUserId();
          const q = client
            .from('moodly_diary')
            .select('*')
            .gte('record_date', start)
            .lt('record_date', end)
            .eq('user_id', userId)
            .returns<DbDiaryRow[]>();

          const { data, error } = await q.order('record_date', { ascending: true });

          return { data: data ? data.map(fromRow) : null, error };
        },
      providesTags: result =>
        result && Array.isArray(result)
          ? [...result.map(byIdTag), { type: 'Diary', id: 'LIST' }]
          : [{ type: 'Diary', id: 'LIST' }],
    }),

    getDiaryCount: build.query<number, void>({
      query: () => async client => {
        const userId = await getUserId();

        const q = client
          .from('moodly_diary')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const { count, error } = await q;
        return { data: (count ?? 0) as number, error };
      },
    }),

    hasDiaryForDay: build.query<boolean, void>({
      query: () => async client => {
        const userId = await getUserId();
        const q = client
          .from('moodly_diary')
          .select('*', { count: 'exact', head: true })
          .eq('record_date', dayjs())
          .eq('user_id', userId);

        const { count, error } = await q;
        return { data: ((count ?? 0) > 0) as boolean, error };
      },
    }),

    createDiary: build.mutation<Diary, CreateDiaryInput>({
      query: input => async client => {
        const nowISO = nowISOUtc();
        const payload = {
          user_id: input.userId,
          icon_id: input.iconId,
          record_date: toKstDate(input.recordDate ?? undefined),
          description: input.description ?? null,
          created_at: nowISO,
          updated_at: nowISO,
        };

        const { data, error } = await client
          .from('moodly_diary')
          .insert(payload)
          .select('*')
          .single();

        return { data: fromRow((data ?? null) as Diary | null), error };
      },
      invalidatesTags: (_res, _err) => [{ type: 'Diary', id: 'LIST' }],
    }),

    updateDiary: build.mutation<Diary, UpdateDiaryInput>({
      query: input => async client => {
        const nowISO = nowISOUtc();
        const patch = {
          icon_id: input.iconId,
          description: input.description ?? undefined,
          updated_at: nowISO,
        };

        const { data, error } = await client
          .from('moodly_diary')
          .update(patch)
          .eq('emotion_id', input.emotionId)
          .select('*')
          .single();

        return { data: (data ?? null) as Diary | null, error };
      },
      invalidatesTags: res => (res ? [byIdTag(res)] : [{ type: 'Diary', id: 'LIST' }]),
    }),

    deleteDiary: build.mutation<{ id: string }, { id: string }>({
      query:
        ({ id }) =>
        async client => {
          const { error } = await client.from('moodly_diary').delete().eq('id', id);
          return {
            data: error ? null : { id },
            error,
            status: (error as { status?: number } | null)?.status,
          };
        },
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Diary', id: arg.id },
        { type: 'Diary', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDiariesByRangeQuery,
  useGetDiaryCountQuery,
  useHasDiaryForDayQuery,
  useCreateDiaryMutation,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} = diaryApi;
