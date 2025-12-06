import { StyleSheet, Text, TextProps } from 'react-native';

import { getScaleSize } from '@/shared/hooks/useScale';
import { androidStyle } from '@/shared/ui/typography/Common';

type Props = TextProps & {
  weight?: 'regular' | 'semibold';
  size?: number;
};

export function H3({ children, weight = 'regular', size, style, ...rest }: Props) {
  const fontSizeValue = getScaleSize(size ?? 18);

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
