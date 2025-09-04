// src/hooks/usePushNavigation.ts
import messaging from '@react-native-firebase/messaging';
import { navigate } from '@shared';
import { useEffect, useRef } from 'react';

interface UsePushNavigationProps {
  hasDiary: boolean | undefined;
}

export const usePushNavigation = ({ hasDiary }: UsePushNavigationProps) => {
  const didNavigateRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      const remoteMessage = await messaging().getInitialNotification();
      if (!remoteMessage?.data || didNavigateRef.current) return;

      const { screen: stackName, params: paramsValue } = remoteMessage.data;
      if (stackName !== 'DiaryStack') return;

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
    };

    if (hasDiary !== undefined) init();

    const unsubscribe = messaging().onNotificationOpenedApp(() => {
      if (hasDiary === false && !didNavigateRef.current) {
        init();
      }
    });

    return unsubscribe;
  }, [hasDiary]);
};
