import { StyleSheet, TouchableOpacity } from 'react-native';

import { Label } from '@/shared/ui/typography/Label';

interface PopupButtonProps {
  text: string;
  textColor: string;
  bgColor?: string;
  onPress: () => void;
}

const PopupButton = ({ text, textColor, bgColor, onPress }: PopupButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: bgColor ?? 'white' }]}
      activeOpacity={0.8}
    >
      <Label
        weight="semibold"
        style={[styles.text, { color: textColor }]}
      >
        {text}
      </Label>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default PopupButton;
