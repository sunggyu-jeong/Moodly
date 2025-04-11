import { View } from "react-native";
import EmotionIcon, { Emotions } from "../atoms/EmotionIcon.atom";


interface EmotionListProps {
  emotionList: Emotions[]
}

const EmotionListOrga = ({ emotionList }: EmotionListProps) => {
  return (
    <View className="flex flex-row flex-wrap p-2.5 m-6">
    {
      emotionList.map((item) => (
        <EmotionIcon key={item.id} emotion={item} />
      ))
    }
  </View>
  )
}

export default EmotionListOrga;