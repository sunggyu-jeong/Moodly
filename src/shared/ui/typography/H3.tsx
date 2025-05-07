import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function H3({ children, weight }: Props) {
  const className = `text-h3 font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
