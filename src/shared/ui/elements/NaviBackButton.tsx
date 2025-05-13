import { Image, TouchableOpacity } from 'react-native';

import { COMMON_ICONS } from '../../assets/images/common';
import { getScaleSize } from '../../hooks';
import { goBack } from '../../lib';

const NaviBackButton = () => (
  <TouchableOpacity
    onPress={goBack}
    className="w-7"
  >
    <Image
      source={COMMON_ICONS.iconPrevTight}
      accessibilityLabel="backbutton"
      style={{ width: getScaleSize(10), height: getScaleSize(24) }}
    />
  </TouchableOpacity>
);

export default NaviBackButton;
