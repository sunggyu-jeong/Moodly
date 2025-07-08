import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UpdateContent from '@features/updateProgress/ui/UpdateContent.tsx';
import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { UpdateProgressProps } from '@processes/update/useUpdateProgress';
import { useLazyInitializeSessionQuery } from '@shared/api/auth/authApi';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { isNotEmpty, resetTo } from '@shared/lib';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  const [initSession, { data, isLoading }] = useLazyInitializeSessionQuery();

  useEffect(() => {
    if (status === 'UPDATE_PROCESS_COMPLETED') {
      const timer = setTimeout(() => {
        handleAuthFlow();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

  useEffect(() => {
    if (isLoading) return;
    if (isNotEmpty(data)) {
      resetTo('Main');
    }
  }, [data, isLoading]);

  const handleAuthFlow = async () => {
    try {
      await initSession();
    } catch (e) {
      setShowToastView({ visibility: true, message: e as string });
    }
  };

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
      />
      <SafeAreaView className="bg-primary-300 flex-1 justify-center items-center">
        <Image source={MAIN_ICONS.avatar} />
        <UpdateContent
          progress={progress}
          status={status}
        />
      </SafeAreaView>
    </>
  );
};

export default Splash;
