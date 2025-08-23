import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import { goBack } from '@shared';
import { useAppDispatch } from '@shared/hooks';
import { useBottomSheet } from '@shared/hooks/useBottomSheet';
import BottomSheetWrapper from '@shared/ui/elements/BottomSheetWrapper';
import { H3 } from '@shared/ui/typography/H3';
import { forwardRef, useImperativeHandle } from 'react';
import { Keyboard, View } from 'react-native';

import { SetNicknameForm } from '../../set-nickname/ui/SetNicknameForm';
import type { BottomSheetHandler } from './SocialLoginSheet';

const MIN_HEIGHT = 300;

export const ChangeNicknameSheet = forwardRef<BottomSheetHandler>((_, ref) => {
  const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({
    snapPoints: [MIN_HEIGHT, '31.3%'],
  });
  const dispatch = useAppDispatch();

  useImperativeHandle(ref, () => ({
    expand: () => sheetRef.current?.expand(),
    collapse: () => sheetRef.current?.collapse?.(),
    close: () => sheetRef.current?.close?.(),
  }));

  const handleSuccess = () => {
    dispatch(setShowToastView({ visibility: true, message: '닉네임 변경 요청이 성공했어요.' }));
    goBack();
  };

  const handleSheetStateChange = (index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
    }
    handleSheetChanges(index);
  };

  return (
    <BottomSheetWrapper
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetStateChange}
    >
      <View className="flex-1 items-center pt-4">
        <H3 weight="semibold">닉네임 변경</H3>

        <SetNicknameForm
          inputBackgroundColor="white"
          onSuccess={handleSuccess}
        />
      </View>
    </BottomSheetWrapper>
  );
});
