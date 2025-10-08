import { gray } from '@/shared/styles/colors';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { Label } from '@/shared/ui/typography/Label';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';
import SettingWidgetSkeleton from '@/widgets/setting/ui/SettingWidgetSkeleton';
import { memo } from 'react';
import { View } from 'react-native';

import packageJson from '../../../../package.json';
import { type SettingItemProps, TEXTS } from '../types';
import SettingList from './SettingList';

interface Props {
  headerItem: SettingItemProps;
  settingItems: SettingItemProps[][];
  isLoading: boolean;
}

const SettingRoot = ({ headerItem, settingItems, isLoading }: Props) => (
  <>
    <NavigationBar
      backgroundColor={gray[100]}
      showBackButton={false}
      centerComponent={<NaviTitleDisplay title={TEXTS.pageTitle} />}
    />
    <View className="bg-gray-100 flex-1 justify-between px-4 rounded-xl pt-[14px]">
      {isLoading ? (
        <SettingWidgetSkeleton />
      ) : (
        <>
          <SettingList
            header={[headerItem]}
            groups={settingItems}
          />
        </>
      )}
      <Label
        weight="regular"
        className="text-gray-400 mb-[13px] text-center"
      >
        {TEXTS.appVersionPrefix + packageJson.version}
      </Label>
    </View>
  </>
);

export default memo(SettingRoot);
