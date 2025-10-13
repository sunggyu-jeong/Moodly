import { AppSkeleton, SkeletonContainer } from '@/shared';
import { View } from 'react-native';

const HomeDiaryCountSkeleton = () => {
  return (
    <SkeletonContainer className="flex-row justify-between items-center w-full px-4 py-2 rounded-xl mb-4">
      <View className="flex-row items-center">
        <AppSkeleton
          width={36}
          height={36}
          radius="round"
        />
        <View className="ml-[13px]">
          <AppSkeleton
            width={120}
            height={18}
            radius={4}
          />
        </View>
      </View>
      <View className="flex-row items-center">
        <View className="mr-[6px]">
          <AppSkeleton
            width={28}
            height={24}
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
};

export default HomeDiaryCountSkeleton;
