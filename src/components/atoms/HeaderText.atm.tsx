import { Text, TextProps } from 'react-native';
import { getScaleSize } from '../../hooks';

interface HeaderTextProps extends TextProps {
  children: React.ReactNode;
}

const HeaderText = ({ children, style, ...props }: HeaderTextProps) => {
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
