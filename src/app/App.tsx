/* eslint-disable */
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Profiler, ProfilerOnRenderCallback } from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { navigationRef } from '@/shared/lib';
import '../../global.css';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import RootStack from './navigation/RootStack';
import store from './store';

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

export default function App() {
  return (
    <Provider store={store}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </KeyboardProvider>
    </Provider>
  );
}
