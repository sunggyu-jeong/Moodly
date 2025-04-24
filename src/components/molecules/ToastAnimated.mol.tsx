import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks';
import { setShowToastView } from '../../redux/slice/commonSlice';
import ToastBase from '../atoms/ToastView.atm';

interface ToastAnimatedProps {
  text: string;
}

const ToastAnimated = ({ text }: ToastAnimatedProps) => {
  const translateY = useRef(new Animated.Value(-40)).current;
  const showToastView = useAppSelector((state) => state.commonSlice.showToastView);
  const dispatch = useDispatch();
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (showToastView?.visibility) {
      translateY.setValue(-40);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -40,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(({ finished }) => {
          if (finished) {
            dispatch(setShowToastView({ visibility: null, message: '' }));
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showToastView]);

  return (
    <Animated.View
      className="absolute inset-x-0 top-0 z-[999] transform"
      style={{
        transform: [{ translateY }],
        opacity: opacity,
        height: 40,
        marginTop: insets.top,
      }}
    >
      <View className="mx-5 items-center h-full">
        <ToastBase text={text} />
      </View>
    </Animated.View>
  );
};

export default ToastAnimated;
