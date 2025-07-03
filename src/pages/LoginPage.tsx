import { AUTH_PROVIDERS, AuthProvider } from '@entities/auth/types.ts';
import { useSignInAppleMutation, useSignInGoogleMutation } from '@shared/api/auth/authApi.ts';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { getScaleSize, useAppDispatch } from '@shared/hooks';
import { isNotEmpty, resetTo } from '@shared/lib';
import { primary } from '@shared/styles/colors.ts';
import { H3 } from '@shared/ui/typography/H3.tsx';
import { Title } from '@shared/ui/typography/Title.tsx';
import { useEffect } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton.tsx';

const Login = () => {
  const [signInGoogle, { data: googleData, isLoading: isGoogleLoading }] =
    useSignInGoogleMutation();
  const [signInApple, { data: appleData, isLoading: isAppleLoading }] = useSignInAppleMutation();
  const dispatch = useAppDispatch();
  const handleLogin = async (provider: AuthProvider) => {
    if (provider === AUTH_PROVIDERS.APPLE) {
      await signInApple();
    } else if (provider === AUTH_PROVIDERS.GOOGLE) {
      await signInGoogle();
    }
  };

  useEffect(() => {
    if (isGoogleLoading || isAppleLoading) return;

    if (isNotEmpty(googleData) || isNotEmpty(appleData)) {
      resetTo('Main');
    }
  }, [googleData, appleData, isAppleLoading, isGoogleLoading, dispatch]);

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <View className="flex justify-center items-center">
        <Image
          source={MAIN_ICONS.avatar}
          className="aspect-square"
          style={styles.imageStyle}
        />
        <Title
          weight="semibold"
          style={styles.textStyle}
        >
          Moodly
        </Title>
        <H3
          weight="regular"
          style={styles.textStyle}
        >
          마음을 돌보는 첫걸음
        </H3>
      </View>
      <View className="absolute bottom-11 w-full gap-3">
        {Platform.OS === 'ios' && (
          <SocialLoginButton
            disabled={isAppleLoading || isGoogleLoading}
            provider={AUTH_PROVIDERS.APPLE}
            onPress={handleLogin}
          />
        )}
        <SocialLoginButton
          disabled={isAppleLoading || isGoogleLoading}
          provider={AUTH_PROVIDERS.GOOGLE}
          onPress={handleLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: getScaleSize(138),
    width: getScaleSize(138),
  },
  textStyle: {
    color: primary[300],
  },
});

export default Login;
