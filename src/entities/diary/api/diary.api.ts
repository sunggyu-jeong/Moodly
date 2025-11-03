import { formatDate, now } from '@/shared';
import { appApi } from '@/shared/api/AppApi';
import { getUserId } from '@/shared/lib/user.util';

import { byIdTag, fromRow, toInsertRow, toUpdateRow } from '../lib/diary.mapper';
import type { CreateDiaryInput, DbDiaryRow, Diary, UpdateDiaryInput } from '../model/diary.types';
import { VersionPolicy, AppPlatform } from '@/entities/app/model/types';
import { Platform } from 'react-native';
import type { SupabaseClient } from '@supabase/supabase-js';

type DiaryDateRangeQuery = { start: string; end: string };

type WeeklySummaryResult = {
  summary: string;
  emotion_distribution: {
    joy: number;
    sadness: number;
    depression: number;
    anxiety: number;
    anger: number;
  };
  weekly_keywords: string[];
  core_inner_keywords: string[];
  self_reflection_questions: string[];
  message_from_moodly: string;
};

type WeeklySummaryPayload = {
  model: 'gemini-2.5-flash' | 'gemini-2.5-flash-lite';
  temperature: number;
  max_tokens: number;
  response_mime_type: 'application/json';
  response_schema: unknown;
  safety_settings: unknown[];
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
};

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
          ? [...result.map(byIdTag), { type: 'Diary', id: 'LIST' }]
          : [{ type: 'Diary', id: 'LIST' }],
    }),

    requestAIWeeklySummary: build.mutation<WeeklySummaryResult, WeeklySummaryPayload>({
      query: payload => async (client: SupabaseClient) => {
        const { data, error } = await client.functions.invoke('ai-proxy', {
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        });
        if (error) return { data: null, error };
        const raw = typeof data === 'string' ? JSON.parse(data) : data;

        return { data: raw, error: null };
      },
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
      invalidatesTags: (_res, _err) => [
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
  useRequestAIWeeklySummaryMutation,
} = diaryApi;
