// src/components/DiaryTextBox.tsx
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { getScaleSize, useAppSelector } from '@/shared/hooks';
import { isNotEmpty } from '@/shared/lib';
import { useCursorAwareScroll } from '../../../../shared/hooks/useCursorAwareScroll';

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
  scrollRef?: React.RefObject<ScrollView | null>;
}

const DiaryTextBox = forwardRef<DiaryTextBoxHandle, DiaryTextBoxProps>(({ scrollRef }, ref) => {
  const [text, setText] = useState('');
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const { inputRef, onTextLayout, onSelectionChange } = useCursorAwareScroll(
    scrollRef ?? { current: null }
  );

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
        className="bg-transparent rounded-[20px] text-pretendard text-h1 pb-40 leading-6 font-regular mt-5 pt-5"
        style={styles.textStyle}
        placeholder="그 감정을 느낀 순간의 생각을 적어보세요"
        value={text}
        maxLength={500}
        multiline
        textAlignVertical="top"
        onChangeText={value => setText(value)}
        onTextLayout={onTextLayout}
        onSelectionChange={onSelectionChange}
        scrollEnabled={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  textStyle: {
    fontSize: getScaleSize(15),
    minHeight: getScaleSize(150),
  },
});

export default DiaryTextBox;
