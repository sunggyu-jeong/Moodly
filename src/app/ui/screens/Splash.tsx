import UpdateContent from '@features/updateProgress/ui/UpdateContent.tsx';
import { UpdateProgressProps } from '@processes/update/useUpdateProgress';
import { useLazyInitializeSessionQuery } from '@shared/api/auth/authApi';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { isNotEmpty, resetTo } from '@shared/lib';
import { initRealm } from '@shared/lib/realm-client.util';
import { useCallback, useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  const [initSession, { data, isLoading }] = useLazyInitializeSessionQuery();

  const handleAuthFlow = useCallback(async () => {
    await initSession();
  }, [initSession]);

  useEffect(() => {
    // 1) Realm 초기화
    initRealm();
    let timer: NodeJS.Timeout | undefined;
    // 2) 업데이트가 완료된 뒤에만 로직 실행
    if (status === 'UPDATE_PROCESS_COMPLETED') {
      timer = setTimeout(handleAuthFlow, 2000);
    }

    // 3) 2초 뒤에 인증 요청

    return () => {
      if (isNotEmpty(timer)) clearTimeout(timer);
    };
  }, [status, handleAuthFlow]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
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
