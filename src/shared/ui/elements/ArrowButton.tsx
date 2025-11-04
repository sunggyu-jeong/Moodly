import { getScaleSize } from '@/shared/hooks/useScale';
import {
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

interface ArrowButtonAtomProps {
  source: ImageSourcePropType;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const ArrowButton = ({ source, disabled, style, onPress }: ArrowButtonAtomProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={style}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Image
      source={source}
      style={styles.image}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  image: {
    height: getScaleSize(18),
    width: getScaleSize(18),
  },
});

export default ArrowButton;
