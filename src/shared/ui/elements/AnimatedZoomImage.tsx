import { useScale } from '@/shared/hooks/useScale';
import { useRef, useEffect } from 'react';
import { ImageSourcePropType, Animated } from 'react-native';

interface AnimatedZoomImageProps {
  source: ImageSourcePropType;
  size: number;
}

const AnimatedZoomImage = ({ source, size }: AnimatedZoomImageProps) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const { getScaleSize } = useScale();

  useEffect(() => {
    scale.setValue(0.8);
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [source, scale]);

  return (
    <Animated.Image
      source={source}
      style={{
        transform: [{ scale }],
        width: getScaleSize(size),
        height: getScaleSize(size),
      }}
    />
  );
};
export default AnimatedZoomImage;
