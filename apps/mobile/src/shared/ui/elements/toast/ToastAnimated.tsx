import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastAnimation } from '@/shared/hooks/useToastAnimation';

import ToastBase from './ToastBase';

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
    <Animated.View style={[styles.animatedView, style, { marginTop: insets.top }]}>
      <View style={styles.inner}>
        <ToastBase text={text} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
    height: 40,
    transform: [],
  },
  inner: {
    marginHorizontal: 20,
    alignItems: 'center',
    height: '100%',
  },
});

export default ToastAnimated;
