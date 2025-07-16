import { useGetFirstLoadStatusQuery } from '@shared/api/auth/authApi.ts';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { getScaleSize } from '@shared/hooks';
import { isNotEmpty, resetTo } from '@shared/lib';
import { primary } from '@shared/styles/colors.ts';
import SocialLoginGroup from '@shared/ui/elements/SocialLoginGroup';
import { H3 } from '@shared/ui/typography/H3.tsx';
import { Title } from '@shared/ui/typography/Title.tsx';
import { useCallback, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSocialLogin } from '../features/auth/hooks/useSocialLogin';
import { Body1 } from '../shared/ui/typography/Body1';

const Login = () => {
  const scaleSize = useMemo(() => getScaleSize(214), []);
  const { data: isFirstLoad, isLoading: isFirstLoadLoading } = useGetFirstLoadStatusQuery();

  const { data: loginResult, isLoading: isLoginLoading } = useSocialLogin();

  const navigateInitialRoute = useCallback(() => {
    if (isFirstLoad) {
      resetTo('NotificationPermissionPage');
    } else {
      resetTo('Main');
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (isFirstLoadLoading || isLoginLoading) return;
    if (isNotEmpty(loginResult)) {
      navigateInitialRoute();
    }
  }, [isFirstLoadLoading, isLoginLoading, navigateInitialRoute, loginResult]);

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
        <SocialLoginGroup />
        <Body1
          weight="regular"
          onPress={() => resetTo('Main')}
        >
          게스트로 시작하기
        </Body1>
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
