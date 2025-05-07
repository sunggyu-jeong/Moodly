import { Text, TextProps } from 'react-native';

type Props = TextProps & { weight?: 'regular' | 'semiBold' };

export function Body2({ children, weight }: Props) {
  const className = `text-body2 font-${weight}`;
  return <Text className={className}>{children}</Text>;
}
