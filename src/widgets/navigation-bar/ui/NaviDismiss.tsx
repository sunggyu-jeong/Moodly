import { IMAGES } from '@/shared/assets/images';
import { dismissModalToScreen } from '@/shared/lib';
import IconButton from '@/shared/ui/elements/IconButton';

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
