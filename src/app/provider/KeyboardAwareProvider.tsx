import { ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type KeyboardAwareProviderProps = {
  children: React.ReactNode;
  style: ViewStyle;
};

export default function KeyboardAwareProvider({
  children,
  style,
}: KeyboardAwareProviderProps) {
  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-common-white"
      bottomOffset={0}
      extraKeyboardSpace={-90}
      keyboardShouldPersistTaps="handled"
      style={style}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
