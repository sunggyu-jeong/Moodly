import { common } from '@/shared/styles/colors';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type KeyboardAwareProviderProps = {
  children: React.ReactNode;
  style: ViewStyle;
};

export default function KeyboardAwareProvider({ children, style }: KeyboardAwareProviderProps) {
  return (
    <KeyboardAwareScrollView style={[styles.StyledContainer, style]}>
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  StyledContainer: {
    flex: 1,
    backgroundColor: common.white,
  },
});
