import { AppSkeleton, common, SkeletonContainer } from '@/shared';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const SettingWidgetHeader = () => (
  <SkeletonContainer style={styles.container}>
    <View style={styles.inner}>
      <View style={styles.textBlock}>
        <View style={styles.title}>
          <AppSkeleton
            width={140}
            height={18}
            radius={4}
          />
        </View>
        <AppSkeleton
          width={200}
          height={14}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: common.white,
    borderRadius: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  textBlock: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    marginBottom: 8,
  },
});

export default memo(SettingWidgetHeader);
