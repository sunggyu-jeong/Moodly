import { getApp } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import { resetTo } from '@shared/lib';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, PermissionsAndroid, Platform } from 'react-native';
import { checkNotifications, type PermissionStatus } from 'react-native-permissions';

const app = getApp();
const msg = getMessaging(app);

export function useNotificationPermission() {
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
        if (newStatus !== status) setStatus(newStatus);
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
      if (!granted) return false;

      const token = await getToken(msg);
      console.log('FCM 토큰:', token);

      unsubscribeRef.current = onTokenRefresh(msg, newToken => {
        console.log('FCM 토큰 갱신:', newToken);
      });
      return true;
    } catch (err) {
      console.error('FCM 초기화 중 에러:', err);
      return false;
    }
  };

  const skipPermission = () => {
    resetTo('Main');
  };

  useEffect(
    () => () => {
      unsubscribeRef.current?.();
    },
    [],
  );

  async function ensureRegisteredForRemoteMessagesIOS() {
    if (Platform.OS !== 'ios') return;
    if (!isDeviceRegisteredForRemoteMessages(msg)) {
      await registerDeviceForRemoteMessages(msg);
    }
  }

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  async function requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      await ensureRegisteredForRemoteMessagesIOS();
      const authStatus = await requestPermission(msg);
      return (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      );
    }
    // Android 13+ 알림 권한
    if (typeof Platform.Version === 'number' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  return { status, requestNotification, skipPermission, openSettings };
}
