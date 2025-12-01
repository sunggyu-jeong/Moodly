import { fireEvent, render } from '@testing-library/react-native';

import { WeeklyReportProgress } from '@/features/ai-report/ui/WeeklyReportProgress';

jest.mock('@/shared/assets/images/ai-report', () => ({ AI_ICONS: {} }));
jest.mock('@/shared/assets/images/main', () => ({ MAIN_ICONS: {} }));
jest.mock('@/shared/assets/images/common', () => ({
  COMMON_ICONS: { iconChecked: 'checked-png', iconUnchecked: 'unchecked-png' },
}));
jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    Dimensions: {
      get: jest.fn().mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1 }),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  };
});

describe('<WeeklyReportProgress />', () => {
  const mockConfirm = jest.fn();

  beforeEach(() => {
    mockConfirm.mockClear();
  });

  it('기록 횟수에 따라 타이틀과 남은 횟수가 올바르게 렌더링되어야 한다', () => {
    const { getByText } = render(
      <WeeklyReportProgress
        weeklyCount={1}
        dailyStatus={new Array(7).fill(false)}
        onConfirm={mockConfirm}
      />,
    );

    expect(getByText('첫 기록 완료!')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('목표(4회) 달성 시 남은 횟수 숫자가 보이지 않아야 한다', () => {
    const { getByText, queryByText } = render(
      <WeeklyReportProgress
        weeklyCount={4}
        dailyStatus={new Array(7).fill(false)}
        onConfirm={mockConfirm}
      />,
    );

    expect(getByText('리포트 조건 달성!')).toBeTruthy();
    expect(queryByText('0')).toBeNull();
  });

  it('dailyStatus 배열(일~토)에 맞춰 체크 아이콘이 7개 렌더링되어야 한다', () => {
    const status = [true, false, false, false, false, false, false];

    const { getAllByText } = render(
      <WeeklyReportProgress
        weeklyCount={1}
        dailyStatus={status}
        onConfirm={mockConfirm}
      />,
    );

    const dayNumbers = getAllByText(/^[1-7]$/);
    expect(dayNumbers).toHaveLength(7);
  });

  it('확인 버튼을 누르면 onConfirm 핸들러가 호출되어야 한다', () => {
    const { getByText } = render(
      <WeeklyReportProgress
        weeklyCount={2}
        dailyStatus={[]}
        onConfirm={mockConfirm}
      />,
    );

    const button = getByText('확인');
    fireEvent.press(button);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });
});
