// hooks/useToastAnimation.ts
import { useEffect, useState } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export function useToastAnimation(
  visible: boolean,
  duration = 200,
  holdTime = 1500,
  onFinish?: () => void,
) {
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible) {
      Promise.resolve().then(() => {
        setIsMounted(true);
      });

      translateY.value = withTiming(0, { duration });
      opacity.value = withTiming(1, { duration });

      timeout = setTimeout(() => {
        translateY.value = withTiming(-40, { duration }, finished => {
          if (finished) {
            scheduleOnRN(setIsMounted, false);
            if (onFinish) {
              scheduleOnRN(onFinish);
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
