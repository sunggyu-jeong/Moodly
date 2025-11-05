import { StyleSheet, View } from 'react-native';

import AppSkeleton from '@/shared/ui/elements/app-skeleton/AppSkeleton';
import SkeletonContainer from '@/shared/ui/elements/skeleton-container/SkeletonContainer';

const HomeDiarySkeleton = () => {
  return (
    <>
      <SkeletonContainer style={styles.StyledContainer}>
        <View style={styles.InnerWrapper}>
          <View style={styles.TitleWrapper}>
            <View style={styles.SubTitleWrapper}>
              <AppSkeleton
                width="70%"
                height={22}
                radius={6}
              />
            </View>
            <AppSkeleton
              width="55%"
              height={22}
              radius={6}
            />
          </View>

          <View style={styles.ImageWrapper}>
            <AppSkeleton
              width={180}
              height={180}
              radius="round"
            />
          </View>

          <View style={styles.ButtonWrapper}>
            <AppSkeleton
              width="100%"
              height={48}
              radius={10}
            />
          </View>
        </View>
      </SkeletonContainer>
    </>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  InnerWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  TitleWrapper: {
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
  },
  SubTitleWrapper: {
    marginBottom: 8,
    alignItems: 'center',
  },
  ImageWrapper: {
    marginVertical: 16,
  },
  ButtonWrapper: {
    width: '100%',
    marginTop: 8,
  },
});

export default HomeDiarySkeleton;
