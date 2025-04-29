import { IMAGES } from '@/assets/images';
import IconButton from '@/components/atoms/IconButton';
import { dismissModalToScreen } from '@/utils';

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
