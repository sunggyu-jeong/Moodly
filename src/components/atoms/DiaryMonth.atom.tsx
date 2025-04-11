import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { IMAGES } from "../../assets/images";

interface DiaryMonthAtomProps {
  monthLabel: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  rightDisabled: boolean;
}

const DiaryMonthAtom: React.FC<DiaryMonthAtomProps> = ({
  monthLabel,
  onPressLeft,
  onPressRight,
  rightDisabled,
}) => {
  return (
    <View className="flex-row items-center justify-center">
      <TouchableOpacity onPress={onPressLeft}>
        <Image
          source={IMAGES.monthLeft}
          className="w-[18px] h-[18px] mr-[18px]"
        />
      </TouchableOpacity>
      <Text className="font-semibold text-[23px] tracking-[-0.5px]">
        {monthLabel}
      </Text>
      <TouchableOpacity onPress={onPressRight} disabled={rightDisabled}>
        <Image
          source={IMAGES.monthRight}
          className="w-[18px] h-[18px] ml-[17px]"
        />
      </TouchableOpacity>
    </View>
  );
};

export default DiaryMonthAtom;