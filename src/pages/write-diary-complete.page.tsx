import { useEffect } from "react";
import { useScale } from "../hooks";
import { Text, View } from "react-native";
import { navigate } from "../utils";

const WriteDiaryCompletePage = () => {
  const { getScaleSize } = useScale();

  useEffect(() => {
    setTimeout(() => {
      navigate("DiaryDetail");
    }, 2000);
  }, [])

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View className="bg-[#D9D9D9] aspect-square w-2/3 rounded-full" />        
      <Text className="font-pretendard font-bold text-[28px] tracking-[-0.5px]"
      style={{ marginTop: getScaleSize(74) }}> 
        이야기를 들려줘서 고마워!
      </Text>
    </View>
  )
}

export default WriteDiaryCompletePage;