import { Text, TextProps } from 'react-native';

import { useScale } from '../../hooks';

type Props = TextProps & { weight: 'regular' | 'semibold'; size?: number };

export function Caption({ children, weight, size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 12);
  const className = `text-caption font-${weight}`;
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
