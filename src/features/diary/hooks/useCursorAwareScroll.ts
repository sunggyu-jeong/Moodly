// src/hooks/useCursorAwareScroll.ts
import { RefObject, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  KeyboardEvent as RNKeyboardEvent,
  ScrollView,
  TextInputContentSizeChangeEventData,
  TextInputSelectionChangeEventData,
} from 'react-native';

/** anything that supports measure(callback) */
interface Measurable {
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
  getText?: () => string;
}

interface UseCursorAwareScrollOptions {
  /** 키보드 위에 달린 커스텀 액세서리 높이(px) */
  accessoryHeight?: number;
  /** 키보드 show/hide 애니메이션 지속배수 */
  multiplier?: number;
  /** 스크롤 애니메이션 옵션 (duration, easing 함수 등) */
  scrollConfig?: {
    duration?: number;
    easing?: (value: number) => number;
  };
}

/**
 * TextInput 포커스·커서 이동 시, 그 위치가
 * 키보드(또는 악세서리) 바로 위로 스크롤 되게 해주는 훅.
 *
 * @returns
 * - scrollRef: 스크롤 가능한 컨테이너(ref에 전달)
 * - onFocus: TextInput onFocus에 연결
 * - onSelectionChange: multiline TextInput onSelectionChange에 연결
 * - onContentSizeChange: multiline TextInput onContentSizeChange에 연결
 */
export function useCursorAwareScroll({
  accessoryHeight = 40,
  scrollConfig = {},
}: UseCursorAwareScrollOptions = {}) {
  const scrollRef = useRef<ScrollView>(null);
  const [kbHeight, setKbHeight] = useState(0);
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const contentHeightRef = useRef(0);

  // 1) 키보드 높이 추적
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: RNKeyboardEvent) => {
      setKbHeight(e.endCoordinates.height);
    };
    const onHide = () => {
      setKbHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 내부에서 사용하는 공통 스크롤 함수
  const scrollToCursor = (inputRef: RefObject<Measurable | null>) => {
    const input = inputRef.current;
    if (!input || kbHeight === 0) return;

    input.measure((_x, _y, _w, h, _px, py) => {
      const text = input.getText?.() ?? '';
      const cursorIndex = selectionRef.current.start;
      const textLength = text.length || 1; // 0으로 나누는 걸 방지

      // 1) 인덱스 비율 계산
      const ratio = cursorIndex / textLength;

      // 2) 상대 Y 위치 계산
      const relativeCursorY = ratio * contentHeightRef.current;

      // 3) 화면 절대 Y 좌표
      const absoluteCursorY = py + relativeCursorY;

      console.log('>>>> 게산식', ratio, relativeCursorY, absoluteCursorY);
      const windowH = Dimensions.get('window').height;
      const targetY =
        py - (windowH - kbHeight - accessoryHeight) + (scrollConfig.duration ? 0 : 8);

      scrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

  // 2) onFocus 시 스크롤 처리
  const onFocus = (inputRef: RefObject<Measurable | null>) => () => {
    scrollToCursor(inputRef);
  };

  // 3) multiline 커서 이동 시 스크롤 보정
  const onSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    selectionRef.current = e.nativeEvent.selection;
  };

  // 4) multiline 컨텐츠 사이즈 변할 때 스크롤 재조정
  const onContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    contentHeightRef.current = e.nativeEvent.contentSize.height;
  };

  return {
    scrollRef,
    onFocus,
    onSelectionChange,
    onContentSizeChange,
  };
}
