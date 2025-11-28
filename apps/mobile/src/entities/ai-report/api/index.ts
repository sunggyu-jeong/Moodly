import { getUserId } from '@amplitude/analytics-react-native';
import type { SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

import { calcDiaryStreak } from '@/entities/ai-report/lib/calcDiaryStreak';
import type { DiaryStreakInfo } from '@/entities/ai-report/model/types';
import { setReportDates, setSelectedReport } from '@/features/ai-report/model/aiReportSlice';
import type { AIReportDomain } from '@/features/ai-report/model/domain';
import type {
  WeeklySummaryPayloadDTO,
  WeeklySummaryResultDTO,
} from '@/features/ai-report/model/dto';
import { appApi } from '@/shared/api/appApi';
import { withAuth } from '@/shared/api/authGuard';
import { API_CODE } from '@/shared/api/error/apiCode';
import { supabase } from '@/shared/lib/supabase.util';

const parseMaybeString = <T>(x: unknown): T => (typeof x === 'string' ? JSON.parse(x) : x) as T;

export const aiReportApi = appApi.injectEndpoints({
  endpoints: build => ({
    hasWeeklyReport: build.query<boolean, void>({
      query: () =>
        withAuth(async (client, user) => {
          const { count, error } = await client
            .from('tb_ai_jobs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_report_read', false)
            .limit(1);

          if (error) throw error;
          return (count ?? 0) > 0;
        }),
      providesTags: ['WeeklyReportStatus'],
    }),
    getDiaryStreak: build.query<DiaryStreakInfo, void>({
      query: () => async (client: SupabaseClient) => {
        const from = dayjs(dayjs().format('YYYY-MM-DD')).subtract(30, 'day').format('YYYY-MM-DD');
        const today = dayjs().format('YYYY-MM-DD');
        const userId = await getUserId();
        const { data, error } = await client
          .from('moodly_diary')
          .select('record_date')
          .eq('user_id', userId)
          .gte('record_date', from)
          .lte('record_date', today)
          .order('record_date', { ascending: false });

        if (error) {
          throw error;
        }
        const { streakCount, dates } = calcDiaryStreak(
          today,
          (data ?? []) as { record_date: string }[],
        );

        const info: DiaryStreakInfo = {
          baseDate: today,
          streakCount,
          dates,
          reached7: streakCount >= 7,
        };

        return info;
      },
    }),

    requestAIWeeklySummary: build.mutation<WeeklySummaryResultDTO, WeeklySummaryPayloadDTO>({
      query: payload => async (client: SupabaseClient) => {
        const { data, error } = await client.functions.invoke('ai-proxy', {
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        });

        if (error) {
          const status = (error as any)?.status as number | undefined;
          const code =
            status === 429
              ? API_CODE.RATE_LIMIT
              : status && status >= 500
                ? API_CODE.SERVER_ERROR
                : API_CODE.UNKNOWN;

          throw {
            ...error,
            code,
            status,
            message: (error as any)?.message ?? 'AI 요약 요청에 실패했습니다.',
          };
        }

        return parseMaybeString<WeeklySummaryResultDTO>(data);
      },
      invalidatesTags: ['WeeklyProgress'],
    }),

    getAIReport: build.query<AIReportDomain[], void>({
      queryFn: async () => {
        try {
          const runProtectedLogic = withAuth(async (client, user) => {
            const { data: reports, error } = await client
              .from('tb_ai_jobs')
              .select('id, status, result_data, created_at')
              .eq('user_id', user.id)
              .eq('status', 'completed')
              .not('result_data', 'is', null)
              .order('created_at', { ascending: false });

            if (error) throw error;

            if (!reports) return [];

            return reports.map(report => {
              const rawData = report.result_data as any;

              return {
                id: report.id,
                date: report.created_at.split('T')[0],
                title: rawData.weekly_keywords?.[0]?.label
                  ? `${rawData.weekly_keywords[0].label}의 한 주`
                  : '나의 주간 리포트',
                summary: rawData.summary || '',
                emotion_distribution: rawData.emotion_distribution || {
                  joy: 0,
                  sad: 0,
                  calm: 0,
                  angry: 0,
                  anxiety: 0,
                },
                weekly_keywords: Array.isArray(rawData.weekly_keywords)
                  ? rawData.weekly_keywords
                  : [],
                core_inner_keywords: Array.isArray(rawData.core_inner_keywords)
                  ? rawData.core_inner_keywords
                  : [],
                self_reflection_questions: Array.isArray(rawData.self_reflection_questions)
                  ? rawData.self_reflection_questions
                  : [],
                message_from_moodly: rawData.message_from_moodly || '',
              } as AIReportDomain;
            });
          });
          const data = await runProtectedLogic(supabase);

          console.log('API 반환 데이터 타입:', Array.isArray(data) ? 'Array' : typeof data);

          return { data };
        } catch (e: any) {
          console.error('Query Error:', e);
          return {
            error: {
              code: '500',
              message: e.message || String(e),
              status: 500,
              data: e.message,
            } as any,
          };
        }
      },

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (Array.isArray(data) && data.length > 0) {
            const dates = Array.from(new Set(data.map(item => item.date)));
            dispatch(setReportDates(dates));
            dispatch(setSelectedReport(data[0]));
          } else {
            dispatch(setReportDates([]));
            dispatch(setSelectedReport(null));
          }
        } catch (err) {
          console.error('Slice 업데이트 실패:', err);
        }
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs}`,
      keepUnusedDataFor: 600,
    }),
  }),
  overrideExisting: true,
});

export const {
  useHasWeeklyReportQuery,
  useGetDiaryStreakQuery,
  useRequestAIWeeklySummaryMutation,
  useGetAIReportQuery,
} = aiReportApi;
