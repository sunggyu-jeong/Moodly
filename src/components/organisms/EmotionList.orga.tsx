import { View } from "react-native";
import EmotionIcon, { Emotions } from "../atoms/EmotionIcon.atom";
import { useScale } from "../../hooks";


interface EmotionListProps {
  emotionList: Emotions[]
}

const EmotionListOrga = ({ emotionList }: EmotionListProps) => {
  const { getScaleSize } = useScale();
  return (
    <View className="flex flex-row flex-wrap mx-6"
      style={{ marginBottom: getScaleSize(63) }}
    >
    {
      emotionList.map((item) => (
        <EmotionIcon key={item.id} emotion={item} />
      ))
    }
  </View>
  )
}

export default EmotionListOrga;