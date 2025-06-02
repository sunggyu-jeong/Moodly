import { useEffect } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MAIN_ICONS } from '@/shared/assets/images/main';
import { resetTo } from '@/shared/lib';

const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
      resetTo('Main');
    }, 2000);
  }, []);

  return (
    <>
      <SafeAreaView className="bg-primary-300 flex-1 justify-center items-center">
        <Image source={MAIN_ICONS.logo} />
      </SafeAreaView>
    </>
  );
};

export default Splash;
