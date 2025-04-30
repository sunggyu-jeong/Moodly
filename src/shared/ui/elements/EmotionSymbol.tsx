import { Image, ImageSourcePropType, Pressable, View } from 'react-native';

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
        className="w-14 h-14 aspect-1"
      />
    </Pressable>
  </View>
);

export default EmotionSymbol;
