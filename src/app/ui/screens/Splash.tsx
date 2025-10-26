import { useLazyGetFirstLaunchFlagQuery } from '@/entities/auth/api/user-meta.api';
import { isNotEmpty, primary, resetTo, supabase } from '@/shared';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useCallback, useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import AppBootstrap from '../../provider/AppBootstrap';

const Splash = () => {
  const [getFirstLaunchFlag] = useLazyGetFirstLaunchFlagQuery();

  const flag = useCallback(async () => {
    const response = await getFirstLaunchFlag();
    if (response.data) {
      resetTo('Onboarding');
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (isNotEmpty(user)) {
      resetTo('Main');
    } else {
      resetTo('Login');
    }
  }, [getFirstLaunchFlag]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      flag();
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [flag]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.StyledContainer}>
        <View style={styles.StyledBox}>
          <Image source={MAIN_ICONS.logo} />
        </View>
      </SafeAreaView>
      <AppBootstrap />
    </>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primary[300],
  },
  StyledBox: {
    position: 'absolute',
  },
});

export default Splash;
