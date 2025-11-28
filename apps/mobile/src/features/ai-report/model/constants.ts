import { AI_ICONS } from '@/shared/assets/images/ai-report';

export const REPORT_GOAL_COUNT = 4;

export const WEEKLY_UI_CONFIG = [
  {
    count: 1,
    title: '첫 기록 완료!',
    message: '앞으로 ',
    subMessage: '번 더 기록하면 리포트를 받을 수 있어요!',
    icon: AI_ICONS.iconAvatarWrite,
  },
  {
    count: 2,
    title: '오늘도 기록 완료!',
    message: '리포트까지 ',
    subMessage: '번 남았어요!',
    icon: AI_ICONS.iconReportWriting,
  },
  {
    count: 3,
    title: '오늘도 기록 완료!',
    message: '리포트까지 ',
    subMessage: '번 남았어요!',
    icon: AI_ICONS.iconReportWriting1,
  },
  {
    count: 4,
    title: '리포트 조건 달성!',
    message: '이번 주 리포트를 받을 수 있어요!',
    subMessage: '',
    icon: AI_ICONS.iconReportSuccess,
  },
  {
    count: 5,
    title: '오늘도 기록 완료!',
    message: '이번 주 리포트가 더 풍부해지고 있어요!',
    subMessage: '',
    icon: AI_ICONS.iconReportComplete1,
  },
  {
    count: 6,
    title: '오늘도 기록 완료!',
    message: '이번 주 리포트가 더 풍부해지고 있어요!',
    subMessage: '',
    icon: AI_ICONS.iconReportComplete2,
  },
  {
    count: 7,
    title: '이번 주 완주!',
    message: '이번 주 감정 흐름을 리포트에서 확인해보세요!',
    subMessage: '',
    icon: AI_ICONS.iconReportComplete3,
  },
];
