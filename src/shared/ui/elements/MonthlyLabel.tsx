import { gray } from '@/shared/styles';

import { H3 } from '../typography/H3';

interface MonthlyLabelProps {
  label: string;
}

const MonthlyLabel = ({ label }: MonthlyLabelProps) => (
  <H3
    weight="semibold"
    style={{ color: gray[600] }}
  >
    {label}
  </H3>
);

export default MonthlyLabel;
