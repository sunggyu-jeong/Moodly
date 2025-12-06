import { StyleSheet, Text, TextProps } from 'react-native';

import { useScale } from '@/shared/hooks/useScale';
import { androidStyle } from '@/shared/ui/typography/Common';

type Props = TextProps & {
  weight?: 'regular' | 'semibold';
  size?: number;
};

export function Label({ children, weight = 'regular', size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 14);

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
    fontFamily: 'Pretendard-Regular',
  },
  semibold: {
    fontFamily: 'Pretendard-SemiBold',
  },
});
