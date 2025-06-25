import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UpdateContent from '@/features/updateProgress/ui/components/UpdateContent';
import { UpdateProgressProps } from '@/processes/update/useUpdateProgress';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { isEmpty, isNotEmpty, navigate, resetTo } from '@/shared/lib';
import { initializeSessionThunk } from '../../../features/auth/model/auth.slice';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  const userInfo = useAppSelector(state => state.authSlice.userInfo);
  const dispatch = useAppDispatch();

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
    if (userInfo.status === 'succeeded' && isNotEmpty(userInfo.data)) {
      resetTo('Main');
    } else if (userInfo.status === 'failed' && isEmpty(userInfo.data)) {
      navigate('Login');
    }
  }, [userInfo.status, userInfo.data]);

  const handleAuthFlow = async () => {
    await dispatch(initializeSessionThunk());
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
