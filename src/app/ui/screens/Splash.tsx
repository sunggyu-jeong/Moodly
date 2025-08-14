import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UpdateContent from '@features/updateProgress/ui/UpdateContent.tsx';
import { UpdateProgressProps } from '@processes/update/useUpdateProgress';
import {
  useLazyFetchFirstLaunchFlagQuery,
  useLazyInitializeSessionQuery,
} from '@shared/api/auth/authApi';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { isNotEmpty, resetTo } from '@shared/lib';
import { initRealm } from '@shared/lib/realm-client.util';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  const [initSession, { data, isLoading }] = useLazyInitializeSessionQuery();
  const [getFirstLaunchFlag, { data: isFirstLoad }] = useLazyFetchFirstLaunchFlagQuery();

  useEffect(() => {
    // 1) Realm 초기화
    initRealm();
    // 2) 업데이트가 완료된 뒤에만 로직 실행
    if (status !== 'UPDATE_PROCESS_COMPLETED') return;

    // 3) 2초 뒤에 인증 요청
    const timer = setTimeout(flag, 2000);
    return () => clearTimeout(timer);
  }, [status]);
  const flag = async () => {
    const response = await getFirstLaunchFlag();
    if (response.data) {
      resetTo('Onboarding');
      return;
    }
    const res = await initSession();
    console.log('!@>$>!@>$', data);
    if (isNotEmpty(res.data)) {
      resetTo('Main');
    } else {
      resetTo('Login');
    }
  };

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
