import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import TitleText from "../components/atoms/TitleText.atom";
import { useAppDispatch, useAppSelector, useScale } from "../hooks";
import { View } from "react-native";
import EmotionListOrga from "../components/organisms/EmotionList.orga";
import SelectedEmotionOrga from "../components/organisms/SelectedEmotion.orga";
import { EmotionDiaryDTO } from "../scheme";
import { setTodayDiary } from "../redux/slice/diarySlice";
import { navigate } from "../utils";
import ActionButtonAtom from "../components/atoms/ActionButton.atom";
import { ICON_DATA } from "../constant/Icons";

const SelectEmotionPage = () => {
  const { getScaleSize } = useScale();
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector((state) => state.diarySlice.selectedEmotion);

  const handleSelectEmotion = () => {
    const emotion: EmotionDiaryDTO = {
      iconId: selectedEmotion?.id,
    }
    dispatch(setTodayDiary(emotion));
    navigate("WriteDiary");
  }

  return (
    <>
      <NavigationBarOrga />
      <View className="bg-white items-center flex-1">
        <TitleText 
          style={{ marginTop: getScaleSize(49.5)}}>
          오늘 너의 마음과{"\n"}
          가장 닮은 친구를 골라줘
        </TitleText>
        <SelectedEmotionOrga />
        <View className="flex-1" />
        <EmotionListOrga emotionList={ICON_DATA} />

        <View 
          className="w-full"
          style={{ marginBottom: getScaleSize(57) }}
        >
          <ActionButtonAtom onPress={handleSelectEmotion}>
            선택 완료
          </ActionButtonAtom>
        </View>
      </View>
    </>
  )
}

export default SelectEmotionPage;