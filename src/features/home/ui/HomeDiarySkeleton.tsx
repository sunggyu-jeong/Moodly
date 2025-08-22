import { AppSkeleton, SkeletonContainer } from '@shared';
import { View } from 'react-native';

const HomeDiarySkeleton = () => {
  return (
    <>
      <SkeletonContainer className="px-5 justify-center items-center rounded-xl">
        <View className="w-full justify-center items-center px-5 py-6 ">
          <View className="w-full mb-3 items-center">
            <View className="mb-2 items-center">
              <AppSkeleton
                width="70%"
                height={22}
                radius={6}
              />
            </View>
            <AppSkeleton
              width="55%"
              height={22}
              radius={6}
            />
          </View>

          <View className="my-4">
            <AppSkeleton
              width={180}
              height={180}
              radius="round"
            />
          </View>

          <View className="w-full mt-2">
            <AppSkeleton
              width="100%"
              height={48}
              radius={10}
            />
          </View>
        </View>
      </SkeletonContainer>
    </>
  );
};

export default HomeDiarySkeleton;
