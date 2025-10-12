import * as Notifications from 'expo-notifications';
import { navigate } from '@/shared';
import { useEffect, useRef } from 'react';

interface UsePushNavigationProps {
  hasDiary: boolean | undefined;
}

export const usePushNavigation = ({ hasDiary }: UsePushNavigationProps) => {
  const didNavigateRef = useRef(false);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // 앱이 종료된 상태에서 알림 탭 (최신 API)
    const response = Notifications.useLastNotificationResponse();
    if (response && !didNavigateRef.current && hasDiary !== undefined) {
      const data = response.notification.request.content.data;
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
          console.error('푸시 알림 params 파싱 실패:', e);
        }
      }
    }

    // 앱이 실행 중일 때 알림 수신
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('알림 수신:', notification);
    });

    // 알림 탭했을 때
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
        console.error('푸시 알림 params 파싱 실패:', e);
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