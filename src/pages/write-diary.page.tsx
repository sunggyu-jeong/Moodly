import { useAppDispatch, useAppSelector, useRealm, useScale } from "../hooks";
import ToolTipView from "../components/atoms/ToolTipView.atom";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { View, Image, ScrollView } from "react-native";
import DiaryTextBox from "../components/atoms/DiaryTextBox.atom";
import { useRef } from "react";
import { isNotEmpty, navigate } from "../utils";
import { IMAGES } from "../assets/images";
import { addDiaryThunk, setSelectedDiary } from "../redux/slice/diarySlice";
import ActionButtonAtom from "../components/atoms/ActionButton.atom";

const WriteDiaryPage = () => {
  const { getScaleSize } = useScale();
  const textBoxRef = useRef<{ getText: () => string }>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const todayDiary = useAppSelector((state) => state.diarySlice.todayDiary);
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();

  const handleSave = async () => {
    const realm = await openRealm();
    const text = textBoxRef.current?.getText();
    // 텍스트 최소 길이
    if (isNotEmpty(text) && isNotEmpty(realm)) {
      console.log("저장된 일기:", text);
      const diary = { ...todayDiary, description: text };
      await dispatch(addDiaryThunk({ realm, data: diary }));
      await closeRealm();
      await dispatch(setSelectedDiary(diary));
      navigate("Complete");
    }
  }

  return (
    <>
      <NavigationBarOrga />
      <ScrollView 
        ref={scrollViewRef}
        className="bg-white flex-1" 
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingBottom: 150,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ToolTipView style={{ marginTop: getScaleSize(17.5), marginBottom: getScaleSize(14) }} />
        <Image
          source={IMAGES.smile}
          style={{ marginBottom: getScaleSize(32), width: getScaleSize(137), height: getScaleSize(137) }} />
        <DiaryTextBox ref={textBoxRef} />
        <View className="flex-1" />
        <View 
          className="w-full absolute"
          style={{ marginBottom: getScaleSize(57) }}
        >
          <ActionButtonAtom onPress={handleSave}>
            작성완료
          </ActionButtonAtom>
        </View>
      </ScrollView>
    </>
  )
}

export default WriteDiaryPage;