import { renderHook } from '@testing-library/react-native';

import { useWeeklyReportStatus } from '@/features/ai-report/hooks/useWeeklyReportStatus';

describe('useWeeklyReportStatus Hook', () => {
  it('기록이 1개일 때 남은 횟수가 3회로 계산되어야 한다', () => {
    const { result } = renderHook(() => useWeeklyReportStatus(1));

    expect(result.current.uiState?.title).toBe('첫 기록 완료!');
    expect(result.current.remainForReport).toBe(3);
    expect(result.current.isGoalReached).toBe(false);
  });

  it('기록이 4개(목표 달성)일 때 달성 상태가 되어야 한다', () => {
    const { result } = renderHook(() => useWeeklyReportStatus(4));

    expect(result.current.uiState?.title).toBe('리포트 조건 달성!');
    expect(result.current.remainForReport).toBe(0);
    expect(result.current.isGoalReached).toBe(true);
  });

  it('기록이 7개(최대치)여도 에러 없이 마지막 설정을 가져와야 한다', () => {
    const { result } = renderHook(() => useWeeklyReportStatus(7));

    expect(result.current.uiState?.title).toBe('이번 주 완주!');
    expect(result.current.isGoalReached).toBe(true);
  });
});
