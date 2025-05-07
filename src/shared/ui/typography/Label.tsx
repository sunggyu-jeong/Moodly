import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function Label({ children, weight }: Props) {
  const className = `text-label font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
