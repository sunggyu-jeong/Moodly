import { getScaleSize } from '@/shared/hooks';
import { goBack } from '@/shared/lib';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COMMON_ICONS } from '../../assets/images/common';

const NaviBackButton = () => (
  <TouchableOpacity
    onPress={goBack}
    style={styles.button}
  >
    <Image
      source={COMMON_ICONS.iconPrevTight}
      accessibilityLabel="backbutton"
      style={styles.image}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: 28,
  },
  image: {
    width: getScaleSize(10),
    height: getScaleSize(24),
  },
});

export default NaviBackButton;
