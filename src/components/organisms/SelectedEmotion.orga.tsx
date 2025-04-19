import { useAppSelector, useScale } from "../../hooks";
import { Image, Text, View } from "react-native";

const SelectedEmotionOrga = () => {
  const selectedEmotion = useAppSelector((state) => state.diarySlice.selectedEmotion); 
  const { getScaleSize } = useScale();

  return (
    <View style={{ marginTop: getScaleSize(66)}}>
      <Image 
        source={selectedEmotion?.icon}
        style={{ width: getScaleSize(188), height: getScaleSize(188)}} />
      <Text 
        className="font-bold text-center tracking-[-0.5px] mt-[69px]"
        style={{ fontSize: getScaleSize(24) }}
      >{selectedEmotion?.text}</Text>
      <Text 
        className="font-medium text-center mt-4"
        style={{ fontSize: getScaleSize(16) }}
      >{selectedEmotion?.description}</Text>
    </View>
  )
}

export default SelectedEmotionOrga;