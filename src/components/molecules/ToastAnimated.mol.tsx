// molecules/ToastAnimated.mol.tsx
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastAnimation } from '../../hooks/useToastAnimation';
import ToastBase from '../atoms/ToastView.atm';

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
      style={[style, { marginTop: insets.top, height: 40 }]}
    >
      <View className="mx-5 items-center h-full">
        <ToastBase text={text} />
      </View>
    </Animated.View>
  );
};

export default ToastAnimated;
