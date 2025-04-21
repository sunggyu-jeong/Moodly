import { View } from "react-native";
import ArrowButtonAtom from "../atoms/ArrowButton.atom";
import MonthLabelAtom from "../atoms/MonthLabel.atom";
import { IMAGES } from "../../assets/images";

interface DiaryMonthProps {
  monthLabel: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  rightDisabled: boolean;
}

const DiaryMonth = ({ ...props }: DiaryMonthProps) => (
  <View className="flex-row items-center justify-center">
    <ArrowButtonAtom
      source={IMAGES.monthLeft}
      onPress={props.onPressLeft}
      style="mr-[18px]"
    />
    <MonthLabelAtom label={props.monthLabel} />
    <ArrowButtonAtom
      source={IMAGES.monthRight}
      onPress={props.onPressRight}
      disabled={props.rightDisabled}
      style="ml-[17px]"
    />
  </View>
);

export default DiaryMonth;