import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

import { navigate } from '@/shared/lib/navigation.util';

interface UsePushNavigationProps {
  hasDiary: boolean | undefined;
}

export const usePushNavigation = ({ hasDiary }: UsePushNavigationProps) => {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const didNavigateRef = useRef(false);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (lastNotificationResponse && !didNavigateRef.current && hasDiary !== undefined) {
      const data = lastNotificationResponse.notification.request.content.data;
      const { screen: stackName, params: paramsValue } = data as any;

      if (stackName === 'DiaryStack') {
        try {
          const params = typeof paramsValue === 'string' ? JSON.parse(paramsValue) : paramsValue;

          if (params?.screen && hasDiary === false) {
            didNavigateRef.current = true;
            setTimeout(() => {
              navigate(stackName, { screen: params.screen });
            }, 500);
          }
        } catch (e) {
          console.error('푸시 알림 params 파싱 실패 (초기 실행):', e);
        }
      }
    }
  }, [lastNotificationResponse, hasDiary]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('알림 수신:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (didNavigateRef.current || hasDiary === undefined) return;

      const data = response.notification.request.content.data;
      const { screen: stackName, params: paramsValue } = data as any;

      if (stackName !== 'DiaryStack') return;

      try {
        const params = typeof paramsValue === 'string' ? JSON.parse(paramsValue) : paramsValue;

        if (params?.screen && hasDiary === false) {
          didNavigateRef.current = true;
          navigate(stackName, { screen: params.screen });
        }
      } catch (e) {
        console.error('푸시 알림 params 파싱 실패 (리스너):', e);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [hasDiary]);
};
