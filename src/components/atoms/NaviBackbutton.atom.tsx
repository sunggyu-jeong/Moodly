import { goBack } from "../../utils";
import { Image, TouchableOpacity } from "react-native";

const BackButtonAtom = () => (
  <TouchableOpacity onPress={goBack} className="w-7">
    <Image 
      source={require("../../assets/images/back.png")} 
      accessibilityLabel="backbutton" 
    />
  </TouchableOpacity>
);

export default BackButtonAtom;
