import { getScaleSize } from '@shared/hooks';
import { useBottomSheet } from '@shared/hooks/useBottomSheet';
import BottomSheetWrapper from '@shared/ui/elements/BottomSheetWrapper';
import SocialLoginGroup, { SOCIAL_LOGIN_ENTRANCE } from '@shared/ui/elements/SocialLoginGroup';
import { H2 } from '@shared/ui/typography/H2';
import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

export interface SocialLoginSheetHandle {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}
const MIN_HEIGHT = 300;

export const SocialLoginSheet = forwardRef<SocialLoginSheetHandle>((_, ref) => {
  const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({
    snapPoints: [MIN_HEIGHT, '41%'],
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
      <View className="absolute w-full items-center mt-[43px]">
        <View
          className="gap-2"
          style={{ marginBottom: getScaleSize(55) }}
        >
          <H2 weight="semibold">로그인</H2>
        </View>
        <SocialLoginGroup entrance={SOCIAL_LOGIN_ENTRANCE.SETTING} />
      </View>
    </BottomSheetWrapper>
  );
});
