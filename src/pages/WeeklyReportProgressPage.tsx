import { useGetWeeklyProgressQuery } from '@/entities/ai-report/api/aiReport.api';
import { WeeklyReportProgress } from '@/features/ai-report/ui/WeeklyReportProgress';
import { goBack } from '@/shared/lib/navigation.util';

const WeeklyReportProgressPage = () => {
  const { data } = useGetWeeklyProgressQuery();

  const totalDays = data?.totalDays ?? 7;
  const doneDays = data?.doneDays ?? 1;
  const isFirst = data?.isFirst ?? doneDays === 1;
  const remainDays = Math.max(0, totalDays - doneDays);

  return (
    <WeeklyReportProgress
      isFirst={isFirst}
      totalDays={totalDays}
      doneDays={doneDays}
      remainDays={remainDays}
      onConfirm={goBack}
    />
  );
};

export default WeeklyReportProgressPage;
