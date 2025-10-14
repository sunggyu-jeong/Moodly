import { useLazyGetFirstLaunchFlagQuery } from '@/entities/auth/api/user-meta.api';
import { isNotEmpty, resetTo, supabase } from '@/shared';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useCallback, useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, View } from 'react-native';

import {
  type UpdateProgressMent,
  type UpdateProgressStatus,
} from '../../navigation/hooks/useUpdateProgress';
import AppBootstrap from '../../provider/AppBootstrap';

export interface SplashProps {
  status: UpdateProgressStatus;
  progress: number;
  ment: UpdateProgressMent;
}
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
      <SafeAreaView className="bg-primary-300 flex-1 justify-center items-center">
        <View className="absolute">
          <Image source={MAIN_ICONS.logo} />
        </View>
      </SafeAreaView>

      <AppBootstrap />
    </>
  );
};

export default Splash;
