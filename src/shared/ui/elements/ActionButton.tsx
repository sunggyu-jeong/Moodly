import { getColor, ColorKeyEnum } from '@/shared/constants/Colors';
import { getScaleSize } from '@/shared/hooks/useScale';
import { Body2 } from '@/shared/ui/typography/Body2';
import { StyleProp, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';

interface ActionButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ActionButton = ({ children, disabled, onPress, style }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.base, disabled ? styles.buttonDisabled : styles.buttonEnabled, style]}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Body2
        weight="semibold"
        style={styles.text}
      >
        {children}
      </Body2>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: getScaleSize(12),
    height: getScaleSize(56),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: getScaleSize(25),
  },
  buttonDisabled: {
    backgroundColor: getColor(ColorKeyEnum.Disabled),
  },
  buttonEnabled: {
    backgroundColor: getColor(ColorKeyEnum.Primary),
  },
  text: {
    color: getColor(ColorKeyEnum.White),
  },
});

export default ActionButton;
