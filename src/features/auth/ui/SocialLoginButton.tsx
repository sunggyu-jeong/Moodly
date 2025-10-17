import { AUTH_PROVIDER_CONFIG } from '@/entities/auth/config';
import type { AuthProvider } from '@/entities/auth/types';
import { Label } from '@/shared';
import { isNotEmpty } from '@/shared/lib';
import { Image, TouchableOpacity, View } from 'react-native';

type SocialLoginButtonProps = {
  disabled: boolean;
  provider: AuthProvider;
  onPress: (provider: AuthProvider) => void;
};

const SocialLoginButton = ({ disabled, provider, onPress }: SocialLoginButtonProps) => {
  const { label, backgroundColor, textColor, Icon, borderColor } = AUTH_PROVIDER_CONFIG[provider];
  return (
    <View
      className="w-full h-[52px] rounded-xl bg-common-transparent"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ borderWidth: isNotEmpty(borderColor) ? 1 : 0, borderColor: borderColor }}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onPress(provider)}
        className={`flex flex-row gap-2 justify-center items-center h-full rounded-xl ${backgroundColor}`}
      >
        <Image
          className="w-6 h-6"
          source={Icon}
          resizeMode="contain"
        />
        <Label
          weight="regular"
          className={`${textColor}`}
        >
          {label}
        </Label>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButton;
