import { StyleSheet, View } from 'react-native';

import { MODAL_CANCEL_ACTION_KEY, MODAL_CONFIRM_ACTION_KEY } from '@/entities/overlay/model/types';
import DropDownAnimation from '@/features/overlay/dropdown/DropDownAnimation';
import EmotionLoading from '@/features/overlay/loading/EmotionLoading';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import { resetTo } from '@/shared/lib/navigation.util';
import {
  resetModalPopup,
  setOverlayEventHandler,
  setRequestWithDrawal,
} from '@/shared/model/overlaySlice';
import PopupContainer from '@/shared/ui/elements/popup/PopupContainer';
import ToastController from '@/shared/ui/elements/toast/ToastController';

const OverlayProvider = () => {
  const showToastView = useAppSelector(state => state.overlay?.showToastView);
  const showModalPopup = useAppSelector(state => state.overlay?.showModalPopup);
  const showDropDownView = useAppSelector(state => state.overlay?.showDropDownView);
  const showLoadingView = useAppSelector(state => state.overlay?.showLoadingView);

  const dispatch = useAppDispatch();
  const { openSettings } = useNotificationPermission();

  const hasOverlay =
    showLoadingView ||
    showToastView?.visibility ||
    showModalPopup?.visibility ||
    showDropDownView?.visibility;

  if (!hasOverlay) return null;

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      {showLoadingView && <EmotionLoading />}

      {showToastView?.visibility && <ToastController />}

      {showModalPopup?.visibility && (
        <PopupContainer
          title={showModalPopup?.title ?? ''}
          message={showModalPopup?.message ?? ''}
          cancelText={showModalPopup?.cancelText ?? ''}
          confirmText={showModalPopup?.confirmText ?? ''}
          onConfirm={() => {
            if (showModalPopup?.confirmActionKey === MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY) {
              dispatch(setOverlayEventHandler(MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY));
            } else if (showModalPopup?.confirmActionKey === MODAL_CONFIRM_ACTION_KEY.WITHDRAWAL) {
              dispatch(setRequestWithDrawal(true));
            } else if (
              showModalPopup?.confirmActionKey === MODAL_CONFIRM_ACTION_KEY.PERMISSION_CHANGE
            ) {
              openSettings();
              dispatch(resetModalPopup());
            }
          }}
          onCancel={() => {
            if (showModalPopup.cancelActionKey === MODAL_CANCEL_ACTION_KEY.GO_MAIN) {
              resetTo('Main');
            }
          }}
          disableBackdropClose={showModalPopup?.disableBackdropClose}
        />
      )}

      {showDropDownView?.visibility && <DropDownAnimation />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
});

export default OverlayProvider;
