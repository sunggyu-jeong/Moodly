import { useScale } from '../../hooks';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ActionButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const ActionButtonAtom = ({ ...props }: ActionButtonProps) => {
  const { getScaleSize } = useScale();

  return (
    <TouchableOpacity
      onPress={props.onPress}
      className="rounded-[42px] mx-[25px] h-[56px] justify-center items-center"
      style={{ backgroundColor: props.disabled ? '#A8A8A8': '#000000' }}
      disabled={props.disabled}
    >
      <Text 
        className="text-pretendard font-semibold tracking-[-0.5px] text-white text-center"
        style={{ fontSize: getScaleSize(16) }}
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButtonAtom;