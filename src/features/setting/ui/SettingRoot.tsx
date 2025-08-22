import { gray } from '@shared/styles/colors';
import NaviTitleDisplay from '@shared/ui/elements/NaviTitle';
import { Label } from '@shared/ui/typography/Label';
import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar';
import SettingWidgetSkeleton from '@widgets/setting/ui/SettingWidgetSkeleton';
import React from 'react';
import { View } from 'react-native';

import { type SettingItemProps, TEXTS } from '../types';
import SettingList from './SettingList';

interface Props {
  headerItem: SettingItemProps;
  settingItems: SettingItemProps[][];
  version: string;
  isLoading: boolean;
}

const SettingRoot = ({ headerItem, settingItems, version, isLoading }: Props) => (
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
        {TEXTS.appVersionPrefix + version}
      </Label>
    </View>
  </>
);

export default React.memo(SettingRoot);
