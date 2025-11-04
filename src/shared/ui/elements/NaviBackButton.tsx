import { COMMON_ICONS } from '@/shared/assets/images/common';
import { getScaleSize } from '@/shared/hooks/useScale';
import { goBack } from '@/shared/lib/navigation.util';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

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
