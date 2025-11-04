import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { setShowToastView } from '@/widgets/overlay/model/overlaySlice';
import ToastAnimated from '@/widgets/toast/animation/ToastAnimated';
import { shallowEqual } from 'react-redux';

const ToastController = () => {
  const dispatch = useAppDispatch();
  const showToastView = useAppSelector(state => state.overlaySlice.showToastView, shallowEqual);

  return (
    <ToastAnimated
      visible={showToastView?.visibility ?? false}
      text={showToastView?.message ?? ''}
      onHide={() => dispatch(setShowToastView({ visibility: null, message: '' }))}
    />
  );
};

export default ToastController;
