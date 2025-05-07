import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { gray } from '../../styles/colors';
import { H3 } from '../typography/H3';

interface KeyboardAccessoryProps {
  onPress: () => void;
}

const KeyboardAccessory = ({ onPress }: KeyboardAccessoryProps) => {
  return (
    <View className="w-full h-10 bg-common-white justify-center items-end border-t-[0.5px] border-t-[#E9E9E9] ">
      <TouchableWithoutFeedback onPress={onPress}>
        <H3
          weight="semibold"
          style={styles.text}
        >
          저장
        </H3>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: gray[600],
    marginRight: 20,
  },
});

export default KeyboardAccessory;
