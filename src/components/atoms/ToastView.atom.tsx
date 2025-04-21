import { Text } from "react-native";
import { View } from "react-native";

interface ToastBaseProps { text: string }
const ToastBaseAtom = ({ text }: ToastBaseProps) => (
  <View className="w-full h-10 px-4 py-2 rounded-xl bg-gray-900">
    <Text className="text-white font-pretendard text-sm tracking-[-0.5px]">
      {text}
    </Text>
  </View>
);

export default ToastBaseAtom;