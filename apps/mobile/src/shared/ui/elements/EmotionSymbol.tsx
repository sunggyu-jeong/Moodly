import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { getScaleSize } from '@/shared/hooks/useScale';

export interface EmotionSymbolProps {
  icon: ImageSourcePropType;
  onPress: () => void;
}

const EmotionSymbol = ({ icon, onPress }: EmotionSymbolProps) => (
  <View style={styles.container}>
    <Pressable
      onPress={onPress}
      style={styles.pressable}
    >
      <Image
        source={icon}
        resizeMode="cover"
        style={styles.image}
      />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '20%',
    height: 50,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: getScaleSize(56),
    height: getScaleSize(56),
  },
});

export default EmotionSymbol;
