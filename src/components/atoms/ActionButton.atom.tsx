import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ActionButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

const ActionButtonAtom = ({ onPress, children }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-black rounded-[42px] mx-[25px] h-[56px] justify-center items-center"
    >
      <Text className="text-pretendard font-semibold tracking-[-0.5px] text-white text-center">
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButtonAtom;