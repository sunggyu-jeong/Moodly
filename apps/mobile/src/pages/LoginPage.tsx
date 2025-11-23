import { useEffect, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import store from '@/app/store';
import { MODAL_CONFIRM_ACTION_KEY } from '@/entities/overlay/model/types';
import SocialLoginGroup, { SOCIAL_LOGIN_ENTRANCE } from '@/features/auth/ui/SocialLoginGroup';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks/useScale';
import { ENV } from '@/shared/lib/env';
import { setShowModalPopup } from '@/shared/model/overlaySlice';
import { gray, primary } from '@/shared/styles/colors';
import { H3 } from '@/shared/ui/typography/H3';
import { Title } from '@/shared/ui/typography/Title';

const Login = () => {
  const scaleSize = useMemo(() => getScaleSize(214), []);

  useEffect(() => {
    store.dispatch(
      setShowModalPopup({
        visibility: true,
        title: '테스트',
        message: `${(ENV.SUPABASE_URL, ENV.GOOGLE_WEB_CLIENT_ID)}`,
        cancelText: '취소',
        confirmText: '삭제',
        confirmActionKey: MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY,
      }),
      // setShowToastView({
      //   visibility: true,
      //   message: err.message,
      // }),
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.content, { marginTop: scaleSize }]}>
        <Image
          source={MAIN_ICONS.avatar}
          style={styles.image}
        />
        <Title
          weight="semibold"
          style={styles.text}
        >
          Moodly
        </Title>
        <H3
          weight="regular"
          style={styles.text}
        >
          마음을 돌보는 첫걸음
        </H3>
      </View>
      <View style={styles.loginGroup}>
        <SocialLoginGroup entrance={SOCIAL_LOGIN_ENTRANCE.LOGIN} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[100],
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: getScaleSize(138),
    height: getScaleSize(138),
    aspectRatio: 1,
  },
  text: {
    color: primary[300],
  },
  loginGroup: {
    position: 'absolute',
    bottom: getScaleSize(48),
    width: '100%',
    alignItems: 'center',
    gap: getScaleSize(12),
  },
});

export default Login;
