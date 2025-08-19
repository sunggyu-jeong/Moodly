import { Text, type TextProps } from 'react-native';

import { useScale } from '@/shared/hooks';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };

export function Title({ children, weight, size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 31);
  const className = `text-title font-${weight}`;
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
