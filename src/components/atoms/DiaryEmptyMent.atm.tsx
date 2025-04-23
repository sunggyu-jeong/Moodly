import { Text, View } from 'react-native';
import { getScaleSize } from '../../hooks';

const DiaryEmptyMent = () => {
  return (
    <View className="w-full min-h-[70vh] justify-center items-center">
      <Text
        className="font-pretendard tracking-[-0.5px]"
        style={{ fontSize: getScaleSize(21) }}
      >
        작성한 일기가 없어요!
      </Text>
    </View>
  );
};

export default DiaryEmptyMent;
