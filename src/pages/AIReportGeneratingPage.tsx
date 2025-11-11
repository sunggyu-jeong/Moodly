import { useGetUserInfoQuery } from '@/entities/auth/api';
import AIReportGenerating from '@/features/ai-report/ui/AIReportGenerating';

const AIReportGeneratingPage = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  return (
    <AIReportGenerating
      nickname={userInfo?.nickname}
      isLoading={false}
    />
  );
};

export default AIReportGeneratingPage;
