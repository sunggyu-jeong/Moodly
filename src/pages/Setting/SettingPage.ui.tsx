// src/features/setting/page/SettingPage.ui.tsx
import { HeaderItem, SettingItemProps, TEXTS } from '@features/setting/types';
import SettingList from '@features/setting/ui/SettingList';
import { Label } from '@shared/ui/typography/Label';
import React from 'react';
import { gray } from '../../shared/styles/colors';
import NaviTitleDisplay from '../../shared/ui/elements/NaviTitle';
import NavigationBar from '../../widgets/navigation-bar/ui/NavigationBar';
import { View } from 'react-native';

interface Props {
  headerItem: HeaderItem;
  settingItems: SettingItemProps[];
  version: string;
}

const SettingPageUI = ({ headerItem, settingItems, version }: Props) => (
  <>
    <NavigationBar
      backgroundColor={gray[100]}
      showBackButton={false}
      centerComponent={<NaviTitleDisplay title={TEXTS.pageTitle} />}
    />
    <View className="bg-gray-100 flex-1 justify-between px-4 rounded-xl pt-[14px]">
      <SettingList items={[headerItem, ...settingItems]} />
      <Label
        weight="regular"
        className="text-gray-400 mb-[13px] text-center"
      >
        {TEXTS.appVersionPrefix + version}
      </Label>
    </View>
  </>
);

export default React.memo(SettingPageUI);
