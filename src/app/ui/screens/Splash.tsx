import { initRealm, isNotEmpty, resetTo, useLazyFetchFirstLaunchFlagQuery, useLazyInitializeSessionQuery } from "@/shared";
import { UpdateContent } from "@features/update-progress/updateProgress";
import { UpdateProgressProps } from "@processes/update/useUpdateProgress";
import { MAIN_ICONS } from "@shared/assets/images/main";
import { useEffect } from "react";
import { Image, SafeAreaView, StatusBar } from "react-native";


const Splash = ({ status, progress }: UpdateProgressProps) => {
  const [initSession] = useLazyInitializeSessionQuery();
  const [getFirstLaunchFlag] = useLazyFetchFirstLaunchFlagQuery();

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
