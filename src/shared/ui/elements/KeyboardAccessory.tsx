import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import {
  DefaultKeyboardToolbarTheme,
  KeyboardToolbarProps,
} from 'react-native-keyboard-controller';

import { common, gray } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';

import { getScaleSize } from '../../hooks';

export const KeyboardAccessoryButton: KeyboardToolbarProps['button'] = ({ onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <H3
      weight="semibold"
      style={accessoryStyles.text}
    >
      저장
    </H3>
  </TouchableWithoutFeedback>
);

export const KeyboardAccessoryTheme: KeyboardToolbarProps['theme'] = {
  ...DefaultKeyboardToolbarTheme,
  light: {
    ...DefaultKeyboardToolbarTheme.light,
    background: common.white,
  },
};

const accessoryStyles = StyleSheet.create({
  text: {
    color: gray[600],
    marginRight: getScaleSize(20),
  },
});
