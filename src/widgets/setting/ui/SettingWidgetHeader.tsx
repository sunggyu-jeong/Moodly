import { AppSkeleton, SkeletonContainer } from '@/shared';
import { memo } from 'react';
import { View } from 'react-native';

const SettingWidgetHeader = () => (
  <SkeletonContainer className="bg-common-white rounded-xl">
    <View className="flex-row items-center justify-between p-4">
      <View className="flex-1 mr-4">
        <View className="mb-2">
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

export default memo(SettingWidgetHeader);
