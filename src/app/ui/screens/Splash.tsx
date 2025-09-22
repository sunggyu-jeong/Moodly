import { useVersionCheck } from '@features/check-app-version/ui';
import { setShowModalPopup } from '@processes/overlay/model/overlaySlice';
import { isNotEmpty, useAppDispatch, useAppNavigation } from '@shared';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, View } from 'react-native';

import {
  type UpdateProgressMent,
  type UpdateProgressStatus,
} from '../../navigation/hooks/useUpdateProgress';
import AppBootstrap from '../../provider/AppBootstrap';

export interface SplashProps {
  status: UpdateProgressStatus;
  progress: number;
  ment: UpdateProgressMent;
}
const Splash = () => {
  const dispatch = useAppDispatch();
  const { isLoading, versionStatus, versionPolicy } = useVersionCheck();
  const { navigate } = useAppNavigation();

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!isLoading && isNotEmpty(versionStatus)) {
      switch (versionStatus) {
        case 'required':
          dispatch(
            setShowModalPopup({
              visibility: true,
              title: '업데이트 알림',
              message:
                versionPolicy?.update_message ||
                '새로운 버전이 출시되었습니다. 업데이트 후 이용해주세요.',
              confirmText: '업데이트',
              confirmActionKey: 'MOVE_STORE',
              disableBackdropClose: true,
            }),
          );
          break;
        case 'recommended':
          dispatch(
            setShowModalPopup({
              visibility: true,
              title: '업데이트 알림',
              message: versionPolicy?.update_message || '업데이트 후 이용해주세요.',
              confirmText: '업데이트',
              cancelText: '이용',
              confirmActionKey: 'MOVE_STORE',
              cancelActionKey: 'GO_MAIN',
              disableBackdropClose: true,
            }),
          );
          break;
        case 'latest':
          {
            timerId = setTimeout(() => {
              navigate();
            }, 2000);
          }
          break;
      }
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isLoading, versionStatus, versionPolicy, dispatch, navigate]);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
      />
      <SafeAreaView className="bg-primary-300 flex-1 justify-center items-center">
        <View className="absolute">
          <Image source={MAIN_ICONS.logo} />
        </View>
      </SafeAreaView>

      <AppBootstrap />
    </>
  );
};

export default Splash;
