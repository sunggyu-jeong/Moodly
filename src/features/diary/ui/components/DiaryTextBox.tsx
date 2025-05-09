// src/components/DiaryTextBox.tsx
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputFocusEventData,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';

import { getScaleSize, useAppSelector } from '@/shared/hooks';
import { isNotEmpty } from '@/shared/lib';

export interface DiaryTextBoxHandle {
  getText: () => string;
  setText?: (value: string) => void;
  measure: (
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ) => void;
}

interface DiaryTextBoxProps {
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  /** 커서 이동 시 호출 */
  onSelectionChange?: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;
}

const DiaryTextBox = forwardRef<DiaryTextBoxHandle, DiaryTextBoxProps>(
  ({ onFocus, onBlur, onContentSizeChange, onSelectionChange }, ref) => {
    const [text, setText] = useState('');
    const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      setText(isNotEmpty(selectedDiary) ? (selectedDiary?.description ?? '') : '');
    }, [selectedDiary]);

    useImperativeHandle(ref, () => ({
      getText: () => text,
      setText: (value: string) => setText(value),
      measure: callback => {
        inputRef.current?.measure(callback);
      },
    }));

    return (
      <View className="w-full flex-1 relative">
        <TextInput
          ref={inputRef}
          className="flex-1 bg-transparent rounded-[20px] text-pretendard text-h1 pb-40 leading-6 font-regular"
          style={{
            fontSize: getScaleSize(15),
            minHeight: getScaleSize(150),
          }}
          placeholder="왜 그 감정을 느꼈는지 알려줘"
          value={text}
          maxLength={500}
          multiline
          textAlignVertical="top"
          onChangeText={value => setText(value)}
          onContentSizeChange={e => onContentSizeChange?.(e)}
          onSelectionChange={e => onSelectionChange?.(e)}
          onFocus={e => onFocus?.(e)}
          onBlur={e => onBlur?.(e)}
        />
      </View>
    );
  }
);

export default DiaryTextBox;
