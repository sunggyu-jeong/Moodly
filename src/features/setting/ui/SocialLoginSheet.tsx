import { getScaleSize } from '@shared/hooks';
import { useBottomSheet } from '@shared/hooks/useBottomSheet';
import { gray } from '@shared/styles/colors';
import BottomSheetWrapper from '@shared/ui/elements/BottomSheetWrapper';
import SocialLoginGroup, { SOCIAL_LOGIN_ENTRANCE } from '@shared/ui/elements/SocialLoginGroup';
import { Body2 } from '@shared/ui/typography/Body2';
import { H2 } from '@shared/ui/typography/H2';
import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

export interface SocialLoginSheetHandle {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}

export const SocialLoginSheet = forwardRef<SocialLoginSheetHandle>((_, ref) => {
  const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({ snapPoints: ['41%'] });

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
          <H2 weight="semibold">계정 전환</H2>
          <Body2
            weight="regular"
            style={{ color: gray[400] }}
          >
            가입을 통해 기록을 소중히 보관하세요!
          </Body2>
        </View>
        <SocialLoginGroup entrance={SOCIAL_LOGIN_ENTRANCE.SETTING} />
      </View>
    </BottomSheetWrapper>
  );
});
