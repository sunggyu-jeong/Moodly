import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useLazyGetUserInfoQuery } from '@/entities/auth/api';
import { AUTH_PROVIDERS } from '@/entities/auth/model/types';
import { useUpdateFirstLaunchFlagMutation } from '@/entities/user-meta/api';
import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';
import SocialLoginButton from '@/features/auth/ui/SocialLoginButton';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { useExternalWebSite } from '@/shared/hooks/useOpenChat';
import { ENV } from '@/shared/lib/env';
import { navigate, resetTo } from '@/shared/lib/navigation.util';
import { initUserId, isIphone } from '@/shared/lib/user.util';
import { isEmpty, isNotEmpty } from '@/shared/lib/value.util';
import { setShowToastView } from '@/shared/model/overlaySlice';
import { gray } from '@/shared/styles/colors';
import { Caption } from '@/shared/ui/typography/Caption';

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
  const { openLink } = useExternalWebSite();
  const { PRIVACY_POLICY_LINK, TERMS_OF_SERVICE_LINK } = ENV;

  const fetchUserInfo = useCallback(async () => {
    const response = await getUserInfo();
    await initUserId();

    if (isEmpty(response) || isEmpty((response as any).data)) {
      navigate('Nickname');
      return;
    }

    saveFirstLaunchFlag({ isFirstLoad: false });
    resetTo('Main');
    dispatch(setShowToastView({ visibility: true, message: '로그인이 완료됐어요!' }));
  }, [dispatch, getUserInfo, saveFirstLaunchFlag]);

  useEffect(() => {
    if (!isLoading && isNotEmpty(data)) {
      fetchUserInfo();
    }
  }, [data, isLoading, dispatch, entrance, fetchUserInfo]);

  return (
    <View style={styles.container}>
      {isIphone() && (
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
      <View style={styles.noticeContainer}>
        <Caption
          weight="regular"
          style={styles.captionText}
        >
          로그인 시{' '}
          <Text
            style={styles.textUnderline}
            onPress={() => openLink(TERMS_OF_SERVICE_LINK)}
          >
            이용약관
          </Text>
          과{' '}
          <Text
            style={styles.textUnderline}
            onPress={() => openLink(PRIVACY_POLICY_LINK)}
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
  container: {
    width: '100%',
    paddingHorizontal: 36,
    gap: 12,
    alignItems: 'center',
  },
  noticeContainer: {
    marginTop: 24,
  },
  captionText: {
    color: gray[400],
    textAlign: 'center',
  },
  textUnderline: {
    color: gray[400],
    textDecorationLine: 'underline',
  },
});

export default SocialLoginGroup;
