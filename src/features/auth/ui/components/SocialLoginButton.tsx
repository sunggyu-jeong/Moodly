import { AUTH_PROVIDER_CONFIG } from '@/entities/auth/config';
import { AuthProvider } from '@/entities/auth/types';
import { Body1 } from '@/shared/ui/typography/Body1';
import { Image, TouchableOpacity, View } from 'react-native';

type SocialLoginButtonProps = {
  disabled: boolean;
  provider: AuthProvider;
  onPress: (provider: AuthProvider) => void;
};

const SocialLoginButton = ({ disabled, provider, onPress }: SocialLoginButtonProps) => {
  const { label, backgroundColor, textColor, Icon } = AUTH_PROVIDER_CONFIG[provider];
  return (
    <View className="w-full h-[52px] rounded-xl bg-common-transparent">
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onPress(provider)}
        className={`flex flex-row gap-2 justify-center items-center mx-6 h-full rounded-xl ${backgroundColor}`}
      >
        <Image
          className="w-6 h-6"
          source={Icon}
        />
        <Body1
          weight="regular"
          className={`${textColor}`}
        >
          {label}
        </Body1>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButton;
