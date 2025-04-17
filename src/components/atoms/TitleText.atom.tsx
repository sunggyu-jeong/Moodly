import { useScale } from "../../hooks";
import { Text, TextProps } from "react-native";

interface TitleTextProps extends TextProps { 
  children: React.ReactNode;
}

const TitleText = ({ children, style, ...props}: TitleTextProps) => {
  const { getScaleSize } = useScale();

  return (
    <Text
      {...props}
      className="text-pretendard font-bold tracking-[-0.5px] text-center leading-[40px]"
      style={[{ fontSize: getScaleSize(22) }, style]}
    >
      {children}
    </Text>
  );
}

export default TitleText;