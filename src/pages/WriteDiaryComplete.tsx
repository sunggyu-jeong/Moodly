import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks';
import { navigate } from '@/shared/lib';

const WriteDiaryComplete = () => {
  useEffect(() => {
    setTimeout(() => {
      navigate('DiaryStack', { screen: 'DiaryDetail', params: { origin: 'DiaryStack' } });
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-white items-center">
      <Image
        source={MAIN_ICONS.avatarComplete}
        className="w-[144px] h-[144px]"
        style={{ marginTop: getScaleSize(262) }}
      />
      <Text
        className="font-pretendard font-semibold tracking-[-0.5px]"
        style={{ marginTop: getScaleSize(42), fontSize: getScaleSize(22) }}
      >
        일기 작성 완료
      </Text>
      <Text
        className="font-pretendard font-normal text-[#00000080] tracking-[-0.5px]"
        style={{ marginTop: getScaleSize(13), fontSize: getScaleSize(16) }}
      >
        솔직한 마음을 들려줘서 고마워요
      </Text>
    </View>
  );
};

export default WriteDiaryComplete;
