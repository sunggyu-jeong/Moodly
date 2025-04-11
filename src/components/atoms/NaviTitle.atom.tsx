import { Text } from "react-native"

interface NavigationTitleAtomProps {
  title: string,
}

const NavigationTitleAtom = ({ title }: NavigationTitleAtomProps) => 
  <Text className="font-bold text-[20px] text-black tracking-[-0.5px] text-center">
    {title}
  </Text>

export default NavigationTitleAtom;