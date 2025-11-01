import { getScaleSize } from '@/shared/hooks';
import { Image, StyleSheet, type ImageSourcePropType } from 'react-native';

export interface AvatarAtomProps {
  source: ImageSourcePropType;
}

const Avatar = ({ source }: AvatarAtomProps) => {
  return (
    <Image
      source={source}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    marginRight: 15,
    width: getScaleSize(40),
    height: getScaleSize(40),
  },
});

export default Avatar;
