import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  AIReport,
  WeeklySummaryPayload,
  WeeklySummaryResult,
} from '@/entities/ai-report/model/types';
import { appApi } from '@/shared/api/AppApi';
import { API_CODE } from '@/shared/api/error/apiCode';

const parseMaybeString = <T>(x: unknown): T => (typeof x === 'string' ? JSON.parse(x) : x) as T;

export const aiReportApi = appApi.injectEndpoints({
  endpoints: build => ({
    requestAIWeeklySummary: build.mutation<WeeklySummaryResult, WeeklySummaryPayload>({
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

        return parseMaybeString<WeeklySummaryResult>(data);
      },
      invalidatesTags: ['WeeklyProgress'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          aiReportApi.util.updateQueryData('getWeeklyProgress', undefined, draft => {
            if (!draft) return;
            draft.doneDays = Math.min(draft.totalDays, (draft.doneDays ?? 0) + 1);
            draft.isFirst = false;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    getWeeklyProgress: build.query<{ totalDays: number; doneDays: number; isFirst: boolean }, void>(
      {
        queryFn: async () => {
          await new Promise(r => setTimeout(r, 400));
          return { data: { totalDays: 7, doneDays: 3, isFirst: false } };
        },
        providesTags: ['WeeklyProgress'],
        keepUnusedDataFor: 300,
      },
    ),

    getAIReportByDateMock: build.query<AIReport, string>({
      queryFn: async dateISO => {
        const data = await (async () => {
          await new Promise(r => setTimeout(r, 400));
          return {
            date: dateISO,
            title: '불안 속에서도, 연결을 원했던 나',
            summary:
              '이번 주는 대인관계에서의 기대와 실제의 간극이 스트레스로 작용했지만, 스스로를 돌보려는 의지가 뚜렷했습니다. 업무 피로 누적과 수면 리듬의 흔들림이 정서적 예민함을 키웠고, 작은 성취 경험이 완충 역할을 했습니다.',
            emotion_distribution: { joy: 24, sadness: 18, depression: 12, anxiety: 34, anger: 12 },
            weekly_keywords: ['연결 욕구', '기대-현실 간극', '수면 리듬', '작은 성취'],
            core_inner_keywords: ['관계 안전감', '자기효능감', '휴식 결핍'],
            self_reflection_questions: [
              '이번 주에 “연결된다”고 느꼈던 순간은 언제였나요? 구체적으로 무엇이 달랐나요?',
              '피로가 누적될 때, 내가 가장 먼저 무너지는 루틴은 무엇인가요?',
              '작은 성취를 매일 1개 만들기 위해 내일 당장 할 수 있는 행동은 무엇인가요?',
            ],
            message_from_moodly:
              '완벽한 안정보다 “충분히 안전한 연결”을 목표로 해보세요. 과도한 기대를 1단계 낮추고, 매일의 작은 회복 루틴(수면 고정 시간, 15분 산책)을 고정해두면 불안의 기복이 줄어듭니다.',
          } as AIReport;
        })();
        return { data };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs}`,
      keepUnusedDataFor: 600,
    }),
  }),
  overrideExisting: true,
});

export const {
  useRequestAIWeeklySummaryMutation,
  useGetWeeklyProgressQuery,
  useGetAIReportByDateMockQuery,
} = aiReportApi;
