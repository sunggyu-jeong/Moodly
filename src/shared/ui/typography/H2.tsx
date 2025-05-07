import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function H2({ children, weight }: Props) {
  const className = `text-h2 font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
