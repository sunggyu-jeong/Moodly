/* eslint-disable */
import messaging, {
  AuthorizationStatus,
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ProfilerOnRenderCallback, useEffect } from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';

import { navigationRef } from '@/shared/lib';
import '../../global.css';

import { HotUpdater, getUpdateSource } from '@hot-updater/react-native';
import { getApp } from '@react-native-firebase/app';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import RootStack from './navigation/RootStack';
import store from './store';
import { HOT_UPDATER_SUPABASE_URL } from '@env';

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

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    await getMessaging(getApp()).registerDeviceForRemoteMessages();
    const authStatus = await requestPermission(getMessaging(getApp()));
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;
    return enabled;
  }
  // Android
  if (typeof Platform.Version === 'number' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

function App() {
  useEffect(() => {
    let unsubscribeTokenRefresh: (() => void) | undefined;

    // 1) FCM 초기화 로직을 명명된 함수로 분리
    const initFCM = async () => {
      try {
        console.log('>>>>>> 권한 요청 시작');
        const granted = await requestNotificationPermission();
        console.log('>>>>>> 권한 요청 결과:', granted ? '허용됨' : '거부됨');

        if (!granted) {
          console.log('알림 권한 거부됨 — 더 이상 진행하지 않습니다.');
          return;
        }

        // 2) FCM 토큰 발급
        const token = await messaging().getToken();
        console.log('FCM 토큰:', token);

        // 3) 토큰 갱신 리스너 등록
        unsubscribeTokenRefresh = messaging().onTokenRefresh(newToken => {
          console.log('FCM 토큰 갱신:', newToken);
        });
      } catch (error) {
        console.error('FCM 초기화 중 에러:', error);
      }
    };

    // 4) 분리된 함수 호출
    initFCM();

    // 5) 언마운트 시 리스너 정리
    return () => {
      unsubscribeTokenRefresh?.();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default HotUpdater.wrap({
  source: getUpdateSource(`${HOT_UPDATER_SUPABASE_URL}/functions/v1/update-server`, {
    updateStrategy: 'fingerprint',
  }),
  fallbackComponent: ({ progress, status }) => (
    <View
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >

      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
        {status === 'UPDATING' ? 'Updating...' : 'Checking for Update...'}
      </Text>
      {progress > 0 ? (
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </View>
  ),
})(App);
