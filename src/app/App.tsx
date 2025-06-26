/* eslint-disable */
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ProfilerOnRenderCallback } from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { navigationRef } from '@/shared/lib';
import '../../global.css';

import { HOT_UPDATER_SUPABASE_URL } from '@env';
import { HotUpdater, getUpdateSource } from '@hot-updater/react-native';
import React from 'react';
import { useInitializeApp } from '../features/global/hooks/useInitializeApp';
import { UpdateProgressProps } from '../processes/update/useUpdateProgress';
import RootStack from './navigation/RootStack';
import store from './store';
import Splash from './ui/screens/Splash';

dayjs.locale('ko');

enableScreens();

//TEST: - 랜더링 테스트 로그 코드
export const onRenderCallback: ProfilerOnRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  console.log(
    `onRenderCallback: ${id}, phase: ${phase}, actualDuration: ${actualDuration}, baseDuration: ${baseDuration}, startTime: ${startTime}, commitTime: ${commitTime}`
  );
};

function App() {
  useInitializeApp();
  return (
    <Provider store={store}>
      {/* <RealmProvider> */}
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
      {/* </RealmProvider> */}
    </Provider>
  );
}

const FallbackComponent = React.memo(({ status, progress }: UpdateProgressProps) => {
  return (
    <Splash
      status={status}
      progress={progress * 100}
    />
  );
});

export default HotUpdater.wrap({
  source: getUpdateSource(`${HOT_UPDATER_SUPABASE_URL}/functions/v1/update-server`, {
    updateStrategy: 'fingerprint',
  }),
  fallbackComponent: FallbackComponent,
})(App);
