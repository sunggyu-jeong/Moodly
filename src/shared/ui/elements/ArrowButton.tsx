// ArrowButton.tsx 수정
import { getScaleSize } from '@/shared/hooks';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
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
