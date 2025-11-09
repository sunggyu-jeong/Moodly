import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  WeeklySummaryPayload,
  WeeklySummaryResult,
} from '@/entities/ai-report/model/aiReport.types';
import { appApi } from '@/shared/api/AppApi';

export const aiReportApi = appApi.injectEndpoints({
  endpoints: build => ({
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

    getWeeklyProgress: build.query<{ totalDays: number; doneDays: number; isFirst: boolean }, void>(
      {
        queryFn: async () => {
          // 단순 로딩 시뮬레이션
          await new Promise(r => setTimeout(r, 400));
          return {
            data: {
              totalDays: 7,
              doneDays: 3,
              isFirst: false,
            },
          };
        },
        providesTags: ['WeeklyProgress'],
      },
    ),
  }),
});

export const {
  useRequestAIWeeklySummaryMutation,
  useGetWeeklyProgressQuery, // 추가된 훅
} = aiReportApi;
