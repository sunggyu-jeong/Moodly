import ToastAnimated from '../components/molecules/ToastAnimated.mol';
import PopupContainerOrga from '../components/organisms/PopupContainer.org';
import DropDownAnimation from '../components/templates/DropDownAnimation.tem';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setOverlayEventHandler } from '../redux/slice/commonSlice';

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
      {showToastView?.visibility !== null && (
        <ToastAnimated text={showToastView?.message ?? ''} />
      )}

      {showModalPopup?.visibility !== null && (
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

      {showDropDownView?.visibility !== null && <DropDownAnimation />}
    </>
  );
};

export default OverlayManager;
