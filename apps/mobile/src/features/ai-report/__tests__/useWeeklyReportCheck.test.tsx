import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { useWeeklyReportCheck } from '@/features/ai-report/hooks/useWeeklyReport';
import { appApi } from '@/shared/api/appApi';

jest.mock('@/shared/lib/supabase.util', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getUser: jest.fn() },
  },
}));

jest.mock('@/shared/lib/day.util', () => ({
  getWeeklyCycleKey: jest.fn(() => '2025-11-23_0900'),
}));

const mockUseGetUserDiaryCountQuery = jest.fn();
const mockUseHasWeeklyReportQuery = jest.fn();

jest.mock('@/entities/ai-report/api/index.ts', () => ({
  useGetUserDiaryCountQuery: (...args: any[]) => mockUseGetUserDiaryCountQuery(...args),
  useHasWeeklyReportQuery: (...args: any[]) => mockUseHasWeeklyReportQuery(...args),
}));

const createTestWrapper = () => {
  const store = configureStore({
    reducer: {
      [appApi.reducerPath]: appApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(appApi.middleware),
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return Wrapper;
};

describe('useWeeklyReportCheck Hook', () => {
  const CURRENT_KEY = '2025-11-23_0900';
  const OLD_KEY = '2025-11-16_0900';

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  it('이번 주 리포트를 이미 확인했다면 API 호출을 차단해야 한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(CURRENT_KEY);

    mockUseGetUserDiaryCountQuery.mockReturnValue({ data: undefined, isLoading: false });
    mockUseHasWeeklyReportQuery.mockReturnValue({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useWeeklyReportCheck(), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isBlocked).toBe(true);
    });

    expect(result.current.hasReport).toBe(false);
  });

  it('다이어리가 0개인 신규 유저라면 리포트 확인을 차단해야 한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    mockUseGetUserDiaryCountQuery.mockReturnValue({ data: 0, isLoading: false });
    mockUseHasWeeklyReportQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
    });

    const { result } = renderHook(() => useWeeklyReportCheck(), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isBlocked).toBe(true);
    });

    expect(result.current.hasReport).toBe(false);
  });

  it('리포트가 존재한다면 hasReport: true를 반환하고 스토리지에 저장해야 한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(OLD_KEY);

    mockUseGetUserDiaryCountQuery.mockReturnValue({ data: 5, isLoading: false });
    mockUseHasWeeklyReportQuery.mockReturnValue({
      data: true,
      isLoading: false,
      isSuccess: true,
    });

    const { result } = renderHook(() => useWeeklyReportCheck(), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isBlocked).toBe(false));

    expect(result.current.hasReport).toBe(true);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'LAST_CHECKED_WEEKLY_REPORT_KEY',
      CURRENT_KEY,
    );
  });

  it('리포트가 아직 준비되지 않았다면 hasReport: false를 반환해야 한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    mockUseGetUserDiaryCountQuery.mockReturnValue({ data: 10, isLoading: false });
    mockUseHasWeeklyReportQuery.mockReturnValue({
      data: false,
      isLoading: false,
      isSuccess: true,
    });

    const { result } = renderHook(() => useWeeklyReportCheck(), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isBlocked).toBe(false));

    expect(result.current.hasReport).toBe(false);

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
