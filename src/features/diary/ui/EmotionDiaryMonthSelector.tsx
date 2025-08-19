import { ArrowButton, MonthlyLabel } from '@shared';
import { COMMON_ICONS } from '@shared/assets/images/common';
import { View } from 'react-native';

interface DiaryMonthProps {
  monthLabel: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
}

const EmotionDiaryMonthSelector = ({ ...props }: DiaryMonthProps) => (
  <View className="flex-row items-center justify-center">
    <ArrowButton
      source={COMMON_ICONS.iconPrev}
      onPress={props.onPressLeft}
      style="mr-[18px]"
      disabled={props?.leftDisabled ?? false}
    />
    <MonthlyLabel label={props.monthLabel} />
    <ArrowButton
      source={COMMON_ICONS.iconNext}
      onPress={props.onPressRight}
      disabled={props?.rightDisabled ?? false}
      style="ml-[17px]"
    />
  </View>
);

export default EmotionDiaryMonthSelector;
