import { useScale } from "../../hooks";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TextInput, View } from "react-native";

const DiaryTextBox = forwardRef((_, ref) => {
  const [text, setText]  = useState("");
  const { getScaleSize } = useScale();

  useImperativeHandle(ref, () => ({
    getText: () => text
  }));

  return (
    <View className="w-full relative">
      <TextInput 
        className="mx-[0px] bg-[white] rounded-[20px] pt-[67px] pb-[40px] text-pretendard text-[15px]"
        style={{ maxHeight: getScaleSize(263), minHeight: getScaleSize(150) }}
        placeholder="왜 그 감정을 느꼈는지 알려줘"
        value={text}
        onChangeText={setText}
        maxLength={500}
        multiline
        textAlignVertical="top"
      />
    </View>
  )
});

export default DiaryTextBox;