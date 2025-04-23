import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScale } from '../hooks';
import { resetTo } from '../utils';

const Splash = () => {
  const { getScaleSize } = useScale();

  useEffect(() => {
    setTimeout(() => {
      resetTo('Main');
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="bg-slate-50 flex-1">
      <View className="mt-[88.5px]">
        <Text
          className="text-pretendard font-bold tracking-[-0.5px] text-center"
          style={{ marginBottom: getScaleSize(35), fontSize: getScaleSize(56) }}
        >
          Moodly
        </Text>
        <Text className="text-[#606060] font-pretendard font-medium text-[21px] tracking-[-0.5px] text-center align-middle leading-[32px]">
          귀여운 감정 친구들과 함께{'\n'} 하루를 기록해봐요
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Splash;
