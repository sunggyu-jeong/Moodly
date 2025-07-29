import { COMMON_ICONS } from '@shared/assets/images/common';
import { dismissModalToScreen } from '@shared/lib';
import IconButton from '@shared/ui/elements/IconButton';

const NaviDismiss = () => {
  const handleDismiss = () => {
    dismissModalToScreen();
  };

  return (
    <IconButton
      icon={COMMON_ICONS.iconClose}
      onPress={handleDismiss}
    />
  );
};

export default NaviDismiss;
