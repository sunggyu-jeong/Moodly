import { useLazyGetUserInfoQuery } from '@entities/auth/api/auth.api';
import { useUpdateFirstLaunchFlagMutation } from '@entities/auth/api/user-meta.api';
import { AUTH_PROVIDERS } from '@entities/auth/types';
import { useSocialLogin } from '@features/auth/hooks/useSocialLogin';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton';
import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import { useAppDispatch } from '@shared/hooks';
import { isEmpty, isNotEmpty, navigate, resetTo } from '@shared/lib';
import { initUserId } from '@shared/lib/user.util';
import { gray } from '@shared/styles/colors';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Caption } from '../typography/Caption';

export enum SOCIAL_LOGIN_ENTRANCE {
  LOGIN = 'login',
  SETTING = 'setting',
}

interface SocialLoginGroupProps {
  entrance: SOCIAL_LOGIN_ENTRANCE;
}

const SocialLoginGroup = ({ entrance }: SocialLoginGroupProps) => {
  const { handleLogin, data, isLoading } = useSocialLogin();
  const [getUserInfo] = useLazyGetUserInfoQuery();
  const dispatch = useAppDispatch();
  const [saveFirstLaunchFlag] = useUpdateFirstLaunchFlagMutation();

  const fetchUserInfo = async () => {
    const response = await getUserInfo();
    await initUserId();
    if (isEmpty(response)) {
      navigate('Nickname');
      return;
    } else {
      if (isEmpty(response.data)) {
        navigate('Nickname');
        return;
      }
    }
    saveFirstLaunchFlag({ isFirstLoad: false });
    resetTo('Main');
    dispatch(setShowToastView({ visibility: true, message: '로그인이 완료됐어요!' }));
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isNotEmpty(data)) {
      fetchUserInfo();
    }
  }, [data, isLoading, dispatch, entrance]);

  return (
    <View className="w-full px-9 gap-3 items-center">
      {Platform.OS === 'ios' && (
        <SocialLoginButton
          disabled={isLoading}
          provider={AUTH_PROVIDERS.APPLE}
          onPress={() => handleLogin(AUTH_PROVIDERS.APPLE)}
        />
      )}
      <SocialLoginButton
        disabled={isLoading}
        provider={AUTH_PROVIDERS.GOOGLE}
        onPress={() => handleLogin(AUTH_PROVIDERS.GOOGLE)}
      />
      <View className="mt-6">
        <Caption
          weight="regular"
          style={styles.captionText}
        >
          로그인 시{' '}
          <Text
            style={styles.textUnderline}
            onPress={() => {}}
          >
            이용약관
          </Text>
          과{' '}
          <Text
            style={styles.textUnderline}
            onPress={() => {}}
          >
            개인정보 처리 방침
          </Text>
          에 동의하게 됩니다
        </Caption>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  captionText: {
    color: gray[400],
  },
  textUnderline: {
    color: gray[400],
    textDecorationLine: 'underline',
  },
});

export default SocialLoginGroup;
