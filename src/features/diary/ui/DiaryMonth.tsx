import ArrowButton from '@/components/atoms/ArrowButton';
import MonthlyLabel from '@/components/atoms/MonthlyLabel';
import { IMAGES } from '@/shared/assets/images';
import { View } from 'react-native';

interface DiaryMonthProps {
  monthLabel: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  rightDisabled: boolean;
}

const DiaryMonth = ({ ...props }: DiaryMonthProps) => (
  <View className="flex-row items-center justify-center">
    <ArrowButton
      source={IMAGES.monthLeft}
      onPress={props.onPressLeft}
      style="mr-[18px]"
    />
    <MonthlyLabel label={props.monthLabel} />
    <ArrowButton
      source={IMAGES.monthRight}
      onPress={props.onPressRight}
      disabled={props.rightDisabled}
      style="ml-[17px]"
    />
  </View>
);

export default DiaryMonth;
