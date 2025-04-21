import { useEffect } from "react";
import { useAppSelector, useScale } from "../../hooks";
import { Image, Text, View } from "react-native";

const SelectedEmotionOrga = () => {
  const selectedIcon = useAppSelector((state) => state.diarySlice.selectedIcon); 
  const { getScaleSize } = useScale();

  useEffect(()=> {
    console.log(">>>>>>>>>>>>>>>qfqfqw>>>>>>>>>>", selectedIcon)
  }, [selectedIcon])

  return (
    <View style={{ marginTop: getScaleSize(66)}}>
      <Image 
        source={selectedIcon?.icon}
        style={{ width: getScaleSize(188), height: getScaleSize(188)}} />
      <Text 
        className="font-bold text-center tracking-[-0.5px] mt-[69px]"
        style={{ fontSize: getScaleSize(24) }}
      >{selectedIcon?.text}</Text>
      <Text 
        className="font-medium text-center mt-4"
        style={{ fontSize: getScaleSize(16) }}
      >{selectedIcon?.description}</Text>
    </View>
  )
}

export default SelectedEmotionOrga;