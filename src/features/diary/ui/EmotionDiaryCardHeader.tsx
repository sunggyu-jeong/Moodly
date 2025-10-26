import type { Diary } from '@/entities/diary/model/diary.types';
import { Avatar, Caption, gray, ICON_DATA, Label } from '@/shared';
import { EMOTION_ICONS } from '@/shared/assets/images/emotion';
import dayjs from 'dayjs';
import { StyleSheet, View } from 'react-native';

const EmotionDiaryCardHeader = ({ iconId, recordDate }: Partial<Diary>) => {
  const emotionSource = ICON_DATA.find(item => item.id === iconId);

  return (
    <View style={styles.StyledContainer}>
      <Avatar source={emotionSource?.iconSelected || EMOTION_ICONS.joySmallSelected} />
      <View style={styles.StyledTextWrapper}>
        <Caption
          weight="semibold"
          style={styles.captionStyle}
        >
          {dayjs(recordDate).format('M월 D일')}
        </Caption>
        <Label
          weight="semibold"
          style={styles.labelStyle}
        >
          {emotionSource?.text}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  StyledTextWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  captionStyle: {
    color: gray[400],
    marginBottom: 4,
  },
  labelStyle: {
    color: gray[600],
  },
});

export default EmotionDiaryCardHeader;
