import { useLazyGetFirstLaunchFlagQuery } from '@/entities/auth/api/user-meta.api';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { useCallback, useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import {
  MODAL_CANCEL_ACTION_KEY,
  MODAL_CONFIRM_ACTION_KEY,
} from '@/entities/overlay/model/modalKeys';
import { useVersionCheck } from '@/features/check-app-version/ui';
import { useAppDispatch } from '@/shared/hooks/useHooks';
import { resetTo } from '@/shared/lib/navigation.util';
import { supabase } from '@/shared/lib/supabase.util';
import { isNotEmpty } from '@/shared/lib/value.util';
import { setShowModalPopup } from '@/shared/model/overlaySlice';
import { primary } from '@/shared/styles/colors';
import * as Updates from 'expo-updates';
import AppBootstrap from '../../provider/AppBootstrap';

export interface SplashProps {
  progress: number;
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

  const handleOTAUpdate = useCallback(async () => {
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
      disableBackdropClose: true,
    };

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
          message: versionPolicy?.update_message || '업데이트 후 더 안정적으로 이용할 수 있습니다.',
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
      <SafeAreaView style={styles.StyledContainer}>
        <View style={styles.StyledBox}>
          <Image source={MAIN_ICONS.logo} />
        </View>
      </SafeAreaView>

      <AppBootstrap />
    </>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primary[300],
  },
  StyledBox: {
    position: 'absolute',
  },
});

export default Splash;
