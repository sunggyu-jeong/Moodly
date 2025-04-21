import { useAppDispatch, useAppSelector, useRealm, useScale } from "../hooks";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { View, Image, ScrollView, TouchableOpacity, Text } from "react-native";
import DiaryTextBox from "../components/atoms/DiaryTextBox.atom";
import { useRef } from "react";
import { isNotEmpty, navigate } from "../utils";
import { IMAGES } from "../assets/images";
import { addDiaryThunk, setSelectedDiary } from "../redux/slice/diarySlice";
import { NaviActionButtonAtomProps } from "../components/atoms/NaviActionButton.atom";
import TitleText from "../components/atoms/TitleText.atom";
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import NaviDismiss from "../components/molecules/NaviDismiss.mol";

const WriteDiaryPage = () => {
  const { getScaleSize } = useScale();
  const textBoxRef = useRef<{ getText: () => string }>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const todayDiary = useAppSelector((state) => state.diarySlice.todayDiary);
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();

  const actionButtons: NaviActionButtonAtomProps[] = [{
    item: <NaviDismiss />,
    disabled: false,
  }]

  const handleSave = async () => {
    const realm = await openRealm();
    const text = textBoxRef.current?.getText();
    // 텍스트 최소 길이
    if (isNotEmpty(text) && isNotEmpty(realm)) {
      console.log("저장된 일기:", text);
      const diary = { ...todayDiary, description: text };
      const result = await dispatch(addDiaryThunk({ realm, data: diary }));
      const emotionId = result.payload as number | undefined;
      diary.emotionId = emotionId;
      await closeRealm();
      await dispatch(setSelectedDiary(diary));
      navigate("DiaryStack", { screen: "Complete" });
    }
  }

  return (
    <>
      <NavigationBarOrga actionButtons={actionButtons} />
      <ScrollView 
        ref={scrollViewRef}
        className="bg-white flex-1" 
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <TitleText style={{ marginTop: getScaleSize(63) }}>
          어떤 일이 있었는지 말해줄래?
        </TitleText> 
        <Image
          source={IMAGES.smile}
          style={{ 
            marginTop: getScaleSize(26), 
            marginBottom: getScaleSize(32), 
            width: getScaleSize(137), 
            height: getScaleSize(137) }} 
        />
        <DiaryTextBox ref={textBoxRef} />
        <View className="flex-1" />
      </ScrollView>
      <KeyboardAccessoryView>
        <TouchableOpacity onPress={handleSave} className="ml-auto w-10 mr-5">
          <Text 
            className="font-semibold text-right leading-10 whitespace-nowrap"
            style={{ fontSize: getScaleSize(16) }}
          >
            저장
          </Text>
        </TouchableOpacity>
      </KeyboardAccessoryView>
    </>
  )
}

export default WriteDiaryPage;