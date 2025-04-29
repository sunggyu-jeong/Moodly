import { getScaleSize } from '@/shared/hooks';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

interface KeyboardAccessoryProps {
  onPress: () => void;
}

const KeyboardAccessory = ({ ...props }: KeyboardAccessoryProps) => {
  return (
    <View className="w-full h-10 bg-white justify-center items-end border-t-[0.5px] border-t-[#E9E9E9] ">
      <TouchableWithoutFeedback onPress={props.onPress}>
        <Text
          className="font-pretendard font-semibold mr-6"
          style={{ fontSize: getScaleSize(18) }}
        >
          저장
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default KeyboardAccessory;
