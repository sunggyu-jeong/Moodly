import { Text, TextProps } from 'react-native';

import { useScale } from '@/shared/hooks';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };

export function Body1({ children, weight, size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 16);
  const className = `text-body1 font-${weight}`;
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
