import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import TitleText from "../components/atoms/TitleText.atom";
import { useAppDispatch, useAppSelector, useScale } from "../hooks";
import { View } from "react-native";
import EmotionListOrga from "../components/organisms/EmotionList.orga";
import SelectedEmotionOrga from "../components/organisms/SelectedEmotion.orga";
import { EmotionDiaryDTO } from "../scheme";
import { setSelectedEmotion, setTodayDiary } from "../redux/slice/diarySlice";
import { isNotEmpty, navigate } from "../utils";
import ActionButtonAtom from "../components/atoms/ActionButton.atom";
import { ICON_DATA } from "../constant/Icons";
import { NaviActionButtonAtomProps } from "../components/atoms/NaviActionButton.atom";
import NaviDismiss from "../components/molecules/NaviDismiss.mol";
import { useEffect } from "react";

const SelectEmotionPage = () => {
  const { getScaleSize } = useScale();
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector((state) => state.diarySlice.selectedEmotion);
  const actionButtons: NaviActionButtonAtomProps[] = [{
    item: <NaviDismiss />,
    disabled: false,
  }]
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);

  const handleSelectEmotion = () => {
    const emotion: EmotionDiaryDTO = {
      iconId: selectedEmotion?.id,
    }
    dispatch(setTodayDiary(emotion));
    navigate("DiaryStack", { screen: "WriteDiary" });
  }

  useEffect(() => {
    return () => {
      dispatch(setTodayDiary(null));
      dispatch(setSelectedEmotion(ICON_DATA[0]));
    }
  }, [])

  useEffect(() => {
    // 수정일 때 사용
    if(isNotEmpty(selectedDiary)) {
      setSelectedEmotion(selectedDiary.emotionId);
      const emotion: EmotionDiaryDTO = {
        iconId: selectedDiary?.iconId,
      };
      dispatch(setTodayDiary(emotion));
    }
  }, [selectedDiary])

  return (
    <>
      <NavigationBarOrga showBackButton={false} actionButtons={actionButtons} />
      <View className="bg-white items-center flex-1">
        <TitleText 
          style={{ marginTop: getScaleSize(64)}}>
          오늘 너의 마음과 가장 닮은 친구를 골라줘
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