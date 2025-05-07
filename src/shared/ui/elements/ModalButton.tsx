import { TouchableOpacity } from 'react-native';

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
      className="flex-1 p-5 space-x-5 rounded-xl"
      style={{ backgroundColor: bgColor ?? 'white' }}
    >
      <Label
        weight="semibold"
        style={{ color: textColor }}
        className="text-center"
      >
        {text}
      </Label>
    </TouchableOpacity>
  );
};

export default ModalButton;
