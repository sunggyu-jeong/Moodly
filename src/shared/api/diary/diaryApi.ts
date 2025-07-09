import { ApiResponse } from '@entities/common/response';
import { EmotionDiaryDTO, EmotionDiarySupabase } from '../../../entities/diary';
import { baseApi, useBackend, wrapQueryFn } from '../base';

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
    getDiaryCount: builder.query<ApiResponse<number>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => getDiaryCountRealm(),
            () => getDiaryCountSB()
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    hasDiaryForDay: builder.query<ApiResponse<boolean>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => hasDiaryForDayRealm(),
            () => hasDiaryForDaySB()
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    selectByMonth: builder.query<ApiResponse<EmotionDiaryDTO[]>, Date>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => selectByMonthRealm(_arg),
            () => selectByMonthSB(_arg)
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    selectById: builder.query<ApiResponse<EmotionDiaryDTO>, number>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => selectByIdRealm(_arg),
            () => selectByIdSB(_arg)
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    createDiary: builder.mutation<
      ApiResponse<number>,
      Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'>
    >({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => createDiaryRealm(_arg),
            () => createDiarySB(_arg)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    updateDiary: builder.mutation<
      ApiResponse<number>,
      {
        emotionId: number;
        updates: Partial<Omit<EmotionDiarySupabase, 'emotion_id'>>;
      }
    >({
      async queryFn({ emotionId, updates }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => updateDiaryRealm(emotionId, updates),
            () => updateDiarySB(emotionId, updates)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    deleteDiary: builder.mutation<ApiResponse<string>, number>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
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
