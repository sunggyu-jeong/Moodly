import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import TitleText from "../components/atoms/TitleText.atom";
import ActionButton from "../components/atoms/ActionButton.atom";
import { navigate } from "../utils";
import { useAppSelector, useScale } from "../hooks";
import { View } from "react-native";
import EmotionCarouselList from "../components/organisms/EmotionCarouselList.orga";
import { EmotionDiaryDTO } from "../scheme";

const TEST_DATA = [
  {
    id: 1,
    uri: require('../assets/images/test.png'),
    text: '행복',
    description: '테스트1'
  },
  {
    id: 2,
    uri: require('../assets/images/test.png'),
    text: '슬픔',
    description: '테스트2'
  },
  {
    id: 3,
    uri: require('../assets/images/test.png'),
    text: '불안',
    description: '테스트3'
  }
];

const SelectEmotionPage = () => {
  const { getScaleSize } = useScale();
  const selectedEmotion = useAppSelector((state) => state.diarySlice.selectedEmotion);

  const handleSelectEmotion = () => {
    const emotion: EmotionDiaryDTO = {
      emotionId: selectedEmotion?.id,
    }
    navigate('일기작성', emotion);
  }
  return (
    <>
      <NavigationBarOrga />
      <View className="bg-white first:justify-center items-center">
        <TitleText style={{ marginTop: getScaleSize(15), marginBottom: getScaleSize(44)}}>
          오늘 너의 마음과{"\n"}
          가장 닮은 친구를 골라줘
        </TitleText>

        <EmotionCarouselList emotionData={TEST_DATA} />

        <View 
          className="w-full"
          style={{ marginTop: getScaleSize(92) }}
        >
          <ActionButton onPress={handleSelectEmotion}>
            친구 선택 완료
          </ActionButton>
        </View>
      </View>
    </>
  )
}

export default SelectEmotionPage;