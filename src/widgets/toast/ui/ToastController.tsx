import { useAppSelector } from '@/hooks';
import { setShowToastView } from '@/processes/overlay/model/overlaySlice';
import { useDispatch } from 'react-redux';
import ToastAnimated from './ToastAnimated';

const ToastController = () => {
  const dispatch = useDispatch();
  const showToastView = useAppSelector((state) => state.commonSlice.showToastView);

  return (
    <ToastAnimated
      visible={showToastView?.visibility ?? false}
      text={showToastView?.message ?? ''}
      onHide={() => dispatch(setShowToastView({ visibility: null, message: '' }))}
    />
  );
};

export default ToastController;
