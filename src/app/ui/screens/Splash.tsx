import { useLazyGetFirstLaunchFlagQuery } from '@/entities/auth/api/user-meta.api';
import { isNotEmpty, resetTo, supabase, useAppDispatch } from '@/shared';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useCallback, useEffect } from 'react';
import { Alert, Image, SafeAreaView, StatusBar, View } from 'react-native';

import {
  type UpdateProgressMent,
  type UpdateProgressStatus,
} from '../../navigation/hooks/useUpdateProgress';
import AppBootstrap from '../../provider/AppBootstrap';
import * as Updates from 'expo-updates';
import { MODAL_CANCEL_ACTION_KEY, MODAL_CANCEL_ACTION_KEY, MODAL_CONFIRM_ACTION_KEY } from '@/processes/key';
import { setShowModalPopup } from '@/processes/overlay/model/overlaySlice';
import { useVersionCheck } from '@/features/check-app-version/ui';

export interface SplashProps {
  status: UpdateProgressStatus;
  progress: number;
  ment: UpdateProgressMent;
}
const Splash = () => {
  const [getFirstLaunchFlag] = useLazyGetFirstLaunchFlagQuery();
  const { isLoading, versionStatus, versionPolicy } = useVersionCheck();
  const dispatch = useAppDispatch();

  const flag = useCallback(async () => {
    const response = await getFirstLaunchFlag();
    if (response.data) {
      resetTo('Onboarding');
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (isNotEmpty(user)) {
      resetTo('Main');
    } else {
      resetTo('Login');
    }
  }, [getFirstLaunchFlag]);

  const handleOTAUpdate = useCallback( async() => {
    const response = await Updates.checkForUpdateAsync();
    if (!response.isAvailable) return false;
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();

    return true;
  }, []);

  const handleVersionCheck = useCallback(() => {
    if (isLoading || !versionStatus) return false;

    const modal = {
      visibity: true,
      title: '업데이트 알림',
      disableBackdropClose:true
    }

    if (versionStatus === 'required') {
      dispatch(
        setShowModalPopup({
          ...modal,
          message:
            versionPolicy?.update_message ||
            '새로운 버전이 출시되었습니다. 업데이트 후 이용해주세요.',
          confirmText: '업데이트',
          confirmActionKey: MODAL_CONFIRM_ACTION_KEY.MOVE_STORE,
        }),
      );
      return true;
    }

    if (versionStatus === 'recommended') {
      dispatch(
        setShowModalPopup({
          ...modal,
          message:
            versionPolicy?.update_message ||
            '업데이트 후 더 안정적으로 이용할 수 있습니다.',
          confirmText: '업데이트',
          cancelText: '이용',
          confirmActionKey: MODAL_CONFIRM_ACTION_KEY.MOVE_STORE,
          cancelActionKey: MODAL_CANCEL_ACTION_KEY.GO_MAIN,
        }),
      );
      return true;
    }

    return false;
  }, [isLoading, versionStatus, versionPolicy, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const updated = await handleOTAUpdate();
        if (updated) return;

        const blocked = handleVersionCheck();
        if (blocked) return;

        setTimeout(flag, 1500); 
      } catch {
        flag();
      }
    })();
  }, [flag, handleOTAUpdate, handleVersionCheck]);


  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
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
