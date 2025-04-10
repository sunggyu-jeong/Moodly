import { IMAGES } from "../../assets/images";
import { goBack } from "../../utils";
import { Image, TouchableOpacity } from "react-native";

const BackButtonAtom = () => (
  <TouchableOpacity onPress={goBack} className="w-7">
    <Image 
      source={IMAGES.back} 
      accessibilityLabel="backbutton" 
    />
  </TouchableOpacity>
);

export default BackButtonAtom;
