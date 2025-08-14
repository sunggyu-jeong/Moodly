import { Image, TouchableOpacity } from 'react-native';

import { getScaleSize } from '@/shared/hooks';
import { goBack } from '@/shared/lib';

import { COMMON_ICONS } from '../../assets/images/common';

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
