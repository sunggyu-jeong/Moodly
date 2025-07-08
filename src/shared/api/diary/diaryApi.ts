import { ApiResponse } from '@entities/common/response';
import Realm from 'realm';
import { EmotionDiaryDTO, EmotionDiarySupabase } from '../../../entities/diary';
import { isEmpty } from '../../lib';
import { supabase } from '../../lib/supabase.util';
import { baseApi, wrapQueryFn } from '../base';

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
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => getDiaryCountRealm(realm));
        } else {
          return wrapQueryFn(() => getDiaryCountSB());
        }
      },
      providesTags: ['EmotionDiary'],
    }),
    hasDiaryForDay: builder.query<ApiResponse<boolean>, { realm: Realm }>({
      async queryFn({ realm }, _api, _extraOptions, _baseQuery) {
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => hasDiaryForDayRealm(realm));
        } else {
          return wrapQueryFn(() => hasDiaryForDaySB());
        }
      },
      providesTags: ['EmotionDiary'],
    }),
    selectByMonth: builder.query<ApiResponse<EmotionDiaryDTO[]>, { realm: Realm; month: Date }>({
      async queryFn({ realm, month }, _api, _extraOptions, _baseQuery) {
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => selectByMonthRealm(realm, month));
        } else {
          return wrapQueryFn(() => selectByMonthSB(month));
        }
      },
      providesTags: ['EmotionDiary'],
    }),
    selectById: builder.query<ApiResponse<EmotionDiaryDTO>, { realm: Realm; emotionId: number }>({
      async queryFn({ realm, emotionId }, _api, _extraOptions, _baseQuery) {
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => selectByIdRealm(realm, emotionId));
        } else {
          return wrapQueryFn(() => selectByIdSB(emotionId));
        }
      },
      providesTags: ['EmotionDiary'],
    }),
    createDiary: builder.query<
      ApiResponse<number>,
      { realm: Realm; diary: Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'> }
    >({
      async queryFn({ realm, diary }, _api, _extraOptions, _baseQuery) {
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => createDiaryRealm(realm, diary));
        } else {
          return wrapQueryFn(() => createDiarySB(diary));
        }
      },
      providesTags: ['EmotionDiary'],
    }),
    updateDiary: builder.query<
      ApiResponse<number>,
      {
        realm: Realm;
        emotionId: number;
        updates: Partial<Omit<EmotionDiarySupabase, 'emotion_id'>>;
      }
    >({
      async queryFn({ realm, emotionId, updates }, _api, _extraOptions, _baseQuery) {
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => updateDiaryRealm(realm, emotionId, updates));
        } else {
          return wrapQueryFn(() => updateDiarySB(emotionId, updates));
        }
      },
      providesTags: ['EmotionDiary'],
    }),
    deleteDiary: builder.query<ApiResponse<string>, { realm: Realm; emotionId: number }>({
      async queryFn({ realm, emotionId }, _api, _extraOptions, _baseQuery) {
        const response = await supabase.auth.getSession();
        if (isEmpty(response.data)) {
          return wrapQueryFn(() => deleteDiaryRealm(realm, emotionId));
        } else {
          return wrapQueryFn(() => deleteDiarySB(emotionId));
        }
      },
      providesTags: ['EmotionDiary'],
    }),
  }),
});

export const {
  useGetDiaryCountQuery,
  useHasDiaryForDayQuery,
  useSelectByMonthQuery,
  useSelectByIdQuery,
  useLazyCreateDiaryQuery,
  useLazyUpdateDiaryQuery,
  useLazyDeleteDiaryQuery,
} = diaryApi;
