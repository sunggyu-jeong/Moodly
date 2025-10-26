import { StyleSheet, TouchableOpacity } from 'react-native';
import { Label } from '../typography/Label';

interface ModalButtonProps {
  text: string;
  textColor: string;
  bgColor?: string;
  onPress: () => void;
}

const ModalButton = ({ text, textColor, bgColor, onPress }: ModalButtonProps) => {
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

export default ModalButton;
