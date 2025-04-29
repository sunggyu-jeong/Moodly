import { getScaleSize, useAppSelector } from '@/hooks';
import { Image, Text, View } from 'react-native';

const SelectedEmotion = () => {
  const selectedIcon = useAppSelector((state) => state.diarySlice.selectedIcon);

  return (
    <View style={{ marginTop: getScaleSize(66) }}>
      <Image
        source={selectedIcon?.icon}
        style={{ width: getScaleSize(140), height: getScaleSize(140) }}
      />
      <Text
        className="font-bold text-center tracking-[-0.5px]"
        style={{ fontSize: getScaleSize(24), marginTop: getScaleSize(62.5) }}
      >
        {selectedIcon?.text}
      </Text>
      <Text
        className="font-medium text-center"
        style={{ fontSize: getScaleSize(16), marginTop: getScaleSize(16) }}
      >
        {selectedIcon?.description}
      </Text>
    </View>
  );
};

export default SelectedEmotion;
