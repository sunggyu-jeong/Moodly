import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getScaleSize } from '@/shared/hooks';

import { ColorKeyEnum, getColor } from '../../constants/Colors';

interface ActionButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
}

const ActionButton = ({ children, disabled, onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-[42px] mx-[25px] h-[56px] justify-center items-center"
      style={disabled ? styles.buttonDisabled : styles.buttonEnabled}
      disabled={disabled}
    >
      <Text
        className="text-pretendard font-semibold tracking-[-0.5px] text-white text-center"
        style={{ fontSize: getScaleSize(16) }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: {
    backgroundColor: getColor(ColorKeyEnum.Disabled),
  },
  buttonEnabled: {
    backgroundColor: getColor(ColorKeyEnum.Primary),
  },
});

export default ActionButton;
