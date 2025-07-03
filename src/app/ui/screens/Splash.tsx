import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { initializeSessionThunk } from '@/features/auth/model/auth.slice';
import { setShowToastView } from '@/features/overlay/model/overlay.slice';
import UpdateContent from '@features/updateProgress/ui/UpdateContent.tsx';
import { UpdateProgressProps } from '@/processes/update/useUpdateProgress';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { allValuesNull, resetTo } from '@/shared/lib';

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
    if (userInfo.status === 'succeeded') {
      if (!allValuesNull(userInfo.data)) {
        resetTo('Main');
      } else if (allValuesNull(userInfo.data)) {
        resetTo('Login');
      }
    }
  }, [userInfo.status, userInfo.data]);

  const handleAuthFlow = async () => {
    try {
      await dispatch(initializeSessionThunk()).unwrap();
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
