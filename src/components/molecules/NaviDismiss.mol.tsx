import { dismissModalToScreen } from "../../utils";
import { IMAGES } from "../../assets/images";
import IconButtonAtom from "../atoms/IconButton.atom";

const NaviDismiss = () => {
  const handleDismiss = () => {
    dismissModalToScreen();
  };

  return (
    <IconButtonAtom
      icon={IMAGES.xmark}
      onPress={handleDismiss}
    />
  );
};

export default NaviDismiss;