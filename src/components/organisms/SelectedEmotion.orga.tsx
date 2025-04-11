import { useAppSelector, useScale } from "../../hooks";
import { Image, Text, View } from "react-native";

const SelectedEmotionOrga = () => {
  const selectedEmotion = useAppSelector((state) => state.diarySlice.selectedEmotion); 
  const { getScaleSize } = useScale();

  return (
    <View className="mt-[10px]">
      <Image 
        source={selectedEmotion?.icon}
        style={{ width: getScaleSize(188), height:  getScaleSize(188)}} />
      <Text className="font-bold text-center text-xl tracking-[-0.5px]">{selectedEmotion?.text}</Text>
      <Text className="font-medium text-center text-base mt-4">{selectedEmotion?.description}</Text>
    </View>
  )
}

export default SelectedEmotionOrga;