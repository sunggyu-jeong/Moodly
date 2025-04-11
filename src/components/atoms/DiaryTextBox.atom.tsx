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
        className="mx-[25px] bg-[#F3F1EC] rounded-[20px] px-[12px] pt-[12px] pb-[40px] text-pretendard text-[15px]"
        style={{ maxHeight: getScaleSize(263), minHeight: getScaleSize(150) }}
        placeholder=""
        value={text}
        onChangeText={setText}
        maxLength={500}
        multiline
        textAlignVertical="top"
      />
      <Text
        style={{
          position: 'absolute',
          right: 48,
          bottom: 24,
          color: '#999',
          fontSize: 15
        }}
      >{`${text.length}/500`}</Text>
    </View>
  )
});

export default DiaryTextBox;