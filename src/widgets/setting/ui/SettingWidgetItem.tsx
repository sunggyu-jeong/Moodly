import { AppSkeleton } from '@/shared';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const SettingWidgetItem = ({ withToggle }: { withToggle?: boolean }) => (
  <View style={styles.wrapper}>
    <View style={styles.inner}>
      <AppSkeleton
        width={120}
        height={16}
        radius={4}
      />
      {withToggle ? (
        <AppSkeleton
          width={52}
          height={30}
          radius={15}
        />
      ) : (
        <AppSkeleton
          width={24}
          height={24}
          radius="round"
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
});

export default memo(SettingWidgetItem);
