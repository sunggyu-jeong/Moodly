import { StyleSheet, View } from 'react-native';

import { useGetDiaryStreakQuery } from '@/entities/ai-report/api';
import { WeeklyReportProgress } from '@/features/ai-report/ui/WeeklyReportProgress';
import { navigate } from '@/shared/lib/navigation.util';
import { common } from '@/shared/styles/colors';

const WeeklyReportProgressPage = () => {
  const { data } = useGetDiaryStreakQuery();

  const weeklyCount = data?.weeklyCount ?? 0;
  const dailyStatus = data?.dailyStatus ?? new Array(7).fill(false);

  const handleGoDetail = () => {
    navigate('DiaryStack', {
      screen: 'EmotionDetailPage',
      params: { origin: 'DiaryStack' },
    });
  };

  return (
    <View style={styles.container}>
      <WeeklyReportProgress
        weeklyCount={weeklyCount}
        dailyStatus={dailyStatus}
        onConfirm={handleGoDetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.white,
    flex: 1,
  },
});

export default WeeklyReportProgressPage;
