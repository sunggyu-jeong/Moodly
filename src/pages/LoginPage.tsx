import { AUTH_PROVIDERS, AuthProvider } from '@entities/auth/types.ts';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton.tsx';
import {
  useGetFirstLoadStatusQuery,
  useSignInAppleMutation,
  useSignInGoogleMutation,
} from '@shared/api/auth/authApi.ts';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { getScaleSize } from '@shared/hooks';
import { isNotEmpty, resetTo } from '@shared/lib';
import { primary } from '@shared/styles/colors.ts';
import { H3 } from '@shared/ui/typography/H3.tsx';
import { Title } from '@shared/ui/typography/Title.tsx';
import { useCallback, useEffect, useMemo } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Body1 } from '../shared/ui/typography/Body1';

const Login = () => {
  const [signInGoogle, { data: googleData, isLoading: isGoogleLoading }] =
    useSignInGoogleMutation();
  const [signInApple, { data: appleData, isLoading: isAppleLoading }] = useSignInAppleMutation();
  const { data: isFirstLoad, isLoading: isFirstLoadLoading } = useGetFirstLoadStatusQuery();
  const scaleSize = useMemo(() => getScaleSize(214), []);
  const handleLogin = async (provider: AuthProvider) => {
    if (provider === AUTH_PROVIDERS.APPLE) {
      await signInApple();
    } else if (provider === AUTH_PROVIDERS.GOOGLE) {
      await signInGoogle();
    }
  };
  const navigateInitialRoute = useCallback(() => {
    if (isFirstLoad) {
      resetTo('NotificationPermissionPage');
    } else {
      resetTo('Main');
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (isFirstLoadLoading || isGoogleLoading || isAppleLoading) return;

    if (isNotEmpty(googleData) || isNotEmpty(appleData)) {
      navigateInitialRoute();
    }
  }, [
    googleData,
    appleData,
    isAppleLoading,
    isGoogleLoading,
    isFirstLoad,
    isFirstLoadLoading,
    navigateInitialRoute,
  ]);

  return (
    <View className="flex-1 bg-gray-100 items-center">
      <View
        className="flex items-center"
        style={{ marginTop: scaleSize }}
      >
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
      <View className="absolute bottom-12 w-full gap-3 items-center">
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
        <TouchableOpacity>
          <Body1
            weight="regular"
            onPress={navigateInitialRoute}
          >
            게스트로 시작하기
          </Body1>
        </TouchableOpacity>
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
