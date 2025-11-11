// src/features/diary/api/diaryApi.ts
import { appApi } from '@/shared/api/AppApi';
import { API_CODE, AppCode } from '@/shared/api/error/apiCode';
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
          if (!userId) {
            throw {
              code: API_CODE.UNAUTHORIZED,
              message: '로그인이 필요합니다.',
              status: 401,
              meta: { appCode: AppCode.NOT_LOGIN },
            };
          }
          const { data, error } = await client
            .from('moodly_diary')
            .select('*')
            .gte('record_date', start)
            .lt('record_date', end)
            .eq('user_id', userId)
            .order('record_date', { ascending: false })
            .returns<DbDiaryRow[]>();
          if (error) throw error;
          return (data ?? []).map(fromRow);
        },
      providesTags: result =>
        result && Array.isArray(result)
          ? [...result.map(diaryTag), { type: 'Diary', id: 'LIST' }]
          : [{ type: 'Diary', id: 'LIST' }],
    }),

    getDiaryCount: build.query<number, void>({
      query: () => async client => {
        const userId = await getUserId();
        if (!userId) {
          throw {
            code: API_CODE.UNAUTHORIZED,
            message: '로그인이 필요합니다.',
            status: 401,
            meta: { appCode: AppCode.NOT_LOGIN },
          };
        }
        const { count, error } = await client
          .from('moodly_diary')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        if (error) throw error;
        return (count ?? 0) as number;
      },
      providesTags: [{ type: 'Diary', id: 'COUNT' }],
    }),

    hasDiaryForDay: build.query<boolean, void>({
      query: () => async client => {
        const userId = await getUserId();
        if (!userId) {
          throw {
            code: API_CODE.UNAUTHORIZED,
            message: '로그인이 필요합니다.',
            status: 401,
            meta: { appCode: AppCode.NOT_LOGIN },
          };
        }
        const today = formatDate(now());
        const { count, error } = await client
          .from('moodly_diary')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('record_date', today);
        if (error) throw error;
        return ((count ?? 0) > 0) as boolean;
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
  useGetDiariesByRangeQuery,
  useGetDiaryCountQuery,
  useHasDiaryForDayQuery,
  useCreateDiaryMutation,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} = diaryApi;
