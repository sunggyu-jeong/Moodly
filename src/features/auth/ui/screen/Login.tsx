import { AUTH_PROVIDERS, AuthProvider } from '@/entities/auth/types';
import { useSignInAppleMutation, useSignInGoogleMutation } from '@/shared/api/auth/authApi';
import { extractErrorMessage } from '@/shared/api/base';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize, useAppDispatch } from '@/shared/hooks';
import { isNotEmpty, resetTo } from '@/shared/lib';
import { primary } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';
import { Title } from '@/shared/ui/typography/Title';
import { useEffect } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { setShowToastView } from '../../../overlay/model/overlay.slice';
import SocialLoginButton from '../components/SocialLoginButton';

const Login = () => {
  const [signInGoogle, { data: googleData, isLoading: isGoogleLoading, error: googleError }] =
    useSignInGoogleMutation();
  const [signInApple, { data: appleData, isLoading: isAppleLoading, error: appleError }] =
    useSignInAppleMutation();
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
    } else if (isNotEmpty(googleError) || isNotEmpty(appleError)) {
      const errorMessage =
        extractErrorMessage(googleError) ??
        extractErrorMessage(appleError) ??
        '로그인 요청이 실패했습니다.';
      dispatch(
        setShowToastView({
          message: errorMessage,
          visibility: true,
        })
      );
    } else {
      dispatch(
        setShowToastView({
          message: '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
          visibility: true,
        })
      );
    }
  }, [googleData, appleData, googleError, appleError, isAppleLoading, isGoogleLoading, dispatch]);

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
