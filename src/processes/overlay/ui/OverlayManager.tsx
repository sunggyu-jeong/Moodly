import { useAppDispatch, useAppSelector } from '@/hooks';
import { setOverlayEventHandler } from '@/processes/overlay/model/overlaySlice';
import { isNotEmpty } from '@/utils';
import DropDownAnimation from '@/widgets/dropdown/animation/DropDownAnimation';
import PopupContainerOrga from '@/widgets/popup/ui/PopupContainer';
import ToastAnimated from '@/widgets/toast/animation/ToastAnimated';

export const MODAL_CONFIRM_ACTION_KEY = {
  DELETE_DIARY: 'DELETE_DIARY',
} as const;

const OverlayManager = () => {
  const showToastView = useAppSelector((state) => state.overlaySlice.showToastView);
  const showModalPopup = useAppSelector((state) => state.overlaySlice.showModalPopup);
  const showDropDownView = useAppSelector((state) => state.overlaySlice.showDropDownView);
  const dispatch = useAppDispatch();

  return (
    <>
      {isNotEmpty(showToastView?.visibility) && (
        <ToastAnimated
          visible={showToastView?.visibility}
          text={showToastView?.message ?? ''}
          onHide={() => {}}
        />
      )}

      {isNotEmpty(showModalPopup?.visibility) && (
        <PopupContainerOrga
          title={showModalPopup?.title ?? ''}
          message={showModalPopup?.message ?? ''}
          cancelText={showModalPopup?.cancelText ?? ''}
          confirmText={showModalPopup?.confirmText ?? ''}
          onConfirm={() => {
            if (
              showModalPopup?.confirmActionKey === MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY
            ) {
              dispatch(setOverlayEventHandler(MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY));
            }
          }}
        />
      )}

      {isNotEmpty(showDropDownView?.visibility) && <DropDownAnimation />}
    </>
  );
};

export default OverlayManager;
