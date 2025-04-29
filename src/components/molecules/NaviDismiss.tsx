import { IMAGES } from '../../assets/images';
import { dismissModalToScreen } from '../../utils';
import IconButton from '../atoms/IconButton';

const NaviDismiss = () => {
  const handleDismiss = () => {
    dismissModalToScreen();
  };

  return (
    <IconButton
      icon={IMAGES.xmark}
      onPress={handleDismiss}
    />
  );
};

export default NaviDismiss;
