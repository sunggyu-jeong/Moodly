import { View } from "react-native";
import BackButtonAtom from "../atoms/NaviBackbutton.atom";
import NavigationTitleAtom from "../atoms/NaviTitle.atom";
import { isNotEmpty } from "../../utils";
import NaviActionButtonAtom, { NaviActionButtonAtomProps } from "../atoms/NaviActionButton.atom";
import { SafeAreaView } from "react-native-safe-area-context";

export interface NavigationBarConfig {
  showBackButton?: boolean;
  title?: string;
  actionButtons?: NaviActionButtonAtomProps[];
} 

const NavigationBarOrga = ({
  showBackButton = true,
  title,
  actionButtons,
}: NavigationBarConfig) => {
  const hasLeftCenter = showBackButton || (title && title.trim() !== "");

  return (
    <SafeAreaView className="bg-white">
      <View
        className={`flex-row items-center h-10 px-[10px] bg-white ${
          hasLeftCenter ? "justify-between" : "justify-end"
        }`}
      >
        {showBackButton && (
          <View className="ml-3">
            <BackButtonAtom />
          </View>
        )}

        {title && (
          <View className="items-center flex-1">
            <NavigationTitleAtom title={title} />
          </View>
        )}

        {isNotEmpty(actionButtons) && (
          <View className="mr-6">
            {actionButtons.map((el, index) => (
              <NaviActionButtonAtom key={index} {...el} />
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NavigationBarOrga;