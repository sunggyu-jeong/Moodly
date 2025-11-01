import { COLOR_MODE } from '@/shared/constants';
import { Skeleton } from 'moti/skeleton';
import { StyleSheet, View } from 'react-native';

const DayCellSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Skeleton
          width={40}
          height={40}
          radius="round"
          colorMode={COLOR_MODE}
        />
      </View>
      <View style={styles.textBox}>
        <Skeleton
          width="50%"
          height={12}
          radius={4}
          colorMode={COLOR_MODE}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    padding: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
  },
  textBox: {
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 8,
  },
});

export default DayCellSkeleton;
