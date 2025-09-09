import { useCallback, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const usePagerController = <T>(opts: { onLeft: () => void; onRight: () => void }) => {
  const flatListRef = useRef<FlatList<T>>(null);
  const isScrollingRef = useRef(false);

  const scrollToMiddle = useCallback((animated = false) => {
    flatListRef?.current?.scrollToIndex({ index: 1, animated });
  }, []);

  const handlePageChange = useCallback(
    (nativeEvent: NativeScrollEvent) => {
      if (isScrollingRef.current) {
        return;
      }
      const ratio = nativeEvent.contentOffset.x / SCREEN_WIDTH;

      if (ratio <= 0.3) {
        isScrollingRef.current = true;
        scrollToMiddle(false);
        opts.onLeft();
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      } else if (ratio >= 1.7) {
        isScrollingRef.current = true;
        scrollToMiddle(false);
        opts.onRight();
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    },
    [opts, scrollToMiddle],
  );

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS === 'ios') {
        handlePageChange(nativeEvent);
      }
    },
    [handlePageChange],
  );

  const onMomentumScrollEnd = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS === 'android') {
        handlePageChange(nativeEvent);
      }
    },
    [handlePageChange],
  );
  return { flatListRef, onScroll, onMomentumScrollEnd, scrollToMiddle };
};
