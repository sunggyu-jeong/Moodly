import { View } from 'react-native';
import { IMAGES } from '../../assets/images';
import ArrowButton from '../atoms/ArrowButton.atm';
import MonthlyLabel from '../atoms/MonthlyLabel.atm';

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
