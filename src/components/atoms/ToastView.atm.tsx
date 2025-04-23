import { Text, View } from 'react-native';

interface ToastBaseProps {
  text: string;
}
const ToastBase = ({ text }: ToastBaseProps) => (
  <View className="w-full px-4 py-2 rounded-xl bg-gray-900 h-full justify-center">
    <Text className="text-white font-pretendard text-sm tracking-[-0.5px]">{text}</Text>
  </View>
);

export default ToastBase;
