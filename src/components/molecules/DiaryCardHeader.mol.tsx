import { Text, View } from "react-native";
import { useScale } from "../../hooks";
import AvatarAtom from "../atoms/Avatar.atom";
import { EmotionDiaryDTO } from "../../scheme";
import { ICON_DATA } from "../../constant/Icons";
import dayjs from "dayjs";
import { IMAGES } from "../../assets/images";

const DiaryCardHeader = ({ iconId, recordDate }: EmotionDiaryDTO) => {
  const { getScaleSize } = useScale();
  const emotionSource = ICON_DATA.find((item) => item.id === iconId);

  return (
    <View className="flex-row mb-[18px] items-center">
      <AvatarAtom source={emotionSource?.icon || IMAGES.smile} />
      <View>
        <Text
          className="font-semibold tracking-[-0.5px] text-black/50"
          style={{ fontSize: getScaleSize(14) }}
        >
          {dayjs(recordDate).format("MM월 DD일")}
        </Text>
        <View className="flex-1" />
        <Text
          className="font-semibold tracking-[-0.5px]"
          style={{ fontSize: getScaleSize(16) }}
        >
          {emotionSource?.text}
        </Text>
      </View>
    </View>
  );
}

export default DiaryCardHeader;