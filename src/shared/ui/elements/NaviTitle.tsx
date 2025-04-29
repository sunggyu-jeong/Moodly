import { getScaleSize } from '@/shared/hooks';
import { Text } from 'react-native';

interface NaviTitleDisplayProps {
  title: string;
}

const NaviTitleDisplay = ({ title }: NaviTitleDisplayProps) => (
  <Text
    className="font-bold text-black tracking-[-0.5px] text-center"
    style={{ fontSize: getScaleSize(18) }}
  >
    {title}
  </Text>
);

export default NaviTitleDisplay;
