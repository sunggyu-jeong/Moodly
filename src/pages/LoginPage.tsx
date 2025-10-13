import { getScaleSize, H3, primary, SOCIAL_LOGIN_ENTRANCE, SocialLoginGroup, Title } from '@/shared';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Login = () => {
  const scaleSize = useMemo(() => getScaleSize(214), []);

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
        <SocialLoginGroup entrance={SOCIAL_LOGIN_ENTRANCE.LOGIN} />
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
