import { useEffect } from 'react';
import { Image, View } from 'react-native';

import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks';
import { navigate } from '@/shared/lib';
import { gray } from '@/shared/styles/colors';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';

const WriteDiaryComplete = () => {
  useEffect(() => {
    setTimeout(() => {
      navigate('DiaryStack', { screen: 'DiaryDetail', params: { origin: 'DiaryStack' } });
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-common-white items-center justify-center">
      <Image
        source={MAIN_ICONS.avatarComplete}
        style={{ width: getScaleSize(120), height: getScaleSize(120) }}
      />
      <H2
        weight="semibold"
        style={{ marginTop: getScaleSize(8), color: gray[600] }}
      >
        일기 작성 완료
      </H2>
      <Body2
        weight="regular"
        style={{ marginTop: getScaleSize(8), color: gray[400] }}
      >
        솔직한 마음을 들려줘서 고마워요
      </Body2>
    </View>
  );
};

export default WriteDiaryComplete;
