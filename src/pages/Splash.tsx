import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { IMAGES } from '../assets/images';
import { getScaleSize } from '../hooks';
import { resetTo } from '../utils';

const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
      resetTo('Main');
    }, 2000);
  }, []);

  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Image
        source={IMAGES.smile}
        style={{
          width: getScaleSize(132),
          height: getScaleSize(132),
          marginBottom: getScaleSize(33),
        }}
      />
      <Text
        className="text-pretendard font-bold tracking-[-0.5px] text-center"
        style={{ marginBottom: getScaleSize(35), fontSize: getScaleSize(53) }}
      >
        Moodly
      </Text>
      <Text
        className="text-[#606060] font-pretendard font-medium tracking-[-0.5px] text-center align-middle leading-[32px]"
        style={{ fontSize: getScaleSize(21) }}
      >
        귀여운 감정 친구들과 함께{'\n'} 하루를 기록해봐요
      </Text>
    </View>
  );
};

export default Splash;
