import { gray } from '@/shared/styles/colors';
import SettingWidgetGroup from '@/widgets/setting/ui/SettingWidgetGroup';
import SettingWidgetHeader from '@/widgets/setting/ui/SettingWidgetHeader';
import SettingWidgetItem from '@/widgets/setting/ui/SettingWidgetItem';
import { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const SettingWidgetSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.inner}>
      <View style={styles.groups}>
        <SettingWidgetHeader />
        <SettingWidgetGroup>
          <SettingWidgetItem withToggle />
        </SettingWidgetGroup>
        <SettingWidgetGroup>
          <SettingWidgetItem />
        </SettingWidgetGroup>
        <SettingWidgetGroup>
          <SettingWidgetItem />
          <SettingWidgetItem />
        </SettingWidgetGroup>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[100],
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  groups: {
    flex: 1,
    gap: 16,
  },
});

export default memo(SettingWidgetSkeleton);
