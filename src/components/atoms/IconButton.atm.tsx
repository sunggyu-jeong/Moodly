import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

interface IconButtonAtomProps {
  icon: ImageSourcePropType;
  onPress: () => void;
}

const IconButton = ({ ...props }: IconButtonAtomProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Image
        source={props.icon}
        className="float-right"
      />
    </TouchableOpacity>
  );
};
export default IconButton;
