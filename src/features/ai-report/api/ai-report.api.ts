import type { SupabaseClient } from '@supabase/supabase-js';

import type { WeeklySummaryPayload, WeeklySummaryResult } from '@/features/ai-report/model/types';
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
  }),
});

export const { useRequestAIWeeklySummaryMutation } = aiReportApi;
