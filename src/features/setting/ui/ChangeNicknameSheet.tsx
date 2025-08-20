import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import { getScaleSize, useAppDispatch } from '@shared/hooks';
import { useBottomSheet } from '@shared/hooks/useBottomSheet';
import BottomSheetWrapper from '@shared/ui/elements/BottomSheetWrapper';
import { H3 } from '@shared/ui/typography/H3';
import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

import { goBack } from '../../../shared';
import { SetNicknameForm } from '../../set-nickname/ui/SetNicknameForm';
import type { BottomSheetHandler } from './SocialLoginSheet';

const MIN_HEIGHT = 300;

export const ChangeNicknameSheet = forwardRef<BottomSheetHandler>((_, ref) => {
  const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({
    snapPoints: [MIN_HEIGHT, '37.3%'],
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

  return (
    <BottomSheetWrapper
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <View className="absolute w-full items-center mt-[16px] space-between">
        <View
          className="gap-2"
          style={{ marginBottom: getScaleSize(30) }}
        >
          <H3 weight="semibold">닉네임 변경</H3>
        </View>

        <View className="w-full px-9">
          <SetNicknameForm onSuccess={handleSuccess} />
        </View>
      </View>
    </BottomSheetWrapper>
  );
});
