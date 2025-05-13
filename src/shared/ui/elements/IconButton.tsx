import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

import { getScaleSize } from '../../hooks';

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
        style={{ width: getScaleSize(24), height: getScaleSize(24) }}
      />
    </TouchableOpacity>
  );
};
export default IconButton;
