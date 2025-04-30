import { Image, TouchableOpacity } from 'react-native';

import { IMAGES } from '../../assets/images';
import { goBack } from '../../lib';

const NaviBackButton = () => (
  <TouchableOpacity
    onPress={goBack}
    className="w-7"
  >
    <Image
      source={IMAGES.back}
      accessibilityLabel="backbutton"
    />
  </TouchableOpacity>
);

export default NaviBackButton;
