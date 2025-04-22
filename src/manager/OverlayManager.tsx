import ToastAnimated from '../components/molecules/ToastAnimated.mol';
import PopupContainerOrga from '../components/organisms/PopupContainer.orga';
import { useAppSelector } from '../hooks';

export const MODAL_CONFIRM_ACTION_KEY = {
  DELETE_DIARY: 'DELETE_DIARY',
} as const;

const OverlayManager = () => {
  // 토스트
  const showToastView = useAppSelector((state) => state.commonSlice.showToastView);

  // 모달
  // const modalConfig = useAppSelector(state => state.commonSlice.modalPopupConfig);
  const showModalPopup = useAppSelector((state) => state.commonSlice.showModalPopup);

  // // 드롭다운
  const showDropDownView = useAppSelector((state) => state.commonSlice.showDropDownView);

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
            }
          }}
        />
      )}

      {/* {showDropDownView?.visibility && <DropDownAnimationTemp />} */}
    </>
  );
};

export default OverlayManager;
