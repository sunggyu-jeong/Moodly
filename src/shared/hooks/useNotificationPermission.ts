import messaging from '@react-native-firebase/messaging';
import { supabase } from '@shared/lib';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  checkNotifications,
  type NotificationSettings,
  type PermissionStatus,
  requestNotifications,
} from 'react-native-permissions';

/**
 * 현재 권한 상태가 푸시 알림을 받을 수 있는 상태인지 확인합니다.
 * iOS의 'provisional(임시 허용)'은 settings.provisional로 표시될 수 있으므로 함께 확인합니다.
 */
const isIOSProvisional = (settings?: NotificationSettings) =>
  Platform.OS === 'ios' && settings?.provisional === true;

const isPushAllowed = (s: PermissionStatus, settings?: NotificationSettings): boolean =>
  s === 'granted' || isIOSProvisional(settings);

export function useNotificationPermission() {
  const [status, setStatus] = useState<PermissionStatus>('unavailable');
  const appState = useRef(AppState.currentState);

  /**
   * Supabase DB에 현재 기기의 FCM 토큰을 저장(Upsert)합니다.
   */
  const upsertPushToken = async (token: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return; // 비로그인 시 중단

    const deviceId = await DeviceInfo.getUniqueId();
    await supabase.from('push_tokens').upsert(
      {
        user_id: userId,
        device_id: deviceId,
        token,
        platform: Platform.OS,
      },
      { onConflict: 'user_id,device_id' },
    );
    console.log('✅ Push token upserted.');
  };

  /**
   * Supabase DB에서 현재 기기의 FCM 토큰을 삭제합니다.
   */
  const removeMyPushToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return; // 비로그인 시 중단

    const deviceId = await DeviceInfo.getUniqueId();
    await supabase.from('push_tokens').delete().match({ user_id: userId, device_id: deviceId });
    console.log('🗑️ Push token removed due to permission change.');
  };

  useEffect(() => {
    const syncPermissionsAndToken = async () => {
      // react-native-permissions를 통해 현재 OS 레벨의 권한 상태를 가져옵니다.
      const { status: currentStatus, settings } = await checkNotifications();
      setStatus(currentStatus); // UI 표시를 위해 상태 업데이트

      if (isPushAllowed(currentStatus, settings)) {
        try {
          if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
          }
          const token = await messaging().getToken();
          await upsertPushToken(token);
        } catch (e) {
          console.error('Token sync failed:', e);
        }
      } else {
        await removeMyPushToken();
      }
    };

    syncPermissionsAndToken();

    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground, checking permissions...');
        syncPermissionsAndToken();
      }
      appState.current = nextAppState;
    });

    const tokenRefreshSubscription = messaging().onTokenRefresh(upsertPushToken);

    // 컴포넌트 언마운트 시 모든 리스너 정리
    return () => {
      appStateSubscription.remove();
      tokenRefreshSubscription();
    };
  }, []);

  const requestNotification = async () => {
    try {
      // react-native-permissions를 사용하여 권한 요청
      const { status: requestedStatus, settings } = await requestNotifications([
        'alert',
        'sound',
        'badge',
      ]);
      setStatus(requestedStatus);

      // 권한이 허용되었다면, useEffect의 자동 동기화 로직이 토큰을 등록/갱신할 것입니다.
      // 여기서 별도로 getToken/upsert를 호출할 필요는 없습니다.
      if (isPushAllowed(requestedStatus, settings)) {
        console.log('Notification permission granted!');
      } else {
        console.log('Notification permission denied.');
      }
      return isPushAllowed(requestedStatus, settings);
    } catch (err) {
      console.error('Requesting notification permission failed:', err);
      return false;
    }
  };

  return { status, requestNotification };
}
