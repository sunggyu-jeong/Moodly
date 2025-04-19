import { View } from "react-native";
import BackButtonAtom from "../atoms/NaviBackbutton.atom";
import { isNotEmpty } from "../../utils";
import NaviActionButtonAtom, { NaviActionButtonAtomProps } from "../atoms/NaviActionButton.atom";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export interface NavigationBarConfig {
  showBackButton?: boolean;
  leftComponents?: NaviActionButtonAtomProps[] | null;
  centerComponent?: React.ReactNode;
  actionButtons?: NaviActionButtonAtomProps[];
} 

const NavigationBarOrga = ({
  showBackButton = true,
  centerComponent,
  actionButtons,
  leftComponents,
}: NavigationBarConfig) => {
  const hasLeftCenter = showBackButton || (isNotEmpty(centerComponent));
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className="bg-white" style={{ paddingTop: insets.top }}>
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
        
        {isNotEmpty(leftComponents) && (
          <View className="ml-3">
            {leftComponents.map((el, index) => (
              <NaviActionButtonAtom key={index} {...el} />
            ))}
          </View>
        )}
        <View className="flex-1" />

        {centerComponent && (
          <View className="items-center flex-1">
            {centerComponent}
          </View>
        )}

        <View className="flex-1" />

        {isNotEmpty(actionButtons) && (
          <View className="mr-[10px]">
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