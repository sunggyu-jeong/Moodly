import { getScaleSize } from '@/shared/hooks';
import { Text } from 'react-native';

interface MonthlyLabelProps {
  label: string;
}

const MonthlyLabel = ({ label }: MonthlyLabelProps) => (
  <Text
    className="font-semibold tracking-[-0.5px]"
    style={{ fontSize: getScaleSize(18) }}
  >
    {label}
  </Text>
);

export default MonthlyLabel;
