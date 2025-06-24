import { AUTH_PROVIDERS, AuthProvider } from '@/entities/auth/types';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { AsyncStatus } from '@/shared/constants';
import { getScaleSize, useAppDispatch, useAppSelector } from '@/shared/hooks';
import { primary } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';
import { Title } from '@/shared/ui/typography/Title';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { signInGoogleThunk } from '../../model/auth.slice';
import SocialLoginButton from '../components/SocialLoginButton';
import { setShowToastView } from '../../../overlay/model/overlay.slice';

const Login = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.authSlice.userInfo);
  const handleLogin = (provider: AuthProvider) => {
    dispatch(signInGoogleThunk());
  };

  useEffect(() => {
    if (userInfo.status === AsyncStatus.Succeeded && userInfo.data) {
      // Navigate to the main screen or perform any action after successful login
      console.log('User logged in:', userInfo.data);
    } else if (userInfo.status === AsyncStatus.Failed) {
      dispatch(
        setShowToastView({
          visibility: true,
          message: '로그인 요청이 실패했습니다. 다시 시도해주세요.',
        })
      );
    }
  }, [userInfo, dispatch]);

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
        <SocialLoginButton
          provider={AUTH_PROVIDERS.APPLE}
          onPress={handleLogin}
        />
        <SocialLoginButton
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
