import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UpdateContent from '@/features/updateProgress/ui/components/UpdateContent';
import { UpdateProgressProps } from '@/processes/update/useUpdateProgress';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { resetTo } from '@/shared/lib';

const Splash = ({ status, progress }: UpdateProgressProps) => {
  useEffect(() => {
    if (status === 'UPDATE_PROCESS_COMPLETED') {
      setTimeout(() => {
        resetTo('Main');
      }, 2000);
    }
  }, [status]);

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
