import { useScale } from "../hooks";
import ToolTipView from "../components/atoms/ToolTipView.atom";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import DiaryTextBox from "../components/atoms/DiaryTextBox.atom";
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'
import { useRef } from "react";
import { isNotEmpty, navigate } from "../utils";

const WriteDiaryPage = () => {
  const { getScaleSize } = useScale();
  const textBoxRef = useRef<{ getText: () => string }>(null);

  const handleSave = () => {
    const text = textBoxRef.current?.getText();
    if (isNotEmpty(text)) {
      console.log("저장된 일기:", text);
      //FIXME: - 여기에 저장 로직 추가
      // navigate("작성완료");
    }
  }

  return (
    <>
      <NavigationBarOrga />
      <ScrollView 
        className="bg-white flex-1" 
        contentContainerStyle={{ alignItems: 'center',paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <ToolTipView style={{ marginBottom: getScaleSize(14) }} />
        <View 
          className="bg-[#D9D9D9] aspect-square w-1/3 rounded-full"
          style={{ marginBottom: getScaleSize(32)}} />
        <DiaryTextBox ref={textBoxRef} />
      </ScrollView>
      <KeyboardAccessoryView
        alwaysVisible={false}
        style={{
          backgroundColor: '#ffffff',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <View 
          className="w-full h-[41px] px-4 py-2 border-t border-gray-300 flex-row justify-end items-center"
        >
          <TouchableOpacity onPress={() => { navigate("작성완료") }}>
            <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>저장</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAccessoryView>
    </>
  )
}

export default WriteDiaryPage;