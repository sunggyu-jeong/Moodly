import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function Body1({ children, weight }: Props) {
  const className = `text-body1 font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
