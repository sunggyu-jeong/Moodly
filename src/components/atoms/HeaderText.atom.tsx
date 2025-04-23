import { Text, TextProps } from 'react-native';
import { useScale } from '../../hooks';

interface HeaderTextProps extends TextProps {
  children: React.ReactNode;
}

const HeaderText = ({ children, style, ...props }: HeaderTextProps) => {
  const { getScaleSize } = useScale();

  return (
    <Text
      {...props}
      className="text-pretendard font-bold tracking-[-0.5px] text-center"
      style={[{ fontSize: getScaleSize(22) }, style]}
    >
      {children}
    </Text>
  );
};

export default HeaderText;
