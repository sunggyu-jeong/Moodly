import { AppSkeleton, SkeletonContainer } from '@/shared';
import { StyleSheet, View } from 'react-native';

const HomeDiaryCountSkeleton = () => {
  return (
    <SkeletonContainer style={styles.StyledContainer}>
      <View style={styles.LeftWrapper}>
        <AppSkeleton
          width={36}
          height={36}
          radius="round"
        />
        <View style={styles.LeftTextWrapper}>
          <AppSkeleton
            width={120}
            height={18}
            radius={4}
          />
        </View>
      </View>
      <View style={styles.RightWrapper}>
        <View style={styles.RightIconWrapper}>
          <AppSkeleton
            width={28}
            height={24}
            radius={4}
          />
        </View>
        <AppSkeleton
          width={24}
          height={24}
          radius="round"
        />
      </View>
    </SkeletonContainer>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  LeftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  LeftTextWrapper: {
    marginLeft: 13,
  },
  RightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RightIconWrapper: {
    marginRight: 6,
  },
});

export default HomeDiaryCountSkeleton;
