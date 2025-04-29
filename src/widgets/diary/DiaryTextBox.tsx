import { getScaleSize } from '@/hooks';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputFocusEventData,
  View,
} from 'react-native';
export interface DiaryTextBoxHandle {
  getText: () => string;
}

interface DiaryTextBoxProps {
  initialText?: string;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
}

const DiaryTextBox = forwardRef<DiaryTextBoxHandle, DiaryTextBoxProps>(
  (
    { initialText = '', onFocus, onBlur, onContentSizeChange }: DiaryTextBoxProps,
    ref: React.Ref<DiaryTextBoxHandle>
  ) => {
    const [text, setText] = useState(initialText);

    useEffect(() => {
      setText(initialText);
    }, [initialText]);

    useImperativeHandle(ref, () => ({
      getText: () => text,
      setText: (value: string) => {
        setText(value);
      },
    }));

    return (
      <View className="w-full flex-1 relative">
        <TextInput
          className="flex-1 mx-[0px] bg-transparent rounded-[20px] text-pretendard text-[15px] pb-40 leading-6"
          style={{
            fontSize: getScaleSize(15),
            minHeight: getScaleSize(150),
            paddingTop: getScaleSize(67),
          }}
          placeholder="왜 그 감정을 느꼈는지 알려줘"
          value={text}
          maxLength={500}
          multiline
          textAlignVertical="top"
          onChangeText={(value) => setText(value)}
          onContentSizeChange={(e) => {
            if (onContentSizeChange) onContentSizeChange(e);
          }}
          onFocus={(e) => {
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
          }}
        />
      </View>
    );
  }
);

export default DiaryTextBox;
