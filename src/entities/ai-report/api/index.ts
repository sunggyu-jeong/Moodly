import type { SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

import { calcDiaryStreak } from '@/entities/ai-report/lib/calcDiaryStreak';
import type { DiaryStreakInfo } from '@/entities/ai-report/model/types';
import type { AIReportDomain } from '@/features/ai-report/model/domain';
import type {
  WeeklySummaryPayloadDTO,
  WeeklySummaryResultDTO,
} from '@/features/ai-report/model/dto';
import { appApi } from '@/shared/api/appApi';
import { API_CODE } from '@/shared/api/error/apiCode';
import { getUserId } from '@/shared/lib/user.util';

const parseMaybeString = <T>(x: unknown): T => (typeof x === 'string' ? JSON.parse(x) : x) as T;

export const aiReportApi = appApi.injectEndpoints({
  endpoints: build => ({
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

    getAIReportByDateMock: build.query<AIReportDomain, string>({
      queryFn: async dateISO => {
        const data = await (async () => {
          await new Promise(r => setTimeout(r, 400));
          return {
            date: dateISO,
            title: '불안 속에서도, 연결을 원했던 나',
            summary:
              '한 주간 다양한 감정의 흐름을 경험하셨습니다. 남자친구와의 카페 공부를 통해 집중하고 편안함을 느끼며 긍정적인 에너지를 얻으셨던 순간이 있었던 반면, 직장에서는 상급자와의 업무 관련 갈등으로 인해 큰 어려움과 분노를 느끼셨습니다. 상급자의 불합리한 요구와 태도로 인해 자신의 노력이 제대로 인정받지 못하고 부당하게 혼났다는 감정이 당신을 매우 힘들게 했던 것으로 보입니다. 이러한 대조적인 경험들이 한 주간 당신의 내면에서 복합적으로 작용하며 감정의 기복을 만들어냈습니다.',
            emotion_distribution: { joy: 24, sad: 18, calm: 12, anxiety: 34, angry: 12 },
            weekly_keywords: [
              { label: '힘듦', weight: 1 },
              { label: '공부', weight: 0.3 },
              { label: '남자친구', weight: 0.1 },
              { label: '업무갈등', weight: 0.1 },
              { label: '상급자', weight: 0.1 },
            ],
            core_inner_keywords: [
              {
                title: '관계의 안정감',
                message:
                  '남자친구와의 긍정적인 시간은 당신에게 심리적인 안정감과 편안함을 제공하며, 어려운 상황 속에서도 중요한 지지대가 됩니다.',
              },
              {
                title: '업무 관련 좌절감',
                message:
                  '직장에서의 상급자와의 갈등은 업무에 대한 의욕을 저하시키고, 자신의 노력과 능력에 대한 회의감을 불러일으킬 수 있습니다.',
              },
              {
                title: '부당함에 대한 분노',
                message:
                  '상급자의 불합리한 태도와 지시에 대해 느끼는 분노는 당연한 감정이며, 이는 당신의 정당한 경계를 나타냅니다.',
              },
            ],
            self_reflection_questions: [
              '남자친구와의 긍정적인 경험이 이번 주 직장에서의 어려움을 견뎌내는 데 어떤 방식으로 도움이 되었거나, 혹은 어떤 영향을 미쳤다고 생각하시나요?',
              '직장 내 상급자와의 갈등 상황에서 당신이 가장 중요하게 생각하는 가치나 경계는 무엇이며, 이를 어떻게 지켜나갈 수 있을지 함께 탐색해볼 수 있을까요?',
              "이번 주에 느꼈던 '힘듦'이라는 감정이 당신에게 전달하고자 하는 메시지는 무엇이며, 이 감정을 통해 스스로에게 어떤 보살핌을 줄 수 있을까요?",
            ],
            message_from_moodly:
              '한 주간 겪으신 다양한 감정의 파고 속에서도 묵묵히 자신의 자리를 지켜내신 당신의 노고에 깊은 공감을 표합니다. 때로는 예상치 못한 외부의 상황들이 우리를 힘들게 하지만, 그 안에서 자신을 돌아보고 감정을 이해하려는 노력 자체가 큰 의미가 있습니다. 남자친구와의 소중한 시간처럼 당신에게 긍정적인 에너지를 주는 순간들을 더 많이 만들어나가시길 바랍니다. 어려운 상황 속에서도 당신의 감정을 솔직하게 마주하는 용기를 응원하며, 다음 주에는 마음의 평화가 더 많이 찾아오기를 바랍니다.',
          } as AIReportDomain;
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
  useGetDiaryStreakQuery,
  useRequestAIWeeklySummaryMutation,
  useGetWeeklyProgressQuery,
  useGetAIReportByDateMockQuery,
} = aiReportApi;
