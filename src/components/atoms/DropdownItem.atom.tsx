import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

const DropDownItemAtom = ({
  text,
  source,
  textColor,
  onPress,
}: {
  text: string;
  source: ImageSourcePropType;
  textColor?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View className="h-[48px] flex-row items-center justify-between">
      <Text className="ml-[14px] text-sm" style={{ color: textColor }}>
        {text}
      </Text>
      <Image className="mr-3 w-6 h-6" source={source} />
    </View>
  </TouchableOpacity>
);

export default DropDownItemAtom;