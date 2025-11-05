import { MAIN_ICONS } from '@/shared/assets/images/main';
import { getScaleSize } from '@/shared/hooks/useScale';
import { gray, primary } from '@/shared/styles/colors';
import SocialLoginGroup, { SOCIAL_LOGIN_ENTRANCE } from '@/features/auth/ui/SocialLoginGroup';
import { H3 } from '@/shared/ui/typography/H3';
import { Title } from '@/shared/ui/typography/Title';
import { useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Login = () => {
  const scaleSize = useMemo(() => getScaleSize(214), []);

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
