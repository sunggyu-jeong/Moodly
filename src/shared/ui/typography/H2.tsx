import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight: 'regular' | 'semibold' };

export function H2({ children, weight, style, ...rest }: Props) {
  const className = `text-h2 font-${weight} text-center`;
  return (
    <Text
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Text>
  );
}
