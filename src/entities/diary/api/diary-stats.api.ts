import { now } from '@shared';
import { appApi } from '@shared/api/AppApi';

import type { MonthlyQuery } from '../model/diary.types';

export type DiaryCountByIcon = { icon_id: string; count: number };

export const diaryStatsApi = appApi.injectEndpoints({
  endpoints: build => ({
    listDiaryCountByIcon: build.query<DiaryCountByIcon[], MonthlyQuery>({
      query:
        ({ userId, month }) =>
        async client => {
          const start = now(`${month}-01`).startOf('month').format('YYYY-MM-DD');
          const end = now(`${month}-01`).endOf('month').format('YYYY-MM-DD');

          const { data, error } = await client
            .from('moodly_diary')
            .select('icon_id, count:icon_id')
            .eq('user_id', userId)
            .gte('record_date', start)
            .lte('record_date', end)
            .order('cnt', { ascending: false });
          return { data: (data ?? null) as DiaryCountByIcon[] | null, error };
        },
      providesTags: _res => [{ type: 'Diary', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListDiaryCountByIconQuery } = diaryStatsApi;
