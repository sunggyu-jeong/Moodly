import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AUTH_PROVIDER_CONFIG } from '@/entities/auth/config';
import { AuthProvider } from '@/entities/auth/types';
import { isNotEmpty } from '@/shared/lib/value.util';
import { Label } from '@/shared/ui/typography/Label';

type SocialLoginButtonProps = {
  disabled: boolean;
  provider: AuthProvider;
  onPress: (provider: AuthProvider) => void;
};

const SocialLoginButton = ({ disabled, provider, onPress }: SocialLoginButtonProps) => {
  const { label, backgroundColor, textColor, Icon, borderColor } = AUTH_PROVIDER_CONFIG[provider];
  return (
    <View
      style={[
        styles.StyledContainer,
        { borderWidth: isNotEmpty(borderColor) ? 1 : 0, borderColor: borderColor },
      ]}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onPress(provider)}
        style={[styles.StyledButton, { backgroundColor }]}
      >
        <Image
          style={styles.StyledIcon}
          source={Icon}
          resizeMode="contain"
        />
        <Label
          weight="regular"
          style={{ color: textColor }}
        >
          {label}
        </Label>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  StyledContainer: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  StyledButton: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 12,
  },
  StyledIcon: {
    width: 24,
    height: 24,
  },
});
