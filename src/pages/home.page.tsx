import { useScale } from "../hooks";
import ActionButton from "../components/atoms/ActionButton.atom";
import { Text, View } from "react-native";

const HomePage = () => {
  const { getScaleSize } = useScale();

  return (
    <>
      <View className="flex-1 first:justify-center items-center">
        <Text 
          className="text-pretendard font-bold tracking-[-0.5px] text-center leading-[40px]"
          style={{ fontSize: getScaleSize(28), marginBottom: getScaleSize(78) }}
        >
          오늘 하루 어땠어?{"\n"}
          이야기를 들려줘!
        </Text>

        <View className="bg-[#D9D9D9] aspect-square w-2/3 rounded-full" />

        <View 
          className="w-full"
          style={{ marginTop: getScaleSize(92) }}
        >
          <ActionButton onPress={() => {}}>
            들려주러 가기
          </ActionButton>
        </View>
      </View>
    </>
  )
}

export default HomePage;