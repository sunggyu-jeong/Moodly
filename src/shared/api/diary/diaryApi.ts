import { ApiResponse } from '@entities/common/response';
import { EmotionDiaryDTO, EmotionDiarySupabase } from '../../../entities/diary';
import { baseApi, wrapQueryFn } from '../base';
import {
  createDiary,
  deleteDiary,
  getDiaryCount,
  hasDiaryForDay,
  selectById,
  selectByMonth,
  updateDiary,
} from './diaryService';

export const diaryApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: builder => ({
    getDiaryCount: builder.query<ApiResponse<number>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => getDiaryCount());
      },
      providesTags: ['EmotionDiary'],
    }),
    hasDiaryForDay: builder.query<ApiResponse<boolean>, void>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => hasDiaryForDay());
      },
      providesTags: ['EmotionDiary'],
    }),
    selectByMonth: builder.query<ApiResponse<EmotionDiaryDTO[]>, Date>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => selectByMonth(_arg));
      },
      providesTags: ['EmotionDiary'],
    }),
    selectById: builder.query<ApiResponse<EmotionDiaryDTO>, number>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => selectById(_arg));
      },
      providesTags: ['EmotionDiary'],
    }),
    createDiary: builder.query<
      ApiResponse<number>,
      Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'>
    >({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => createDiary(_arg));
      },
      providesTags: ['EmotionDiary'],
    }),
    updateDiary: builder.query<
      ApiResponse<number>,
      {
        emotionId: number;
        updates: Partial<Omit<EmotionDiarySupabase, 'emotion_id'>>;
      }
    >({
      async queryFn({ emotionId, updates }, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => updateDiary(emotionId, updates));
      },
      providesTags: ['EmotionDiary'],
    }),
    deleteDiary: builder.query<ApiResponse<string>, number>({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        return wrapQueryFn(() => deleteDiary(_arg));
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
