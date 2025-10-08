import { setShowToastView } from '@/processes/overlay/model/overlaySlice';
import { useAppDispatch, useAppSelector } from '@/shared';
import { shallowEqual } from 'react-redux';

import { ToastAnimated } from '../animation';

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
