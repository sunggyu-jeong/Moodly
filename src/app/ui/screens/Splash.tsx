import { useLazyGetFirstLaunchFlagQuery } from '@entities/auth/api/user-meta.api';
import { UpdateContent } from '@features/update-progress/updateProgress';
import { isNotEmpty, resetTo, supabase } from '@shared';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { useCallback } from 'react';
import { Image, SafeAreaView, StatusBar, View } from 'react-native';

import {
  type UpdateProgressMent,
  type UpdateProgressStatus,
  useUpdateProgress,
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

  const { status, progress, ment } = useUpdateProgress(flag);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
      />
      <SafeAreaView className="bg-primary-300 flex-1 justify-center items-center">
        <View className="absolute">
          <Image source={MAIN_ICONS.logo} />
        </View>

        <View className="absolute bottom-12 w-full gap-3 items-center">
          <UpdateContent
            progress={progress}
            status={status}
            ment={ment}
          />
        </View>
      </SafeAreaView>

      <AppBootstrap />
    </>
  );
};

export default Splash;
