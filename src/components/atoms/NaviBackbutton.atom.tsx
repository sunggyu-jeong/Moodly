import { Image, TouchableOpacity, View } from "react-native";
import { goBack } from "../../utils/navigation.util";

const BackButtonAtom = () => (
  <TouchableOpacity onPress={goBack} className="w-7">
    <Image 
      source={require("../../assets/images/back.png")} 
      accessibilityLabel="backbutton" 
    />
  </TouchableOpacity>
);

export default BackButtonAtom;
