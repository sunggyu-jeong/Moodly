import { appApi } from '@/shared/api/AppApi';
import { formatDate, now } from '@/shared/lib/day.util';
import { getUserId } from '@/shared/lib/user.util';

import { fromRow, toInsertRow, toUpdateRow } from '../model/mapper';
import type {
  CreateDiaryInput,
  DbDiaryRow,
  Diary,
  DiaryDateRangeQuery,
  UpdateDiaryInput,
} from '../model/types';
import { diaryTag } from './tags';

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
            .order('record_date', { ascending: false })
            .returns<DbDiaryRow[]>();

          const { data, error } = await q;
          return { data: data ? data.map(fromRow) : null, error };
        },
      providesTags: result =>
        result && Array.isArray(result)
          ? [...result.map(diaryTag), { type: 'Diary', id: 'LIST' }]
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
      providesTags: [{ type: 'Diary', id: 'COUNT' }],
    }),

    hasDiaryForDay: build.query<boolean, void>({
      query: () => async client => {
        const userId = await getUserId();
        const todayDateString = formatDate(now());

        const q = client
          .from('moodly_diary')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('record_date', todayDateString);
        const { count, error } = await q;
        return { data: ((count ?? 0) > 0) as boolean, error };
      },
      providesTags: [{ type: 'Diary', id: 'HAS_TODAY' }],
    }),

    createDiary: build.mutation<DbDiaryRow, CreateDiaryInput>({
      query: input => async client => {
        const { data, error } = await client
          .from('moodly_diary')
          .insert(toInsertRow(input))
          .select('*')
          .single();

        return { data: data, error };
      },
      invalidatesTags: () => [
        { type: 'Diary', id: 'LIST' },
        { type: 'Diary', id: 'COUNT' },
        { type: 'Diary', id: 'HAS_TODAY' },
      ],
    }),

    updateDiary: build.mutation<DbDiaryRow, UpdateDiaryInput>({
      query: input => async client => {
        const { data, error } = await client
          .from('moodly_diary')
          .update(toUpdateRow(input))
          .eq('emotion_id', input.emotionId)
          .select('*')
          .single();

        return { data: data, error };
      },
      invalidatesTags: res =>
        res ? [{ type: 'Diary', id: res.emotion_id }] : [{ type: 'Diary', id: 'LIST' }],
    }),

    deleteDiary: build.mutation<{ id: string }, { id: string }>({
      query:
        ({ id }) =>
        async client => {
          const { error } = await client.from('moodly_diary').delete().eq('emotion_id', id);
          return {
            data: error ? null : { id },
            error,
            status: (error as { status?: number } | null)?.status,
          };
        },
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Diary', id: arg.id },
        { type: 'Diary', id: 'LIST' },
        { type: 'Diary', id: 'COUNT' },
        { type: 'Diary', id: 'HAS_TODAY' },
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
