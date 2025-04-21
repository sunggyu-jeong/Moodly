import { Image, Pressable, View } from "react-native";

export interface PureEmotionIconAtomProps {
  icon: any;
  onPress: () => void;
}

const EmotionIconAtom = ({ ...props }: PureEmotionIconAtomProps) => (
  <View className="w-[20%] items-center justify-center h-[50px] aspect-square">
    <Pressable onPress={props.onPress}>
      <Image
        source={props.icon}
        resizeMode="cover"
        style={{ width: 56, height: 56, aspectRatio: 1 }}
      />
    </Pressable>
  </View>
);

export default EmotionIconAtom;