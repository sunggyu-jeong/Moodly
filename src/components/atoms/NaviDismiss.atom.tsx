import { dismissModalToScreen } from "../../utils";
import { IMAGES } from "../../assets/images";
import { Image, TouchableOpacity } from "react-native";

const NaviDismiss = () => {
  return (
    <TouchableOpacity onPress={() => { dismissModalToScreen() }}>
      <Image source={IMAGES.xmark} className="float-right" />
    </TouchableOpacity>
  )
}
export default NaviDismiss