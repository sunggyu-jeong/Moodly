import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import TitleText from "../components/atoms/TitleText.atom";
import { useAppDispatch, useAppSelector, useScale } from "../hooks";
import { View } from "react-native";
import { IMAGES } from "../assets/images";
import ActionButton from "../components/atoms/ActionButton.atom";
import EmotionListOrga from "../components/organisms/EmotionList.orga";
import SelectedEmotionOrga from "../components/organisms/SelectedEmotion.orga";
import { Emotions } from "../components/atoms/EmotionIcon.atom";
import { EmotionDiaryDTO } from "../scheme";
import { setTodayDiary } from "../redux/slice/diarySlice";
import { navigate } from "../utils";

const TEST_DATA: Emotions[] = [
  {
    id: 1,
    icon: IMAGES.smile,
    text: '행복',
    description: '테스트1'
  },
  {
    id: 2,
    icon: IMAGES.smile,
    text: '슬픔',
    description: '테스트2'
  },
  {
    id: 3,
    icon: IMAGES.smile,
    text: '불안',
    description: '테스트3'
  },
  {
    id: 4,
    icon: IMAGES.smile,
    text: '아무생각없음',
    description: '테스트3'
  },
  {
    id: 5,
    icon: IMAGES.smile,
    text: '신남',
    description: '테스트3'
  },
  {
    id: 6,
    icon: IMAGES.smile,
    text: '기대',
    description: '테스트3'
  }
];

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
        <EmotionListOrga emotionList={TEST_DATA} />

        <View 
          className="w-full"
          style={{ marginBottom: getScaleSize(57) }}
        >
          <ActionButton onPress={handleSelectEmotion}>
            선택 완료
          </ActionButton>
        </View>
      </View>
    </>
  )
}

export default SelectEmotionPage;