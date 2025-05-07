import { useEffect } from 'react';
import { Image, View } from 'react-native';

import { resetTo } from '@/shared/lib';

import { MAIN_ICONS } from '../shared/assets/images/main';

const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
      resetTo('Main');
    }, 2000);
  }, []);

  return (
    <View className="bg-primary-300 flex-1 justify-center items-center">
      <Image source={MAIN_ICONS.logo} />
    </View>
  );
};

export default Splash;
