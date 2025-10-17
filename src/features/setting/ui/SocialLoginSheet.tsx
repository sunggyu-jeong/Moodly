import { getScaleSize } from '@/shared/hooks';
import { useBottomSheet } from '@/shared/hooks/useBottomSheet';
import BottomSheetWrapper from '@/shared/ui/elements/BottomSheetWrapper';
import SocialLoginGroup, { SOCIAL_LOGIN_ENTRANCE } from '@/shared/ui/elements/SocialLoginGroup';
import { H3 } from '@/shared/ui/typography/H3';
import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

export interface BottomSheetHandler {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}
const MIN_HEIGHT = 300;

export const SocialLoginSheet = forwardRef<BottomSheetHandler>((_, ref) => {
  const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({
    snapPoints: [MIN_HEIGHT, '31.3%'],
  });

  useImperativeHandle(ref, () => ({
    expand: () => sheetRef.current?.expand(),
    collapse: () => sheetRef.current?.collapse?.(),
    close: () => sheetRef.current?.close?.(),
  }));

  return (
    <BottomSheetWrapper
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <View className="absolute w-full items-center mt-[8px]">
        <View style={{ marginBottom: getScaleSize(25) }}>
          <H3 weight="semibold">로그인</H3>
        </View>
        <SocialLoginGroup entrance={SOCIAL_LOGIN_ENTRANCE.SETTING} />
      </View>
    </BottomSheetWrapper>
  );
});
