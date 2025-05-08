import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { getScaleSize } from '../../../shared/hooks';

export function useKeyboardAccessoryAnimation(
  multiplier: number = 1.19,
  height: number = getScaleSize(40)
) {
  const position = useSharedValue(-height);

  const mapKeyboardEasing = (type: string) => {
    switch (type) {
      case 'easeIn':
        return Easing.in(Easing.ease);
      case 'easeInEaseOut':
        return Easing.inOut(Easing.ease);
      case 'linear':
        return Easing.linear;
      default:
        return Easing.out(Easing.ease);
    }
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(
      showEvent,
      ({ duration = 250, easing: easingType, endCoordinates }) => {
        position.value = withTiming(endCoordinates.height, {
          duration: duration * multiplier,
          easing: mapKeyboardEasing(easingType),
        });
      }
    );

    const hideSub = Keyboard.addListener(
      hideEvent,
      ({ duration = 250, easing: easingType }) => {
        position.value = withTiming(-height, {
          duration: duration * multiplier,
          easing: mapKeyboardEasing(easingType),
        });
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [height, multiplier]);

  return useAnimatedStyle(() => ({ bottom: position.value }));
}
