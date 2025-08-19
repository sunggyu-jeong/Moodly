import { Text, type TextProps } from 'react-native';

import { useScale } from '@/shared/hooks';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };

export function Body2({ children, weight = 'regular', style, size, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 15);
  const className = `text-body2 font-${weight}`;
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
