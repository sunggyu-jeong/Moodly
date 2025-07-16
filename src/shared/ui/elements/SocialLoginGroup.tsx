import { AUTH_PROVIDERS } from '@entities/auth/types';
import { useSocialLogin } from '@features/auth/hooks/useSocialLogin';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton';
import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useGetFirstLoadStatusQuery } from '../../api/auth/authApi';
import { useAppDispatch } from '../../hooks';
import { isNotEmpty, resetTo } from '../../lib';

export enum SOCIAL_LOGIN_ENTRANCE {
  LOGIN = 'login',
  SETTING = 'setting',
}

interface SocialLoginGroupProps {
  entrance: SOCIAL_LOGIN_ENTRANCE;
}

const SocialLoginGroup = ({ entrance }: SocialLoginGroupProps) => {
  const { handleLogin, data, isLoading } = useSocialLogin();
  const { data: isFirstLoad } = useGetFirstLoadStatusQuery(undefined, {
    skip: entrance !== SOCIAL_LOGIN_ENTRANCE.LOGIN,
  });

  const dispatch = useAppDispatch();
  const navigateInitialRoute = useCallback(() => {
    if (isFirstLoad) {
      resetTo('NotificationPermissionPage');
    } else {
      resetTo('Main');
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (isLoading) return;
    if (isNotEmpty(data)) {
      if (entrance === SOCIAL_LOGIN_ENTRANCE.LOGIN) {
        navigateInitialRoute();
      } else {
        dispatch(setShowToastView({ visibility: true, message: '로그인이 완료됐어요!' }));
      }
    }
  }, [data, isLoading]);

  return (
    <View className="flex flex-col justify-center mt-3 gap-3 w-full">
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
    </View>
  );
};

export default SocialLoginGroup;
