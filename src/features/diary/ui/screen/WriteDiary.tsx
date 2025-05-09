// src/screens/WriteDiary.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardStickyView, useKeyboardState } from 'react-native-keyboard-controller';

import KeyboardAwareProvider from '@/app/provider/KeyboardAwareProvider';
import { ICON_DATA } from '@/shared/constants';
import { getScaleSize, useAppSelector } from '@/shared/hooks';
import KeyboardAccessory from '@/shared/ui/elements/KeyboardAccessory';
import { NaviActionButtonProps } from '@/shared/ui/elements/NaviActionButton';
import { H2 } from '@/shared/ui/typography/H2';
import NaviDismiss from '@/widgets/navigation-bar/ui/NaviDismiss';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

import { useDiarySave } from '../../hooks/useDiarySave';
import DiaryTextBox, { DiaryTextBoxHandle } from '../components/DiaryTextBox';

const WriteDiary = () => {
  const actionButtons = useMemo<NaviActionButtonProps[]>(
    () => [{ item: <NaviDismiss />, disabled: false }],
    []
  );
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const save = useDiarySave(textBoxRef);
  const { isVisible } = useKeyboardState();

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="items-center justify-center bg-common-white">
          <H2 weight="semibold">왜 이 감정을 느꼈나요?</H2>
          <Image
            style={styles.emotionImage}
            source={ICON_DATA.find(el => el.id === todayDiary?.iconId)?.iconBig}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAwareProvider style={styles.keyboardAvoiding}>
          <DiaryTextBox ref={textBoxRef} />

          <View className="flex-1" />
        </KeyboardAwareProvider>
      </TouchableWithoutFeedback>

      {isVisible && (
        <KeyboardStickyView>
          <KeyboardAccessory onPress={save} />
        </KeyboardStickyView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emotionImage: {
    height: getScaleSize(190),
    marginBottom: getScaleSize(32),
    marginTop: getScaleSize(9),
    width: getScaleSize(190),
  },
  keyboardAvoiding: {
    flex: 1,
    paddingHorizontal: getScaleSize(20),
  },
});

export default WriteDiary;
