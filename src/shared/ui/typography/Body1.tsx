import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight: 'regular' | 'semibold' };

export function Body1({ children, weight, style, ...rest }: Props) {
  const className = `text-body1 font-${weight}`;
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
