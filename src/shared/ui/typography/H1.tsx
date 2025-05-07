import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function H1({ children, weight }: Props) {
  const className = `text-h1 font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
