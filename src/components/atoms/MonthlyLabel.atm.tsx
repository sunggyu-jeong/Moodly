import { Text } from 'react-native';

interface MonthlyLabelProps {
  label: string;
}

const MonthlyLabel = ({ label }: MonthlyLabelProps) => (
  <Text className="font-semibold text-[23px] tracking-[-0.5px]">{label}</Text>
);

export default MonthlyLabel;
