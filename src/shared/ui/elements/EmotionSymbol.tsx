import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { getScaleSize } from '@/shared/hooks';

export interface EmotionSymbolProps {
  icon: ImageSourcePropType;
  onPress: () => void;
}

const EmotionSymbol = ({ icon, onPress }: EmotionSymbolProps) => (
  <View className="w-[20%] items-center justify-center h-[50px] aspect-square">
    <Pressable onPress={onPress}>
      <Image
        source={icon}
        resizeMode="cover"
        style={styles.image}
      />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  image: {
    height: getScaleSize(56),
    width: getScaleSize(56),
  },
});

export default EmotionSymbol;
