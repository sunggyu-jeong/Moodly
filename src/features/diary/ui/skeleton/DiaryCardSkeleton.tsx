import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { SafeAreaView, View } from 'react-native';

const DiarySkeleton = () => {
  const mode = 'light';
  return (
    <SafeAreaView className="flex-1">
      <Skeleton.Group show={true}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <MotiView
            transition={{
              type: 'timing',
            }}
            animate={{ backgroundColor: '#ffffff' }}
            key={idx}
            className="bg-gray-400 py-5 px-[18px] mb-4 rounded-[15px] w-full"
          >
            {/* 아바타 자리 (원형) */}
            <View className="mb-3">
              <Skeleton
                width={40}
                height={40}
                radius="round"
                colorMode={mode}
              />
            </View>

            {/* 날짜/감정 텍스트 자리 */}
            <View className="mb-2">
              <Skeleton
                width="50%"
                height={16}
                radius={4}
                colorMode={mode}
              />
            </View>
            <View className="mb-4">
              <Skeleton
                width="33%"
                height={16}
                radius={4}
                colorMode={mode}
              />
            </View>

            {/* 본문 텍스트 */}
            <View className="mb-2">
              <Skeleton
                width="100%"
                height={12}
                radius={4}
                colorMode={mode}
              />
            </View>
            <Skeleton
              width="80%"
              height={12}
              radius={4}
              colorMode={mode}
            />
          </MotiView>
        ))}
      </Skeleton.Group>
    </SafeAreaView>
  );
};

export default DiarySkeleton;
