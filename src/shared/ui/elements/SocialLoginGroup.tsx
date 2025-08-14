import { AUTH_PROVIDERS } from '@entities/auth/types';
import { useSocialLogin } from '@features/auth/hooks/useSocialLogin';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton';
import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useFetchFirstLaunchFlagQuery, useLazyGetUserInfoQuery } from '../../api/auth/authApi';
import { useAppDispatch } from '../../hooks';
import { isEmpty, isNotEmpty, resetTo } from '../../lib';

export enum SOCIAL_LOGIN_ENTRANCE {
  LOGIN = 'login',
  SETTING = 'setting',
}

interface SocialLoginGroupProps {
  entrance: SOCIAL_LOGIN_ENTRANCE;
}

const SocialLoginGroup = ({ entrance }: SocialLoginGroupProps) => {
  const { handleLogin, data, isLoading } = useSocialLogin();
  const [getUserInfo, { data: userInfo }] = useLazyGetUserInfoQuery();
  const { data: isFirstLoad } = useFetchFirstLaunchFlagQuery(undefined, {
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

  const fetchUserInfo = async () => {
    const response = await getUserInfo();
    console.log('@$>!>$@>$!@>$', response);
    if (isEmpty(response)) {
      resetTo('Nickname');
      return;
    } else {
      if (isEmpty(response.data)) {
        resetTo('Nickname');
        return;
      }
    }
    if (entrance === SOCIAL_LOGIN_ENTRANCE.LOGIN) {
      navigateInitialRoute();
    } else {
      dispatch(setShowToastView({ visibility: true, message: '로그인이 완료됐어요!' }));
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (isNotEmpty(data)) {
      fetchUserInfo();
    }
  }, [data, isLoading, dispatch, navigateInitialRoute, entrance]);

  return (
    <View className="w-full px-6 gap-3">
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
