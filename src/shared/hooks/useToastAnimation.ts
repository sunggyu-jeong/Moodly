// hooks/useToastAnimation.ts
import { useEffect, useState } from 'react';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function useToastAnimation(
  visible: boolean,
  duration = 200,
  holdTime = 1500,
  onFinish?: () => void
) {
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible) {
      setIsMounted(true);
      translateY.value = withTiming(0, { duration });
      opacity.value = withTiming(1, { duration });

      timeout = setTimeout(() => {
        translateY.value = withTiming(-40, { duration }, finished => {
          if (finished) {
            runOnJS(setIsMounted)(false);
            if (onFinish) {
              runOnJS(onFinish)();
            }
          }
        });
        opacity.value = withTiming(0, { duration });
      }, holdTime);
    }
    return () => clearTimeout(timeout);
  }, [visible, duration, holdTime, onFinish, translateY, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return {
    style,
    isMounted,
  };
}
