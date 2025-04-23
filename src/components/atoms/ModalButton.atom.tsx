import { Text, TouchableOpacity } from "react-native";

interface ModalButtonProps {
  text: string;
  textColor: string;
  bgColor?: string;
  onPress: () => void;
}
const ModalButton = ({ ...button }: ModalButtonProps) => {
  return (
    <TouchableOpacity 
      onPress={button.onPress} 
      className="flex-1 border-1 p-5 space-x-5 rounded-xl border border-[#E0E0E3]" 
      style={{ backgroundColor: button?.bgColor ?? 'white' }}>
      <Text className="text-sm font-pretendard font-normal text-center tracking-[-0.5px] items-center" style={{ color: button.textColor }}>
        {button.text}
      </Text>
    </TouchableOpacity>
  );
}

export default ModalButton;