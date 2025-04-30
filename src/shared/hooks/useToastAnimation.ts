// hooks/useToastAnimation.ts
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useToastAnimation(
  visible: boolean,
  duration = 200,
  holdTime = 1500,
  onFinish?: () => void
) {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let timer: number;
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
      ]).start();

      timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -40, duration, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration, useNativeDriver: true }),
        ]).start(({ finished }) => {
          if (finished) {
            setIsMounted(false);
            onFinish?.();
          }
        });
      }, holdTime);
    }
    return () => clearTimeout(timer);
  }, [visible, duration, holdTime, onFinish, translateY, opacity]);

  return {
    style: { transform: [{ translateY }], opacity },
    isMounted,
  };
}
