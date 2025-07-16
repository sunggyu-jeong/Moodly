import { AUTH_PROVIDERS } from '@entities/auth/types';
import { useSocialLogin } from '@features/auth/hooks/useSocialLogin';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton';
import { Platform, View } from 'react-native';

const SocialLoginGroup = () => {
  const { handleLogin, isAppleLoading, isGoogleLoading } = useSocialLogin();

  return (
    <View className="flex flex-col justify-center mt-3 gap-3 w-full">
      {Platform.OS === 'ios' && (
        <SocialLoginButton
          disabled={isAppleLoading || isGoogleLoading}
          provider={AUTH_PROVIDERS.APPLE}
          onPress={() => handleLogin(AUTH_PROVIDERS.APPLE)}
        />
      )}
      <SocialLoginButton
        disabled={isAppleLoading || isGoogleLoading}
        provider={AUTH_PROVIDERS.GOOGLE}
        onPress={() => handleLogin(AUTH_PROVIDERS.GOOGLE)}
      />
    </View>
  );
};

export default SocialLoginGroup;
