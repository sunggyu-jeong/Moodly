import { useDispatch } from 'react-redux';

import { setShowToastView } from '@/processes/overlay/model/overlaySlice';
import { useAppSelector } from '@/shared/hooks';

import ToastAnimated from '../animation/ToastAnimated';

const ToastController = () => {
  const dispatch = useDispatch();
  const showToastView = useAppSelector((state) => state.overlaySlice.showToastView);

  return (
    <ToastAnimated
      visible={showToastView?.visibility ?? false}
      text={showToastView?.message ?? ''}
      onHide={() => dispatch(setShowToastView({ visibility: null, message: '' }))}
    />
  );
};

export default ToastController;
