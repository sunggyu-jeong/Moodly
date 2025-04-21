import { Text, TextProps } from 'react-native';

export type TypographyVariant = 
  | 'h1'
  | 'h2'
  | 'body'
  | 'caption';

interface TypographyAtomProps extends TextProps {
  variant?: TypographyVariant;
}
const VARIANT_STYLES: Record<TypographyVariant, { fontSize: number; lineHeight: number; className: string }> = {
  h1:      { fontSize: 24, lineHeight: 32, className: 'font-bold' },
  h2:      { fontSize: 20, lineHeight: 28, className: 'font-semibold' },
  body:    { fontSize: 16, lineHeight: 24, className: 'font-normal' },
  caption: { fontSize: 12, lineHeight: 16, className: 'font-light' },
};

const TypographyAtom = ({
  variant = 'body',
  style,
  className,
  children,
  ...rest
}: TypographyAtomProps) => {
  const vs = VARIANT_STYLES[variant];
  return (
    <Text
      {...rest}
      numberOfLines={1}
      className={`${vs.className} tracking-[-0.5px] ${className || ''}`}
      style={[{ fontSize: vs.fontSize, lineHeight: vs.lineHeight }, style]}
    >
      {children}
    </Text>
  );
};

export default TypographyAtom;