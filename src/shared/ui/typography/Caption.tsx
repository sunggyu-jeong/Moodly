import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function Caption({ children, weight }: Props) {
  const className = `text-caption font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
