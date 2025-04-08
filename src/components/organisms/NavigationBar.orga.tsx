import { SafeAreaView, View } from "react-native";
import BackButtonAtom from "../atoms/NaviBackbutton.atom";
import NavigationTitleAtom from "../atoms/NaviTitle.atom";
import { isNotEmpty } from "../../utils";
import NaviActionButtonAtom, { NaviActionButtonAtomProps } from "../atoms/NaviActionButton.atom";

export interface NavigationBarConfig {
  showBackButton?: boolean;
  title?: string;
  titleStyle?: string;
  actionButtons?: NaviActionButtonAtomProps[]
} 

const NavigationBarOrga = ({
  showBackButton = true,
  title,
  titleStyle,
  actionButtons,
}: NavigationBarConfig) => {
  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center h-10 px-[10px] bg-white">
        <View className="flex-1 justify-start ml-3">
          {showBackButton ? <BackButtonAtom /> : null}
        </View>
        <View className="flex-3 items-center">
          <NavigationTitleAtom title={title ?? ""} style={titleStyle} />
        </View>
        <View className="flex-1 justify-start">
          {
            isNotEmpty(actionButtons) && 
            actionButtons
              .map((el, index) => <NaviActionButtonAtom key={index} {...el} />) 
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

export default NavigationBarOrga;