import { useCallback, useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UpdateContent from '@features/updateProgress/ui/UpdateContent.tsx';
import { UpdateProgressProps } from '@processes/update/useUpdateProgress';
import { useLazyInitializeSessionQuery } from '@shared/api/auth/authApi';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { isNotEmpty, resetTo } from '@shared/lib';
import { initRealm } from '@shared/lib/realm-client.util';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  const [initSession, { data, isLoading }] = useLazyInitializeSessionQuery();

  const handleAuthFlow = useCallback(async () => {
    await initSession();
  }, [initSession]);

  useEffect(() => {
    initRealm();
    if (status === 'UPDATE_PROCESS_COMPLETED') {
      const timer = setTimeout(() => {
        handleAuthFlow();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [status, handleAuthFlow]);

  useEffect(() => {
    if (isLoading) return;
    if (isNotEmpty(data)) {
      resetTo('Main');
    }
  }, [data, isLoading]);

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
    </>
  );
};

export default Splash;
