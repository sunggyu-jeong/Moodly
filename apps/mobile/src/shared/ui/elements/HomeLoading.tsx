import { StyleSheet, View } from 'react-native';

import HomeDiaryCountSkeleton from '@/features/home/ui/HomeDiaryCountSkeleton';
import HomeDiarySkeleton from '@/features/home/ui/HomeDiarySkeleton';

const HomeLoading = () => (
  <View style={styles.container}>
    <HomeDiaryCountSkeleton />
    <HomeDiarySkeleton />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HomeLoading;
