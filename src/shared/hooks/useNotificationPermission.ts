import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const TOKEN_STORAGE_KEY = '@expo_push_token';

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

        if (!setupListeners || !onTokenUpdate) return;

        const hasPermission = currentStatus === 'granted';

        if (hasPermission && Device.isDevice) {
          const { data: currentToken } = await Notifications.getExpoPushTokenAsync();
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
        console.error('알림 권한 확인 실패:', error);
      }
    };

    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        checkAndSyncEverything();
      }
    });

    checkAndSyncEverything();

    return () => {
      appStateSubscription.remove();
    };
  }, [setupListeners, onTokenUpdate]);

  const requestUserPermission = useCallback(async (): Promise<boolean> => {
    if (!onTokenUpdate) {
      console.error('onTokenUpdate 함수가 제공되지 않았습니다.');
      return false;
    }

    if (!Device.isDevice) {
      console.warn('실제 기기에서만 푸시 알림을 사용할 수 있습니다.');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      const { data: token } = await Notifications.getExpoPushTokenAsync();
      await onTokenUpdate(token);
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setStatus('granted' as Notifications.PermissionStatus);
      return true;
    } else {
      await onTokenUpdate(null);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setStatus(finalStatus);
      return false;
    }
  }, [onTokenUpdate]);

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  return { 
    status, 
    requestUserPermission, 
    openSettings 
  };
}