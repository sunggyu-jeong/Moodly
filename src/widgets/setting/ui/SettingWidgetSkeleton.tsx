import { memo } from 'react';
import { View } from 'react-native';

import SettingWidgetGroup from './SettingWidgetGroup';
import SettingWidgetHeader from './SettingWidgetHeader';
import SettingWidgetItem from './SettingWidgetItem';

const SettingWidgetSkeleton = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 justify-between pt-[14px]">
        <View className="flex-1 gap-4">
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
};

export default memo(SettingWidgetSkeleton);
