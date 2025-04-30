import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

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
    />
  </TouchableOpacity>
);

export default ArrowButton;
