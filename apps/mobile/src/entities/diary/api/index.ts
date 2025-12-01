import { fromRow, toInsertRow, toUpdateRow } from '@/entities/diary/model/mapper';
import { appApi } from '@/shared/api/appApi';
import { withAuth } from '@/shared/api/authGuard';
import { formatDate, now } from '@/shared/lib/day.util';

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
    getUserDiaryCount: build.query<number, void>({
      query: () =>
        withAuth(async (client, user) => {
          const { count, error } = await client
            .from('moodly_diary')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if (error) throw error;
          return count ?? 0;
        }),
      providesTags: ['DiaryCount'],
    }),
    getDiariesByRange: build.query<Diary[], DiaryDateRangeQuery>({
      query: ({ start, end }) =>
        withAuth(async (client, user) => {
          const { data, error } = await client
            .from('moodly_diary')
            .select('*')
            .gte('record_date', start)
            .lt('record_date', end)
            .eq('user_id', user.id)
            .order('record_date', { ascending: false })
            .returns<DbDiaryRow[]>();
          if (error) throw error;
          return (data ?? []).map(fromRow);
        }),
      providesTags: result =>
        result && Array.isArray(result)
          ? [...result.map(diaryTag), { type: 'Diary', id: 'LIST' }]
          : [{ type: 'Diary', id: 'LIST' }],
    }),

    getDiaryCount: build.query<number, void>({
      query: () =>
        withAuth(async (client, user) => {
          const { count, error } = await client
            .from('moodly_diary')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          if (error) throw error;
          return (count ?? 0) as number;
        }),
      providesTags: [{ type: 'Diary', id: 'COUNT' }],
    }),

    hasDiaryForDay: build.query<boolean, void>({
      query: () =>
        withAuth(async (client, user) => {
          const today = formatDate(now());
          const { count, error } = await client
            .from('moodly_diary')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('record_date', today);
          if (error) throw error;
          return ((count ?? 0) > 0) as boolean;
        }),
      providesTags: [{ type: 'Diary', id: 'HAS_TODAY' }],
    }),

    createDiary: build.mutation<DbDiaryRow, CreateDiaryInput>({
      query: input => async client => {
        const { data, error } = await client
          .from('moodly_diary')
          .insert(toInsertRow(input))
          .select('*')
          .single();
        if (error) throw error;
        return data as DbDiaryRow;
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
        if (error) throw error;
        return data as DbDiaryRow;
      },
      invalidatesTags: res =>
        res ? [{ type: 'Diary', id: res.emotion_id }] : [{ type: 'Diary', id: 'LIST' }],
    }),

    deleteDiary: build.mutation<{ id: string }, { id: string }>({
      query:
        ({ id }) =>
        async client => {
          const { error } = await client.from('moodly_diary').delete().eq('emotion_id', id);
          if (error) throw error;
          return { id };
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
  useGetUserDiaryCountQuery,
  useGetDiariesByRangeQuery,
  useGetDiaryCountQuery,
  useHasDiaryForDayQuery,
  useCreateDiaryMutation,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} = diaryApi;
