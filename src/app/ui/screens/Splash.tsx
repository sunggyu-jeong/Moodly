import { useLazyGetFirstLaunchFlagQuery } from '@entities/auth/api/user-meta.api';
import { UpdateContent } from '@features/update-progress/updateProgress';
import type { UpdateProgressProps } from '@processes/update/useUpdateProgress';
import { isNotEmpty, resetTo, supabase } from '@shared';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { useCallback, useEffect } from 'react';
import { Image, SafeAreaView, StatusBar } from 'react-native';

import AppBootstrap from '../../provider/AppBootstrap';

const Splash = ({ status, progress }: UpdateProgressProps) => {
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
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (status === 'UPDATE_PROCESS_COMPLETED') {
      timer = setTimeout(flag, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [status, flag]);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
      />
      <SafeAreaView className="bg-primary-300 flex-1 justify-center items-center">
        <Image source={MAIN_ICONS.logo} />
        <UpdateContent
          progress={progress}
          status={status}
        />
      </SafeAreaView>
      <AppBootstrap />
    </>
  );
};

export default Splash;
