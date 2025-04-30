import { Text, TouchableOpacity } from 'react-native';

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
      className="flex-1 border-1 p-5 space-x-5 rounded-xl border border-[#E0E0E3]"
      style={{ backgroundColor: bgColor ?? 'white' }}
    >
      <Text
        className="text-sm font-pretendard font-normal text-center tracking-[-0.5px] items-center"
        style={{ color: textColor }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ModalButton;
