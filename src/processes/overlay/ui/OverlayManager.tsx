import { isNotEmpty, useAppDispatch, useAppSelector, useNotificationPermission } from '@/shared';
import { DropDownAnimation } from '@/widgets/dropdown/animation';
import { ToastController } from '@/widgets/toast';

import { PopupContainer } from '../../../widgets/popup';
import { MODAL_CONFIRM_ACTION_KEY } from '../../key';
import {
  resetModalPopup,
  setOverlayEventHandler,
  setRequestWithDrawal,
} from '../model/overlaySlice';

const OverlayManager = () => {
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
        />
      )}

      {isNotEmpty(showDropDownView?.visibility) && <DropDownAnimation />}
    </>
  );
};

export default OverlayManager;
