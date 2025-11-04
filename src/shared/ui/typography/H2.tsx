import { useScale } from '@/shared/hooks/useScale';
import { androidStyle } from '@/shared/ui/typography/Common';
import { TextProps, Text, StyleSheet } from 'react-native';

type Props = TextProps & {
  weight?: 'regular' | 'semibold';
  size?: number;
};

export function H2({ children, weight = 'regular', size, style, ...rest }: Props) {
  const { getScaleSize } = useScale();
  const fontSizeValue = getScaleSize(size ?? 20);

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
    textAlign: 'center',
  },
  regular: {
    fontWeight: '400',
  },
  semibold: {
    fontWeight: '600',
  },
});
