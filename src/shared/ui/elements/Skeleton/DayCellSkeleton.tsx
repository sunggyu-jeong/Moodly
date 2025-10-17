import { COLOR_MODE } from '@/shared/constants';
import { Skeleton } from 'moti/skeleton';
import { View } from 'react-native';

const DayCellSkeleton = () => {
  return (
    <View className="items-center justify-center bg-common-transparent w-full h-full p-1">
      <View className="w-10 h-10">
        <Skeleton
          width={40}
          height={40}
          radius="round"
          colorMode={COLOR_MODE}
        />
      </View>

      <View className="ml-2 items-center mt-2">
        <Skeleton
          width="50%"
          height={12}
          radius={4}
          colorMode={COLOR_MODE}
        />
      </View>
    </View>
  );
};

export default DayCellSkeleton;
