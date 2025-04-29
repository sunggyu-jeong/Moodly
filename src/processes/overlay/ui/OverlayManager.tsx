import ToastAnimated from '@/components/molecules/ToastAnimated.mol';
import PopupContainerOrga from '@/components/organisms/PopupContainer.org';
import DropDownAnimation from '@/components/templates/DropDownAnimation.tem';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setOverlayEventHandler } from '@/processes/overlay/model/overlaySlice';
import { isNotEmpty } from '@/utils';

export const MODAL_CONFIRM_ACTION_KEY = {
  DELETE_DIARY: 'DELETE_DIARY',
} as const;

const OverlayManager = () => {
  const showToastView = useAppSelector((state) => state.commonSlice.showToastView);
  const showModalPopup = useAppSelector((state) => state.commonSlice.showModalPopup);
  const showDropDownView = useAppSelector((state) => state.commonSlice.showDropDownView);
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
