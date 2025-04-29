import IconButton from '@/components/atoms/IconButton';
import { IMAGES } from '@/shared/assets/images';
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
