import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ColorKeyEnum, getColor } from '../../constants/Colors';
import { Body2 } from '../typography/Body2';

interface ActionButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
}

const ActionButton = ({ children, disabled, onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl mx-[25px] h-[56px] justify-center items-center w-full"
      style={disabled ? styles.buttonDisabled : styles.buttonEnabled}
      disabled={disabled}
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
