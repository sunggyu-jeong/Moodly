import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastAnimation } from '@/shared/hooks/useToastAnimation';

import ToastBase from '../ui/ToastBase';

interface ToastAnimatedProps {
  visible: boolean;
  text: string;
  onHide: () => void;
}

const ToastAnimated = ({ visible, text, onHide }: ToastAnimatedProps) => {
  const insets = useSafeAreaInsets();
  const { style, isMounted } = useToastAnimation(visible, 200, 1500, onHide);

  if (!isMounted) return null;

  return (
    <Animated.View
      className="absolute inset-x-0 top-0 z-[999] transform"
      style={[style, { marginTop: insets.top }, styles.toastHeight]}
    >
      <View className="mx-5 items-center h-full">
        <ToastBase text={text} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastHeight: {
    height: 40,
  },
});

export default ToastAnimated;
