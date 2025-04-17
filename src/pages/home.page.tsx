import { useAppDispatch, useAppSelector, useRealm, useScale } from "../hooks";
import { Image, Text, View } from "react-native";
import { isNotEmpty, navigate } from "../utils";
import { searchDiaryCountThunk, searchDiaryForDayThunk } from "../redux/slice/diarySlice";
import { IMAGES } from "../assets/images";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ActionButtonAtom from "../components/atoms/ActionButton.atom";
import ToolTipView from "../components/atoms/ToolTipView.atom";

const HomePage = () => {
  const { getScaleSize } = useScale();
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const diaryCount = useAppSelector((state) => state.diarySlice.diaryCount);
  const isDiaryExist = useAppSelector((state) => state.diarySlice.isDiaryExist);
  
  const initialize = async () => {    
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(searchDiaryForDayThunk({ realm, recordDate: new Date() }));
      await dispatch(searchDiaryCountThunk({ realm }));
      closeRealm();
    }
  }
  
  useFocusEffect(
    useCallback(() => {
      initialize();
    }, [])
  );

  useEffect(() => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>", isDiaryExist)
  })

  return (
    <>
      <View className="bg-white flex-1 first:justify-center items-center">
        <ToolTipView style={{ marginBottom: getScaleSize(78) }} 
          text={isDiaryExist.data ?  "일기를 소중히 저장했어!" : "오늘 하루 어땠어? 이야기를 들려줘!"}
        />
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
          <ActionButtonAtom onPress={() => { navigate("DiaryStack") }} disabled={isDiaryExist.data}>
            {isDiaryExist.data ? "일기 작성 완료" : "들려주러 가기"}
          </ActionButtonAtom>
        </View>
      </View>
    </>
  )
}

export default HomePage;