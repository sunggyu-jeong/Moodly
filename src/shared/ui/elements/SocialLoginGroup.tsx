import { AUTH_PROVIDERS } from '@entities/auth/types';
import { UserMetaDTO } from '@entities/auth/User.scheme';
import { useSocialLogin } from '@features/auth/hooks/useSocialLogin';
import SocialLoginButton from '@features/auth/ui/SocialLoginButton';
import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useLazyGetUserInfoQuery, useSaveFirstLaunchFlagMutation } from '../../api/auth/authApi';
import { useAppDispatch } from '../../hooks';
import { isEmpty, isNotEmpty, navigate, resetTo } from '../../lib';

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
  const [saveFirstLaunchFlag] = useSaveFirstLaunchFlagMutation();

  const fetchUserInfo = async () => {
    const response = await getUserInfo();
    if (isEmpty(response)) {
      navigate('Nickname');
      return;
    } else {
      if (isEmpty(response.data)) {
        navigate('Nickname');
        return;
      }
    }
    const dto: UserMetaDTO = {
      userId: 'local',
      isFirstLoad: false,
      createdAt: dayjs().toDate(),
    };
    saveFirstLaunchFlag(dto);
    console.log('@!$여기서저장?', dto);
    resetTo('Main');
    dispatch(setShowToastView({ visibility: true, message: '로그인이 완료됐어요!' }));
  };

  useEffect(() => {
    if (isLoading) return;
    if (isNotEmpty(data)) {
      fetchUserInfo();
    }
  }, [data, isLoading, dispatch, entrance]);

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
