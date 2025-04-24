import { forwardRef, useImperativeHandle, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getScaleSize } from '../../hooks';
export interface DiaryTextBoxHandle {
  getText: () => string;
  setText: (text: string) => void;
}

interface DiaryTextBoxProps {
  initialText?: string;
  onFocus: () => void;
  onBlur: () => void;
}

const DiaryTextBox = forwardRef<DiaryTextBoxHandle, DiaryTextBoxProps>(
  (
    { initialText = '', ...props }: DiaryTextBoxProps,
    ref: React.Ref<DiaryTextBoxHandle>
  ) => {
    const [text, setText] = useState(initialText);

    useImperativeHandle(ref, () => ({
      getText: () => text,
      setText,
    }));

    return (
      <View className="w-full flex-1 relative">
        <TextInput
          className="flex-1 mx-[0px] bg-transparent rounded-[20px] pt-[67px] text-pretendard text-[15px] pb-40 leading-6"
          style={{ flex: 1, fontSize: getScaleSize(15), minHeight: getScaleSize(150) }}
          {...props}
          placeholder="왜 그 감정을 느꼈는지 알려줘"
          value={text}
          onChangeText={setText}
          maxLength={500}
          multiline
          textAlignVertical="top"
        />
      </View>
    );
  }
);

export default DiaryTextBox;
