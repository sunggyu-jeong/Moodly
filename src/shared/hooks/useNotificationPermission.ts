import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, PermissionsAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
export const TOKEN_STORAGE_KEY = '@fcm_token';

export function useNotificationPermission(
  options: {
    setupListeners?: boolean;
    onTokenUpdate?: (token: string | null) => Promise<void>;
  } = {},
) {
  const { setupListeners = false, onTokenUpdate } = options;
    const [status, setStatus] = useState<Notifications.PermissionStatus>(
      Notifications.PermissionStatus.UNDETERMINED
    );

  useEffect(() => {
    const checkAndSyncEverything = async () => {
      try {
        const { status: currentStatus } = await Notifications.getPermissionsAsync();
        setStatus(currentStatus);

        if (!setupListeners || !onTokenUpdate) {
          return;
        }

        const hasPermission = currentStatus === 'granted';

        if (hasPermission) {
          const currentToken = await messaging().getToken();
          const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

          if (currentToken && currentToken !== storedToken) {
            await onTokenUpdate(currentToken);
            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, currentToken);
          }
        } else {
          const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
          if (storedToken) {
            await onTokenUpdate(null);
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('알림 권한 확인 및 토큰 동기화 실패:', error);
      }
    };

    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        checkAndSyncEverything();
      }
    });

    const tokenRefreshSubscription = setupListeners
      ? messaging().onTokenRefresh(checkAndSyncEverything)
      : () => {};

    checkAndSyncEverything();

    return () => {
      appStateSubscription.remove();
      tokenRefreshSubscription();
    };
  }, [setupListeners, onTokenUpdate]);

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

    const { status: newStatus } = await Notifications.getPermissionsAsync();
    setStatus(newStatus);

    return granted;
  }, [onTokenUpdate]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return { status, requestUserPermission, requestNativeNotificationPermission, openSettings };
}
