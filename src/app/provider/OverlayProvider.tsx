import {
  MODAL_CANCEL_ACTION_KEY,
  MODAL_CONFIRM_ACTION_KEY,
} from '@/entities/overlay/model/modalKeys';
import DropDownAnimation from '@/features/overlay/dropdown/DropDownAnimation';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import { resetTo } from '@/shared/lib/navigation.util';
import { isNotEmpty } from '@/shared/lib/value.util';
import {
  resetModalPopup,
  setOverlayEventHandler,
  setRequestWithDrawal,
} from '@/shared/model/overlaySlice';
import PopupContainer from '@/shared/ui/elements/popup/PopupContainer';
import ToastController from '@/shared/ui/elements/toast/ToastController';

const OverlayProvider = () => {
  const showToastView = useAppSelector(state => state.overlaySlice.showToastView);
  const showModalPopup = useAppSelector(state => state.overlaySlice.showModalPopup);
  const showDropDownView = useAppSelector(state => state.overlaySlice.showDropDownView);
  const dispatch = useAppDispatch();
  const { openSettings } = useNotificationPermission();

  return (
    <>
      {isNotEmpty(showToastView?.visibility) && <ToastController />}

      {isNotEmpty(showModalPopup?.visibility) && (
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

      {isNotEmpty(showDropDownView?.visibility) && <DropDownAnimation />}
    </>
  );
};

export default OverlayProvider;
