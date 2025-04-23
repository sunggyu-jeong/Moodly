import { Text } from 'react-native';

interface NaviTitleDisplayProps {
  title: string;
}

const NaviTitleDisplay = ({ title }: NaviTitleDisplayProps) => (
  <Text className="font-bold text-[20px] text-black tracking-[-0.5px] text-center">
    {title}
  </Text>
);

export default NaviTitleDisplay;
