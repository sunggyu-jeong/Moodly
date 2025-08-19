import { useCallback, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const usePagerController = <T>(opts: { onLeft: () => void; onRight: () => void }) => {
  const flatListRef = useRef<FlatList<T>>(null);
  const isScrollingRef = useRef(false);

  const scrollToMiddle = useCallback((animated = false) => {
    flatListRef?.current?.scrollToIndex({ index: 1, animated });
  }, []);

  const onMomentumScrollEnd = useCallback(() => {
    isScrollingRef.current = false;
  }, []);

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingRef.current) {
        return;
      }
      const ratio = nativeEvent.contentOffset.x / SCREEN_WIDTH;

      if (ratio <= 0.3) {
        isScrollingRef.current = true;
        scrollToMiddle(false);
        opts.onLeft();
      } else if (ratio >= 1.7) {
        isScrollingRef.current = true;
        scrollToMiddle(false);
        opts.onRight();
      }
    },
    [opts, scrollToMiddle],
  );
  return { flatListRef, onScroll, onMomentumScrollEnd, scrollToMiddle };
};
