import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { IMAGES } from '../assets/images';
import { getScaleSize } from '../hooks';
import { navigate } from '../utils';

const WriteDiaryComplete = () => {
  useEffect(() => {
    setTimeout(() => {
      navigate('DiaryStack', { screen: 'DiaryDetail', params: { origin: 'DiaryStack' } });
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-white items-center">
      <Image
        source={IMAGES.smile}
        className="w-[144px] h-[144px]"
        style={{ marginTop: getScaleSize(262) }}
      />
      <Text
        className="font-pretendard font-semibold tracking-[-0.5px]"
        style={{ marginTop: getScaleSize(42), fontSize: getScaleSize(22) }}
      >
        솔직한 너의 마음을 알려줘서 고마워
      </Text>
      <Text
        className="font-pretendard font-normal text-[#00000080] tracking-[-0.5px]"
        style={{ marginTop: getScaleSize(13), fontSize: getScaleSize(16) }}
      >
        넌 충분히 괜찮은 사람이야
      </Text>
    </View>
  );
};

export default WriteDiaryComplete;
