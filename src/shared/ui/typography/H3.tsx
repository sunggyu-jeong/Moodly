import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight: 'regular' | 'semibold' };

export function H3({ children, weight, style, ...rest }: Props) {
  const className = `text-h3 font-${weight}`;
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
