/* eslint-disable react-native/split-platform-components */
import { getApp } from '@react-native-firebase/app';
import messaging, {
  AuthorizationStatus,
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';
import { useAppDispatch } from '@shared/hooks';
import { isNotEmpty } from '@shared/lib';
import { supabase } from '@shared/lib/supabase.util';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { setAuthState, setIsLogin } from '../../auth/model/auth.slice';
export function useInitializeApp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1) Supabase 인증 상태 구독
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(
        setAuthState({
          session,
          data: session?.user ?? null,
          error: null,
        })
      );
      dispatch(setIsLogin(isNotEmpty(session?.user)));
    });

    // 2) FCM 초기화 및 토큰 갱신 리스너 등록
    let unsubscribeFCM: (() => void) | undefined;

    (async () => {
      try {
        const granted = await requestNotificationPermission();
        if (!granted) return;

        const token = await messaging().getToken();
        console.log('FCM 토큰:', token);

        unsubscribeFCM = messaging().onTokenRefresh(newToken => {
          console.log('FCM 토큰 갱신:', newToken);
        });
      } catch (err) {
        console.error('FCM 초기화 중 에러:', err);
      }
    })();

    // 3) 언마운트 시 구독 해제
    return () => {
      authSub.unsubscribe();
      unsubscribeFCM?.();
    };
  }, [dispatch]);

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
}
