/* eslint-disable react-native/split-platform-components */
import { getApp } from '@react-native-firebase/app';
import messaging, {
  AuthorizationStatus,
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';
import { useAppDispatch } from '@shared/hooks';
import { resetTo } from '@shared/lib';
import { useEffect, useRef, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import { checkNotifications, PermissionStatus } from 'react-native-permissions';

export function useNotificationPermission() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<PermissionStatus>('unavailable');
  const appState = useRef(AppState.currentState);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async nextState => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        const { status: newStatus } = await checkNotifications();
        if (newStatus !== status) {
          setStatus(newStatus);
        }
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [status]);

  const checkPermission = async () => {
    const { status: initStatus } = await checkNotifications();
    setStatus(initStatus);
  };

  const requestNotification = async () => {
    try {
      const granted = await requestNotificationPermission();
      if (!granted) {
        return;
      }

      const token = await messaging().getToken();
      console.log('FCM 토큰:', token);

      // 토큰 갱신 리스너 등록
      unsubscribeRef.current = messaging().onTokenRefresh(newToken => {
        console.log('FCM 토큰 갱신:', newToken);
      });
    } catch (err) {
      console.error('FCM 초기화 중 에러:', err);
    }
  };

  const skipPermission = () => {
    resetTo('Main');
  };

  // 언마운트 시 리스너 해제
  useEffect(
    () => () => {
      unsubscribeRef.current?.();
    },
    [dispatch]
  );

  /** platform 분기 로컬 함수 */
  async function requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      await getMessaging(getApp()).registerDeviceForRemoteMessages();
      const authStatus = await requestPermission(getMessaging(getApp()));
      return (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      );
    }
    if (typeof Platform.Version === 'number' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  return { status, requestNotification, skipPermission };
}
