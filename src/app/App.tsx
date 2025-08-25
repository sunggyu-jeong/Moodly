/* eslint-disable */
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { ProfilerOnRenderCallback } from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { navigationRef } from '@shared/lib';
import '../../global.css';

import { RootStack } from '@app/navigation';
import { store } from '@app/store';
import { HOT_UPDATER_SUPABASE_URL } from '@env';
import { HotUpdater, getUpdateSource } from '@hot-updater/react-native';
import { useNotificationPermission } from '@shared/hooks/useNotificationPermission';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FallbackUI from './ui/screens/FallbackUI';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

enableScreens();
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = obj => JSON.parse(JSON.stringify(obj));
}

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
  useNotificationPermission();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.appContainer}>
        <Provider store={store}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </Provider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#5168DB',
  },
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
});

export default HotUpdater.wrap({
  source: getUpdateSource(`${HOT_UPDATER_SUPABASE_URL}/functions/v1/update-server`, {
    updateStrategy: 'fingerprint',
  }),
  fallbackComponent: FallbackUI,
})(App);