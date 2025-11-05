import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';

import SocialLoginGroup, { SOCIAL_LOGIN_ENTRANCE } from '@/features/auth/ui/SocialLoginGroup';
import { useBottomSheet } from '@/shared/hooks/useBottomSheet';
import { getScaleSize } from '@/shared/hooks/useScale';
import BottomSheetWrapper from '@/shared/ui/elements/BottomSheetWrapper';
import { H3 } from '@/shared/ui/typography/H3';

export interface BottomSheetHandler {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}

const MIN_HEIGHT = 300;

const SocialLoginSheet = forwardRef<BottomSheetHandler>((_, ref) => {
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
      <View style={styles.container}>
        <View style={styles.header}>
          <H3 weight="semibold">로그인</H3>
        </View>
        <SocialLoginGroup entrance={SOCIAL_LOGIN_ENTRANCE.SETTING} />
      </View>
    </BottomSheetWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  header: {
    marginBottom: getScaleSize(25),
  },
});

SocialLoginSheet.displayName = 'SocialLoginSheet';
export default SocialLoginSheet;
