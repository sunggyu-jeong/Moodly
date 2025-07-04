import { View } from 'react-native';

import { Body2 } from '@shared/ui/typography/Body2';

interface ToastBaseProps {
  text: string;
}
const ToastBase = ({ text }: ToastBaseProps) => (
  <View className="w-full px-4 py-2 rounded-xl bg-gray-600 h-full justify-center">
    <Body2
      weight="regular"
      className="color-common-white"
    >
      {text}
    </Body2>
  </View>
);

export default ToastBase;
