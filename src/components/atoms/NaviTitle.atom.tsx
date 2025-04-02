import { Text } from "react-native"

interface NavigationTitleAtomProps {
  title: string,
  style?: string
}

const NavigationTitleAtom = ({ title, style }: NavigationTitleAtomProps) => <Text className={style}>{title}</Text>

export default NavigationTitleAtom;