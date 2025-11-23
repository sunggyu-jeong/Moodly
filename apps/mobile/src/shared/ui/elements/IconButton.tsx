import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

import { getScaleSize } from '@/shared/hooks/useScale';

interface IconButtonAtomProps {
  icon: ImageSourcePropType;
  onPress: () => void;
}

const IconButton = ({ icon, onPress }: IconButtonAtomProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Image
        source={icon}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
  },
  image: {
    width: getScaleSize(24),
    height: getScaleSize(24),
  },
});

export default IconButton;
