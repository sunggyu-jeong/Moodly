import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSupabaseAuth } from '@/features/auth/hooks/useSupabaseAuth';
import UpdateContent from '@/features/updateProgress/ui/components/UpdateContent';
import { UpdateProgressProps } from '@/processes/update/useUpdateProgress';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useAppSelector } from '@/shared/hooks';
import { isEmpty, navigate, resetTo } from '@/shared/lib';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  useSupabaseAuth();
  const userInfo = useAppSelector(state => state.authSlice.userInfo);

  useEffect(() => {
    if (status === 'UPDATE_PROCESS_COMPLETED') {
      setTimeout(() => {
        handleAuthFlow();
      }, 2000);
    }
  }, [status]);

  const handleAuthFlow = () => {
    if (userInfo.status === 'succeeded' && userInfo.data) {
      resetTo('Main');
    } else if (isEmpty(userInfo.data)) {
      navigate('Login');
    }
  };

  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
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
