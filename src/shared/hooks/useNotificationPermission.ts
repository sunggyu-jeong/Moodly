import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, PermissionsAndroid, Platform } from 'react-native';
import { checkNotifications, type PermissionStatus } from 'react-native-permissions';

export const TOKEN_STORAGE_KEY = '@fcm_token';

export function useNotificationPermission(
  options: {
    setupListeners?: boolean;
    onTokenUpdate?: (token: string | null) => Promise<void>;
  } = {},
) {
  const { setupListeners = false, onTokenUpdate } = options;
  const [status, setStatus] = useState<PermissionStatus>('unavailable');

  useEffect(() => {
    if (!setupListeners || !onTokenUpdate) {
      return;
    }

    const syncTokenOnlyIfPermitted = async () => {
      try {
        const authStatus = await messaging().hasPermission();
        const hasPermission =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!hasPermission) {
          const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
          if (storedToken) {
            await onTokenUpdate(null);
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          }
          return;
        }

        const currentToken = await messaging().getToken();
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

        if (currentToken && currentToken !== storedToken) {
          await onTokenUpdate(currentToken);
          await AsyncStorage.setItem(TOKEN_STORAGE_KEY, currentToken);
        }
      } catch (error) {
        console.error('FCM 토큰 동기화 실패:', error);
      }
    };

    const unsubscribeRefresh = messaging().onTokenRefresh(async () => {
      await syncTokenOnlyIfPermitted();
    });
    const unsubscribeAppState = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        syncTokenOnlyIfPermitted();
      }
    });
    syncTokenOnlyIfPermitted();
    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribeRefresh();
      unsubscribeAppState.remove();
    };
  }, [setupListeners, onTokenUpdate]);

  useEffect(() => {
    const checkAndUpdateStatus = async () => {
      const { status: currentStatus } = await checkNotifications();
      setStatus(currentStatus);
    };

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        checkAndUpdateStatus();
      }
    });

    checkAndUpdateStatus();

    return () => {
      subscription.remove();
    };
  }, []);

  async function requestNativeNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  const requestUserPermission = useCallback(async (): Promise<boolean> => {
    if (!onTokenUpdate) {
      console.error('onTokenUpdate 함수가 제공되지 않았습니다.');
      return false;
    }

    const granted = await requestNativeNotificationPermission();

    if (granted) {
      const currentToken = await messaging().getToken();
      await onTokenUpdate(currentToken);
      if (currentToken) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, currentToken);
      }
    } else {
      await onTokenUpdate(null);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    const { status: newStatus } = await checkNotifications();
    setStatus(newStatus);

    return granted;
  }, [onTokenUpdate]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return { status, requestUserPermission, requestNativeNotificationPermission, openSettings };
}
