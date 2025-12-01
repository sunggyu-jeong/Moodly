import { StyleSheet, Text, TextProps } from 'react-native';

import { useScale } from '@/shared/hooks/useScale';
import { androidStyle } from '@/shared/ui/typography/Common';

type Props = TextProps & {
  weight?: 'regular' | 'semibold';
  size?: number;
};

export function H1({ children, weight = 'regular', size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 22);

  return (
    <Text
      style={[
        styles.base,
        weight === 'semibold' ? styles.semibold : styles.regular,
        { fontSize: fontSizeValue },
        androidStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#000000',
  },
  regular: {
    fontWeight: '400',
  },
  semibold: {
    fontWeight: '600',
  },
});
