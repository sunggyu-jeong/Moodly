import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ColorKeyEnum, getColor } from '@/shared/constants';
import { getScaleSize } from '@/shared/hooks';

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
      className="rounded-xl h-[56px] justify-center items-center w-full px-[25px]"
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
    height: getScaleSize(56),
  },
  buttonEnabled: {
    backgroundColor: getColor(ColorKeyEnum.Primary),
    height: getScaleSize(56),
  },
  text: {
    color: getColor(ColorKeyEnum.White),
  },
});

export default ActionButton;
