import { useMemo } from 'react';

import { REPORT_GOAL_COUNT, WEEKLY_UI_CONFIG } from '@/features/ai-report/model/constants';

export const useWeeklyReportStatus = (weeklyCount: number) => {
  const uiState = useMemo(() => {
    if (weeklyCount === 0) return;
    const configIndex = Math.min(weeklyCount, WEEKLY_UI_CONFIG.length) - 1;
    return WEEKLY_UI_CONFIG[configIndex];
  }, [weeklyCount]);

  const remainForReport = Math.max(0, REPORT_GOAL_COUNT - weeklyCount);
  const isGoalReached = weeklyCount >= REPORT_GOAL_COUNT;

  return {
    uiState,
    remainForReport,
    isGoalReached,
  };
};
