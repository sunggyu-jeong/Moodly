import { useAppDispatch, useAppSelector, useRealm, useScale } from "../hooks";
import ActionButton from "../components/atoms/ActionButton.atom";
import { Button, Image, Text, View } from "react-native";
import { isNotEmpty, navigate } from "../utils";
import TitleText from "../components/atoms/TitleText.atom";
import { searchDiaryCountThunk } from "../redux/slice/diarySlice";
import { IMAGES } from "../assets/images";
import { useEffect } from "react";

const HomePage = () => {
  const { getScaleSize } = useScale();
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const diaryCount = useAppSelector((state) => state.diarySlice.diaryCount);
  
  const initialize = async () => {    
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(searchDiaryCountThunk({ realm }));
      closeRealm();
    }
  }
  
  useEffect(() => {
    initialize();
  }, [])

  return (
    <>
      <View className="bg-white flex-1 first:justify-center items-center">
        <TitleText style={{ marginBottom: getScaleSize(78) }}>
          오늘 하루 어땠어?{"\n"}
          이야기를 들려줘!
        </TitleText>
        <Image
          source={IMAGES.smile} 
          className="aspect-square w-2/3" 
        />

        <Text 
          className="font-pretendard font-bold text-center tracking-[-0.5px]"
          style={{ marginTop: getScaleSize(17), fontSize: getScaleSize(18) }}
        >
          일기 작성 수
        </Text>
        <Text 
          className="font-pretendard font-bold text-center tracking-[-0.5px]"
          style={{ marginTop: getScaleSize(11), fontSize: getScaleSize(39) }}
        >
          {diaryCount.data}
        </Text>

        <View 
          className="w-full"
          style={{ marginTop: getScaleSize(66) }}
        >
          <ActionButton onPress={() => { navigate("SelectEmotion")}}>
            들려주러 가기
          </ActionButton>
        </View>
      </View>
    </>
  )
}

export default HomePage;