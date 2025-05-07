import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight: 'regular' | 'semibold' };

export function Label({ children, weight, style, ...rest }: Props) {
  const className = `text-label font-${weight}`;
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
