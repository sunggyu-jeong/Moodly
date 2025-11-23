import { StyleSheet, View } from 'react-native';

import { useGetDiaryStreakQuery } from '@/entities/ai-report/api';
import { WeeklyReportProgress } from '@/features/ai-report/ui/WeeklyReportProgress';
import { navigate } from '@/shared/lib/navigation.util';
import { common } from '@/shared/styles/colors';

const WeeklyReportProgressPage = () => {
  const { data } = useGetDiaryStreakQuery();

  const totalDays = 7;
  const doneDays = data?.streakCount ?? 1;
  const isFirst = data?.dates.length === 1;
  const remainDays = Math.max(0, totalDays - doneDays);

  const handleGoDetail = () => {
    navigate('DiaryStack', {
      screen: 'EmotionDetailPage',
      params: { origin: 'DiaryStack' },
    });
  };

  return (
    <>
      <View style={styles.container}>
        <WeeklyReportProgress
          isFirst={isFirst}
          totalDays={totalDays}
          doneDays={doneDays}
          remainDays={remainDays}
          onConfirm={handleGoDetail}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.white,
    flex: 1,
  },
});

export default WeeklyReportProgressPage;
