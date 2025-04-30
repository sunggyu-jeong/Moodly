import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

interface IconButtonAtomProps {
  icon: ImageSourcePropType;
  onPress: () => void;
}

const IconButton = ({ icon, onPress }: IconButtonAtomProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={icon}
        className="float-right"
      />
    </TouchableOpacity>
  );
};
export default IconButton;
