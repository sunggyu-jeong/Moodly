import { goBack } from '@/shared';
import { useBottomSheet } from '@/shared/hooks/useBottomSheet';
import BottomSheetWrapper from '@/shared/ui/elements/BottomSheetWrapper';
import { H3 } from '@/shared/ui/typography/H3';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { SetNicknameForm } from '../../set-nickname/ui/SetNicknameForm';
import type { BottomSheetHandler } from './SocialLoginSheet';

const MIN_HEIGHT = 300;

export const ChangeNicknameSheet = forwardRef<BottomSheetHandler>((_, ref) => {
  const { sheetRef, snapPoints, handleSheetChanges } = useBottomSheet({
    snapPoints: [MIN_HEIGHT, '31.3%'],
  });
  const [formKey, setFormKey] = useState(0);

  useImperativeHandle(ref, () => ({
    expand: () => sheetRef.current?.expand(),
    collapse: () => sheetRef.current?.collapse?.(),
    close: () => sheetRef.current?.close?.(),
  }));

  const handleSuccess = () => {
    goBack();
  };

  const handleSheetStateChange = (index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
      setFormKey(prevKey => prevKey + 1);
    }
    handleSheetChanges(index);
  };

  return (
    <BottomSheetWrapper
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetStateChange}
    >
      <BottomSheetView style={styles.container}>
        <H3 weight="semibold">닉네임 변경</H3>
        <SetNicknameForm
          key={formKey}
          inputBackgroundColor="white"
          onSuccess={handleSuccess}
        />
      </BottomSheetView>
    </BottomSheetWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
});
