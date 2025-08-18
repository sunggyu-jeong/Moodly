import { EmotionDiaryDTO } from "@entities/diary";
import { Avatar, Caption, ICON_DATA, Label, gray } from "@shared";
import { EMOTION_ICONS } from "@shared/assets/images/emotion";
import dayjs from "dayjs";
import { StyleSheet, View } from "react-native";


const EmotionDiaryCardHeader = ({ iconId, recordDate }: EmotionDiaryDTO) => {
  const emotionSource = ICON_DATA.find(item => item.id === iconId);

  return (
    <View className="flex-row mb-[15px] items-center">
      <Avatar source={emotionSource?.iconSelected || EMOTION_ICONS.joySmallSelected} />
      <View className="flex flex-col justify-between">
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
  captionStyle: {
    color: gray[400],
    marginBottom: 4,
  },
  labelStyle: {
    color: gray[600],
  },
});

export default EmotionDiaryCardHeader;
