import { Text } from "react-native";

interface MonthLabelAtomProps {
  label: string;
}

const MonthLabelAtom = ({ label }: MonthLabelAtomProps) => (
  <Text className="font-semibold text-[23px] tracking-[-0.5px]">
    {label}
  </Text>
);

export default MonthLabelAtom;