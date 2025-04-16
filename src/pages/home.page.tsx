import { useAppDispatch, useAppSelector, useRealm, useScale } from "../hooks";
import { Image, Text, View } from "react-native";
import { isNotEmpty, navigate } from "../utils";
import TitleText from "../components/atoms/TitleText.atom";
import { searchDiaryCountThunk } from "../redux/slice/diarySlice";
import { IMAGES } from "../assets/images";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ActionButtonAtom from "../components/atoms/ActionButton.atom";
import DimmedView from "../components/atoms/DimmedView.atom";
import PopupContainer from "../components/organisms/PopupContainer.orga";

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
  
  useFocusEffect(
    useCallback(() => {
      initialize();
    }, [])
  );

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
          <ActionButtonAtom onPress={() => { navigate("DiaryStack") }}>
            들려주러 가기
          </ActionButtonAtom>
        </View>
      </View>
    </>
  )
}

export default HomePage;