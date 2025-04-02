import { GestureResponderEvent, TouchableOpacity } from "react-native"

export interface NaviActionButtonAtomProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  item: React.ReactNode;
} 

const NaviActionButtonAtom = ({ onPress, disabled, item }: NaviActionButtonAtomProps) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    {item}
  </TouchableOpacity>
)

export default NaviActionButtonAtom;