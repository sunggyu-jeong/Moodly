import { ReactNode } from 'react';
import { type GestureResponderEvent, TouchableOpacity } from 'react-native';

export interface NaviActionButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  item: ReactNode;
}

const NaviActionButton = ({ onPress, disabled, item }: NaviActionButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
  >
    {item}
  </TouchableOpacity>
);

export default NaviActionButton;
