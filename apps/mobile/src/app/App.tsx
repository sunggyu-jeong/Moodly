/* eslint-disable */
import * as amplitude from '@amplitude/analytics-react-native';
import { SessionReplayPlugin } from '@amplitude/plugin-session-replay-react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'dayjs/locale/ko';
import { useCallback, useEffect, type ProfilerOnRenderCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { registerLogoutHandler } from '@/app/bootstrap/registerLogoutHandler';
import RootStack from '@/app/navigation/RootStack';
import OverlayProvider from '@/app/provider/OverlayProvider';
import { store } from '@/app/store';
import { useUpsertPushTokenMutation } from '@/entities/auth/api';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import '@/shared/lib/day.util';
import { navigationRef } from '@/shared/lib/navigation.util';
import { supabase } from '@/shared/lib/supabase.util';
import { isEmpty } from '@/shared/lib/value.util';
import { useFonts } from 'expo-font';

enableScreens();
registerLogoutHandler();

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
  commitTime: number,
) => {
  console.log(
    `onRenderCallback: ${id}, phase: ${phase}, actualDuration: ${actualDuration}, baseDuration: ${baseDuration}, startTime: ${startTime}, commitTime: ${commitTime}`,
  );
};

function App() {
  const [updateFcmToken] = useUpsertPushTokenMutation();
  useFonts({
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
  });

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
    [updateFcmToken],
  );

  useNotificationPermission({
    setupListeners: true,
    onTokenUpdate: onTokenUpdate,
  });

  useEffect(() => {
    let authListener: { unsubscribe: () => void } | null = null;
    const initializeAmplitude = async () => {
      try {
        console.log('Amplitude 초기화를 시작합니다...');
        const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

        if (!apiKey) {
          console.warn('Amplitude API Key가 없습니다.');
          return;
        }

        await amplitude.init(apiKey).promise;

        const sessionReplayPlugin = new SessionReplayPlugin({
          sampleRate: process.env.APP_ENV === 'devleop' ? 1 : 0.1,
        });
        await amplitude.add(sessionReplayPlugin).promise;

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          console.log('기존 유저 감지:', user.email);
          amplitude.setUserId(user.email);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user?.email) {
            console.log('로그인 감지: Amplitude User ID 설정');
            amplitude.setUserId(session.user.email);
          } else if (event === 'SIGNED_OUT') {
            console.log('로그아웃 감지: Amplitude Reset');
            amplitude.reset();
          }
        });

        authListener = subscription;
        console.log('Amplitude 초기화 및 세션 리플레이 설정 완료.');
      } catch (error) {
        console.error('Amplitude 초기화 중 에러가 발생했습니다:', error);
      }
    };

    initializeAmplitude();

    // Cleanup: 리스너 해제
    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.appContainer}>
        <Provider store={store}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <RootStack />
              <OverlayProvider />
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
