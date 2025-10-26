import { ArrowButton, MonthlyLabel } from '@/shared';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { StyleSheet, View } from 'react-native';

interface DiaryMonthProps {
  monthLabel: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
}

const EmotionDiaryMonthSelector = ({ ...props }: DiaryMonthProps) => (
  <View style={styles.StyledContainer}>
    <ArrowButton
      source={COMMON_ICONS.iconPrev}
      onPress={props.onPressLeft}
      style={styles.LeftArrow}
      disabled={props?.leftDisabled ?? false}
    />
    <MonthlyLabel label={props.monthLabel} />
    <ArrowButton
      source={COMMON_ICONS.iconNext}
      onPress={props.onPressRight}
      disabled={props?.rightDisabled ?? false}
      style={styles.RightArrow}
    />
  </View>
);

const styles = StyleSheet.create({
  StyledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LeftArrow: {
    marginRight: 18,
  },
  RightArrow: {
    marginLeft: 17,
  },
});

export default EmotionDiaryMonthSelector;
