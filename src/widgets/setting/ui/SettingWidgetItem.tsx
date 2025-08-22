import { AppSkeleton } from '@shared';
import { memo } from 'react';
import { View } from 'react-native';

const SettingWidgetItem = ({ withToggle }: { withToggle?: boolean }) => (
  <View className="w-full">
    <View className="flex-row items-center justify-between p-4">
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

export default memo(SettingWidgetItem);
