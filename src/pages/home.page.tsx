import { useScale } from "../hooks";
import ActionButton from "../components/atoms/ActionButton.atom";
import { View } from "react-native";
import { navigate } from "../utils";
import TitleText from "../components/atoms/TitleText.atom";

const HomePage = () => {
  const { getScaleSize } = useScale();

  return (
    <>
      <View className="bg-white flex-1 first:justify-center items-center">
        <TitleText style={{ marginBottom: getScaleSize(78) }}>
          오늘 하루 어땠어?{"\n"}
          이야기를 들려줘!
        </TitleText>

        <View className="bg-[#D9D9D9] aspect-square w-2/3 rounded-full" />

        <View 
          className="w-full"
          style={{ marginTop: getScaleSize(92) }}
        >
          <ActionButton onPress={() => { navigate("감정선택")}}>
            들려주러 가기
          </ActionButton>
        </View>
      </View>
    </>
  )
}

export default HomePage;