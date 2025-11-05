import { gray } from '@/shared/styles/colors';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { Label } from '@/shared/ui/typography/Label';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import SettingWidgetSkeleton from '@/shared/ui/elements/skeleton/SettingSkeleton';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import packageJson from '../../../../package.json';
import { type SettingItemProps, TEXTS } from '../types';
import SettingList from './SettingList';

interface Props {
  headerItem?: SettingItemProps;
  settingItems?: SettingItemProps[][];
  isLoading: boolean;
}

const SettingRoot = ({ headerItem, settingItems, isLoading }: Props) => (
  <>
    <NavigationBar
      backgroundColor={gray[100]}
      showBackButton={false}
      centerComponent={<NaviTitleDisplay title={TEXTS.pageTitle} />}
    />
    <View style={styles.container}>
      {isLoading ? (
        <SettingWidgetSkeleton />
      ) : (
        <SettingList
          header={[headerItem].filter(Boolean) as SettingItemProps[]}
          groups={settingItems}
        />
      )}
      <Label
        weight="regular"
        style={styles.versionLabel}
      >
        {TEXTS.appVersionPrefix + packageJson.version}
      </Label>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: gray[100],
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 12,
    paddingTop: 14,
  },
  versionLabel: {
    color: gray[400],
    marginBottom: 13,
    textAlign: 'center',
  },
});

export default memo(SettingRoot);
