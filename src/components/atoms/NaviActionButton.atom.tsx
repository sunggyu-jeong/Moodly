import { GestureResponderEvent, TouchableOpacity } from 'react-native';

export interface NaviActionButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  item: React.ReactNode;
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
