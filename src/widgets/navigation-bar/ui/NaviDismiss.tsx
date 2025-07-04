import { setModifyMode } from '@features/diary/model/diary.slice';
import { COMMON_ICONS } from '@shared/assets/images/common';
import { useAppDispatch } from '@shared/hooks';
import { dismissModalToScreen } from '@shared/lib';
import IconButton from '@shared/ui/elements/IconButton';

const NaviDismiss = () => {
  const dispatch = useAppDispatch();
  const handleDismiss = () => {
    dispatch(setModifyMode(false));
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
