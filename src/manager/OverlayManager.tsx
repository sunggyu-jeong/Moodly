import ToastAnimated from '../components/molecules/ToastAnimated.mol';
import { useAppSelector } from '../hooks';

const OverlayManager = () => {
  // 토스트
  const showToastView = useAppSelector(state => state.commonSlice.showToastView);

  // 모달
  // const modalConfig = useAppSelector(state => state.commonSlice.modalPopupConfig);
  // const showModalPopup = useAppSelector(state => state.commonSlice.showModalPopup);

  // // 드롭다운
  // const showDropDownView = useAppSelector(state => state.commonSlice.showDropDownView);

  return (
    <>
      {<ToastAnimated text={showToastView?.message ?? ""} />}

      {/* {showModalPopup && (
        <PopupContainer
          title={modalConfig.title}
          message={modalConfig.message}
          cancelText={modalConfig.cancelText}
          confirmText={modalConfig.confirmText}
          onConfirm={modalConfig.onConfirm}
        />
      )}

      {showDropDownView && <DropdownAnimationTemplate />} */}
    </>
  );
};

export default OverlayManager;