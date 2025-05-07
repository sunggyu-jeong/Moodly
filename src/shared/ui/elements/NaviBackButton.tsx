import { Image, TouchableOpacity } from 'react-native';

import { COMMON_ICONS } from '../../assets/images/common';
import { goBack } from '../../lib';

const NaviBackButton = () => (
  <TouchableOpacity
    onPress={goBack}
    className="w-7"
  >
    <Image
      source={COMMON_ICONS.iconPrevTight}
      accessibilityLabel="backbutton"
    />
  </TouchableOpacity>
);

export default NaviBackButton;
