import { View } from 'react-native';

import { COMMON_ICONS } from '@/shared/assets/images/common';
import ArrowButton from '@/shared/ui/elements/ArrowButton';
import MonthlyLabel from '@/shared/ui/elements/MonthlyLabel';

interface DiaryMonthProps {
  monthLabel: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  rightDisabled: boolean;
}

const DiaryMonth = ({ ...props }: DiaryMonthProps) => (
  <View className="flex-row items-center justify-center">
    <ArrowButton
      source={COMMON_ICONS.iconPrev}
      onPress={props.onPressLeft}
      style="mr-[18px]"
    />
    <MonthlyLabel label={props.monthLabel} />
    <ArrowButton
      source={COMMON_ICONS.iconNext}
      onPress={props.onPressRight}
      disabled={props.rightDisabled}
      style="ml-[17px]"
    />
  </View>
);

export default DiaryMonth;
