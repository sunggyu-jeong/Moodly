import { shallowEqual } from 'react-redux';

import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { setShowToastView } from '@/shared/model/overlaySlice';
import ToastAnimated from '@/shared/ui/elements/toast/ToastAnimated';

const ToastController = () => {
  const dispatch = useAppDispatch();
  const showToastView = useAppSelector(state => state.overlay.showToastView, shallowEqual);

  return (
    <ToastAnimated
      visible={showToastView?.visibility ?? false}
      text={showToastView?.message ?? ''}
      onHide={() => dispatch(setShowToastView({ visibility: null, message: '' }))}
    />
  );
};

export default ToastController;
