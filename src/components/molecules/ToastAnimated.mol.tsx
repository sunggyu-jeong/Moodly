import { useRef, useEffect } from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastBaseAtom from "../atoms/ToastView.atom";
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import { setShowToastView } from "../../redux/slice/commonSlice";

interface ToastAnimatedProps {
  text: string;
}

const ToastAnimated = ({ text }: ToastAnimatedProps) => {
  const translateY = useRef(new Animated.Value(-40)).current;
  const showToastView = useAppSelector((state) => state.commonSlice.showToastView);
  const dispatch = useDispatch();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showToastView?.visibility) {
      translateY.setValue(-40);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 55, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -40, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(({ finished }) => {
          if (finished) {
            dispatch(setShowToastView({visibility: null, message:""}));
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showToastView]);

  return (
    <Animated.View className="absolute inset-x-0 top-0 h-[40px] z-[999] transform" style={{ transform: [{ translateY }], opacity: opacity }}>
      <SafeAreaView className="mx-5 items-center">
        <ToastBaseAtom text={text} />
      </SafeAreaView>
    </Animated.View>
  );
};

export default ToastAnimated;