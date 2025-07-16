import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';

interface UseBottomSheetOptions {
  snapPoints?: Array<string | number>;
}

export function useBottomSheet({ snapPoints = ['25%', '50%'] }: UseBottomSheetOptions) {
  const sheetRef = useRef<BottomSheet>(null);
  const points = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('>>>', index);
  }, []);

  return {
    sheetRef,
    snapPoints: points,
    handleSheetChanges,
  };
}
