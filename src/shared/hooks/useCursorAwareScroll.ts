import { RefObject, useCallback, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputSelectionChangeEventData,
  TextLayoutEventData,
  findNodeHandle,
} from 'react-native';
import { useKeyboardHeight } from './useKeyboardHeight';

type LineInfo = TextLayoutEventData['lines'][0];

export function useCursorAwareScroll(scrollViewRef: RefObject<ScrollView | null>) {
  const inputRef = useRef<TextInput>(null);
  const [lines, setLines] = useState<LineInfo[]>([]);
  const keyboardHeight = useKeyboardHeight();

  const onTextLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setLines(e.nativeEvent.lines);
  }, []);

  const onSelectionChange = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const pos = e.nativeEvent.selection.start;
      let charCount = 0,
        lineY = 0;
      for (const line of lines) {
        if (pos <= charCount + line.text.length) {
          lineY = line.y;
          break;
        }
        charCount += line.text.length;
      }

      const scrollHandle = findNodeHandle(scrollViewRef.current);
      const input = inputRef.current;
      if (!scrollHandle || !input) return;

      // TextInput 위치(스크롤뷰 콘텐츠 기준) 측정
      input.measureLayout(
        scrollHandle,
        (_x, y /*TextInput top*/) => {
          const targetY = Math.max(0, y + lineY - keyboardHeight);
          scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
        },
        () => {}
      );
    },
    [lines, scrollViewRef, keyboardHeight]
  );

  return { inputRef, onTextLayout, onSelectionChange };
}
