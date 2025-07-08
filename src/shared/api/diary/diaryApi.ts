import { ApiResponse } from '@entities/common/response';
import Realm from 'realm';
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
  overrideExisting: false,
  endpoints: builder => ({
    getDiaryCount: builder.query<ApiResponse<number>, { realm: Realm }>({
      async queryFn({ realm }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => getDiaryCountRealm(realm),
            () => getDiaryCountSB()
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    hasDiaryForDay: builder.query<ApiResponse<boolean>, { realm: Realm }>({
      async queryFn({ realm }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => hasDiaryForDayRealm(realm),
            () => hasDiaryForDaySB()
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    selectByMonth: builder.query<
      ApiResponse<EmotionDiaryDTO[]>,
      { realm: Realm; recordDate: Date }
    >({
      async queryFn({ realm, recordDate }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => selectByMonthRealm(realm, recordDate),
            () => selectByMonthSB(recordDate)
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    selectById: builder.query<ApiResponse<EmotionDiaryDTO>, { realm: Realm; emotionId: number }>({
      async queryFn({ realm, emotionId }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => selectByIdRealm(realm, emotionId),
            () => selectByIdSB(emotionId)
          )
        );
      },
      providesTags: ['EmotionDiary'],
    }),
    createDiary: builder.mutation<
      ApiResponse<number>,
      { realm: Realm; diary: Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'> }
    >({
      async queryFn({ realm, diary }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => createDiaryRealm(realm, diary),
            () => createDiarySB(diary)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    updateDiary: builder.mutation<
      ApiResponse<number>,
      {
        realm: Realm;
        emotionId: number;
        updates: Partial<Omit<EmotionDiarySupabase, 'emotion_id'>>;
      }
    >({
      async queryFn({ realm, emotionId, updates }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => updateDiaryRealm(realm, emotionId, updates),
            () => updateDiarySB(emotionId, updates)
          )
        );
      },
      invalidatesTags: ['EmotionDiary'],
    }),
    deleteDiary: builder.mutation<ApiResponse<string>, { realm: Realm; emotionId: number }>({
      async queryFn({ realm, emotionId }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() =>
          useBackend(
            () => deleteDiaryRealm(realm, emotionId),
            () => deleteDiarySB(emotionId)
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
