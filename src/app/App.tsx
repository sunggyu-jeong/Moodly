/* eslint-disable */
import { NavigationContainer } from '@react-navigation/native';
import 'dayjs/locale/ko';
import { useCallback, type ProfilerOnRenderCallback } from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import '../../global.css';

import { RootStack } from '@/app/navigation';
import { store } from '@/app/store';
import { useUpsertPushTokenMutation } from '@/entities/auth/api/auth.api';
// import { HotUpdater, getUpdateSource } from '@hot-updater/react-native';
import OverlayManager from '@/processes/overlay/ui/OverlayManager';
import { isEmpty, navigationRef, useNotificationPermission } from '@/shared';
import '@/shared/lib/day.util';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  const [updateFcmToken] = useUpsertPushTokenMutation();

  const onTokenUpdate = useCallback(
    async (token: string | null) => {
      try {
        if (isEmpty(token)) return;
        await updateFcmToken({ token }).unwrap();
        console.log('App.tsx: 서버 토큰 업데이트 성공');
      } catch (error) {
        console.error('App.tsx: 서버 토큰 업데이트 실패', error);
      }
    },
    [updateFcmToken]
  );

  useNotificationPermission({
    setupListeners: true,
    onTokenUpdate: onTokenUpdate,
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.appContainer}>
        <Provider store={store}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <RootStack />
              <OverlayManager />
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

export default App;