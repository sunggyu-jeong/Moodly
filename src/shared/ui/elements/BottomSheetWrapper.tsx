// shared/ui/BottomSheetWrapper.tsx
import { common, gray } from '@/shared/styles/colors';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';

export interface BottomSheetWrapperProps extends BottomSheetProps {
  children: React.ReactNode;
  snapPoints: Array<string | number>;
  onChange?: (index: number) => void;
}

/**
 *  BottomSheetWrapper
 * - index=-1: 초기 숨김
 * - backdropComponent: 고정된 반투명 검정 배경
 * - backgroundStyle: 시트 배경 흰색
 */
const BottomSheetWrapper = forwardRef<BottomSheetMethods, BottomSheetWrapperProps>(
  ({ children, snapPoints, onChange, ...rest }, ref) => (
    <BottomSheet
      ref={ref}
      index={-1}
      handleIndicatorStyle={styles.indicatorStyle}
      snapPoints={snapPoints}
      bottomInset={24}
      detached
      onChange={onChange}
      backgroundStyle={styles.background}
      backdropComponent={backdropProps => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={styles.bottomSheetBackground}
        />
      )}
      {...rest}
    >
      <BottomSheetView style={styles.bottomSheetView}>{children}</BottomSheetView>
    </BottomSheet>
  ),
);

BottomSheetWrapper.displayName = 'BottomSheetWrapper';

const styles = StyleSheet.create({
  background: {
    backgroundColor: common.white,
    borderRadius: 24,
    marginLeft: 16,
    marginRight: 16,
  },
  bottomSheetBackground: { backgroundColor: common.overlay },
  bottomSheetView: { flex: 1 },
  indicatorStyle: {
    backgroundColor: gray[300],
    borderRadius: 10,
    height: 4,
    width: 45,
  },
});

export default BottomSheetWrapper;
