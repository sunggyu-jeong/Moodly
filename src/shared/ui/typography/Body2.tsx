import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight: 'regular' | 'semibold' };

export function Body2({ children, weight = 'regular', style, ...rest }: Props) {
  const className = `text-body2 font-${weight}`;
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
