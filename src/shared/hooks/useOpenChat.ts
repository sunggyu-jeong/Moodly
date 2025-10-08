import { setShowToastView } from '@/processes/overlay/model/overlaySlice';
import { useCallback } from 'react';
import { Linking } from 'react-native';

import { useAppDispatch } from './useHooks';

type UseOpenLink = {
  openLink: (url: string) => Promise<void>;
};

export const useExternalWebSite = (): UseOpenLink => {
  const dispatch = useAppDispatch();

  const openLink = useCallback(
    async (url: string) => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (!supported) {
          dispatch(
            setShowToastView({
              visibility: true,
              message: '해당 링크를 열 수 없습니다.',
            }),
          );
          return;
        }
        await Linking.openURL(url);
      } catch (err) {
        console.error('외부 링크 연결 실패:', err);
        dispatch(
          setShowToastView({
            visibility: true,
            message: '링크를 여는 중 오류가 발생했습니다.',
          }),
        );
      }
    },
    [dispatch],
  );

  return { openLink };
};
