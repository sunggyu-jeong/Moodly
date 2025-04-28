import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks';
import { setShowToastView } from '../../redux/slice/commonSlice';
import ToastAnimated from '../molecules/ToastAnimated.mol';

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
