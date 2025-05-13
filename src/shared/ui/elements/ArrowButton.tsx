import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

import { getScaleSize } from '../../hooks';

interface ArrowButtonAtomProps {
  source: ImageSourcePropType;
  disabled?: boolean;
  style?: string;
  onPress: () => void;
}

const ArrowButton = ({ source, disabled, style, onPress }: ArrowButtonAtomProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={style}
  >
    <Image
      source={source}
      className="w-[18px] h-[18px]"
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
