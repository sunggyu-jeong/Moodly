import { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TextInput, View } from "react-native";

const DiaryTextBox = forwardRef((_, ref) => {
  const [text, setText]  = useState("");

  useImperativeHandle(ref, () => ({
    getText: () => text
  }));

  return (
    <View className="h-[158px] w-full">
      <TextInput 
        className="h-[140px] mx-[25px] bg-gray-300 rounded-[20px] px-[12px] py-[12px] text-pretendard text-[15px]"
        placeholder=""
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />
      <Text className="ml-9 mr-[25px] mt-2  text-pretendard font-semibold tracking-[-0.5px]">
        {`(${text.length}/500)`}
      </Text>
    </View>
  )
});

export default DiaryTextBox;