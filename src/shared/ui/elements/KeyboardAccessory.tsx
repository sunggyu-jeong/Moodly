import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { gray } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';

import { getScaleSize } from '../../hooks';

interface keyboardAccessoryButtonProps {
  onPress: () => void;
}

export const KeyboardAccessoryButton = ({ onPress }: keyboardAccessoryButtonProps) => (
  <View className="flex-1 h-10 justify-center border-t-[0.5px] border-t-[#C6C9D7]">
    <TouchableWithoutFeedback onPress={onPress}>
      <H3
        weight="semibold"
        style={accessoryStyles.text}
      >
        저장
      </H3>
    </TouchableWithoutFeedback>
  </View>
);

const accessoryStyles = StyleSheet.create({
  text: {
    color: gray[600],
    fontWeight: '600',
    marginRight: getScaleSize(20),
    textAlign: 'right',
  },
});
