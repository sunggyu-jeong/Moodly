import { EmotionDiaryDTO, EmotionDiarySupabase } from '@entities/diary';
import { baseApi, fetchWithAuth, wrapQueryFn } from '../base';

import {
  createDiary as createDiaryRealm,
  deleteDiary as deleteDiaryRealm,
  getDiaryCount as getDiaryCountRealm,
  hasDiaryForDay as hasDiaryForDayRealm,
  selectById as selectByIdRealm,
  selectByMonth as selectByMonthRealm,
  updateDiary as updateDiaryRealm,
} from './diaryRealmService';

import {
  createDiary as createDiarySB,
  deleteDiary as deleteDiarySB,
  getDiaryCount as getDiaryCountSB,
  hasDiaryForDay as hasDiaryForDaySB,
  selectById as selectByIdSB,
  selectByMonth as selectByMonthSB,
  updateDiary as updateDiarySB,
} from './diarySupabaseService';

export const diaryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getDiaryCount: builder.query<number, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => getDiaryCountRealm(),
            () => getDiaryCountSB()
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    hasDiaryForDay: builder.query<boolean, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => hasDiaryForDayRealm(),
            () => hasDiaryForDaySB()
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    selectByMonth: builder.query<EmotionDiaryDTO[], { start: string; end: string }>({
      async queryFn({ start, end }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => selectByMonthRealm(start, end),
            () => selectByMonthSB(start, end)
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    selectById: builder.query<EmotionDiaryDTO | null, number>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => selectByIdRealm(_arg),
            () => selectByIdSB(_arg)
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    createDiary: builder.mutation<
      number,
      Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'>
    >({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => createDiaryRealm(_arg),
            () => createDiarySB(_arg)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    updateDiary: builder.mutation<
      number,
      {
        emotionId: number;
        updates: Partial<Omit<EmotionDiarySupabase, 'emotion_id'>>;
      }
    >({
      async queryFn({ emotionId, updates }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => updateDiaryRealm(emotionId, updates),
            () => updateDiarySB(emotionId, updates)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    deleteDiary: builder.mutation<string, number>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => deleteDiaryRealm(_arg),
            () => deleteDiarySB(_arg)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
  }),
});

export const {
  useGetDiaryCountQuery,
  useHasDiaryForDayQuery,
  useSelectByMonthQuery,
  useSelectByIdQuery,
  useCreateDiaryMutation,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} = diaryApi;
