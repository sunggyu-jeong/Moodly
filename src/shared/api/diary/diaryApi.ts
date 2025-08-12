import { EmotionDiaryDTO, EmotionDiarySupabase } from '@entities/diary';

import { baseApi, fetchWithAuth, wrapQueryFn } from '../base';
import {
  createDiary as createDiaryRealm,
  deleteDiary as deleteDiaryRealm,
  getDiaryCount as getDiaryCountRealm,
  hasDiaryForDay as hasDiaryForDayRealm,
  selectByDay as selectByDayRealm,
  selectByMonth as selectByMonthRealm,
  updateDiary as updateDiaryRealm,
} from './diaryRealmService';
import {
  createDiary as createDiarySB,
  deleteDiary as deleteDiarySB,
  getDiaryCount as getDiaryCountSB,
  hasDiaryForDay as hasDiaryForDaySB,
  selectByDay as selectByDaySB,
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
      keepUnusedDataFor: 60,
      providesTags: (result, _error, { start, end }) => [
        { type: 'EmotionDiary' as const, id: `LIST-${start}-${end}` },
        ...(result ? result.map(d => ({ type: 'EmotionDiary' as const, id: d.emotionId })) : []),
      ],
    }),
    selectByDay: builder.query<EmotionDiaryDTO | null, string>({
      async queryFn(date, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => selectByDayRealm(date),
            () => selectByDaySB(date)
          )
        );
      },
      providesTags: (result, _error, date) =>
        result
          ? [
              { type: 'EmotionDiary' as const, id: `DAY-${date}` },
              { type: 'EmotionDiary' as const, id: result.emotionId },
            ]
          : [{ type: 'EmotionDiary' as const, id: `DAY-${date}` }],
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
        start: string;
        end: string;
        date: string;
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
      invalidatesTags: (_result, _error, { emotionId, start, end, date }) => [
        { type: 'EmotionDiary' as const, id: emotionId },
        { type: 'EmotionDiary' as const, id: `LIST-${start}-${end}` },
        { type: 'EmotionDiary' as const, id: `DAY-${date}` },
      ],
    }),

    deleteDiary: builder.mutation<
      string,
      { emotionId: number; start: string; end: string; date: string }
    >({
      async queryFn({ emotionId }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          fetchWithAuth(
            () => deleteDiaryRealm(emotionId),
            () => deleteDiarySB(emotionId)
          )
        );
      },
      invalidatesTags: (_result, _error, { emotionId, start, end, date }) => ['EmotionDiary'],
    }),
  }),
});

export const {
  useGetDiaryCountQuery,
  useHasDiaryForDayQuery,
  useSelectByMonthQuery,
  useSelectByDayQuery,
  useCreateDiaryMutation,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} = diaryApi;
