import { Image, TouchableOpacity } from "react-native";
import { ImageSourcePropType } from "react-native";

interface ArrowButtonAtomProps {
  source: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
  style?: string;
}

const ArrowButtonAtom = ({ ...props }: ArrowButtonAtomProps) => (
  <TouchableOpacity onPress={props.onPress} disabled={props.disabled} className={props.style}>
    <Image source={props.source} className="w-[18px] h-[18px]" />
  </TouchableOpacity>
);

export default ArrowButtonAtom;