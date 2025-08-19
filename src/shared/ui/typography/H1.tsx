import { Text, type TextProps } from 'react-native';

import { useScale } from '@/shared/hooks';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };

export function H1({ children, weight, size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 22);
  const className = `text-h1 font-${weight}`;
  return (
    <Text
      className={className}
      style={[{ fontSize: fontSizeValue }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
