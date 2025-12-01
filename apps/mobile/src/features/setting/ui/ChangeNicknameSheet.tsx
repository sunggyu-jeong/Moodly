import { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';

import { useBottomSheet } from '@/shared/hooks/useBottomSheet';
import { goBack } from '@/shared/lib/navigation.util';
import type { BottomSheetHandler } from '@/shared/types/bottomSheet';
import BottomSheetWrapper from '@/shared/ui/elements/BottomSheetWrapper';
import { H3 } from '@/shared/ui/typography/H3';

import { SetNicknameForm } from '../../set-nickname/ui/SetNicknameForm';

const MIN_HEIGHT = 300;

const ChangeNicknameSheet = forwardRef<BottomSheetHandler>((_, ref) => {
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

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <BottomSheetWrapper
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetStateChange}
    >
      <BottomSheetView style={styles.container}>
        <Pressable
          style={styles.overlay}
          onPress={handleDismissKeyboard}
        />
        <H3 weight="semibold">닉네임 변경</H3>
        <View
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          pointerEvents="auto"
          style={styles.form}
        >
          <SetNicknameForm
            key={formKey}
            inputBackgroundColor="white"
            onSuccess={handleSuccess}
          />
        </View>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  form: { flex: 1, width: '100%', zIndex: 3 },
});

ChangeNicknameSheet.displayName = 'ChangeNicknameSheet';
export default ChangeNicknameSheet;
