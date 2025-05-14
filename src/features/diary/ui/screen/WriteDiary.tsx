// src/screens/WriteDiary.tsx
import { useRef } from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardToolbar, useKeyboardState } from 'react-native-keyboard-controller';

import { ICON_DATA } from '@/shared/constants';
import { getScaleSize, useAppSelector } from '@/shared/hooks';
import {
  KeyboardAccessoryButton,
  KeyboardAccessoryTheme,
} from '@/shared/ui/elements/KeyboardAccessory';
import { H2 } from '@/shared/ui/typography/H2';
import NaviDismiss from '@/widgets/navigation-bar/ui/NaviDismiss';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

import { common } from '../../../../shared/styles/colors';
import { useDiarySave } from '../../hooks/useDiarySave';
import DiaryTextBox, { DiaryTextBoxHandle } from '../components/DiaryTextBox';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const WriteDiary = () => {
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const save = useDiarySave(textBoxRef);
  const { isVisible } = useKeyboardState();

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <ScrollView style={styles.keyboardAvoiding}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="items-center justify-center bg-common-white">
            <H2 weight="semibold">왜 이 감정을 느꼈나요?</H2>
            <Image
              style={styles.emotionImage}
              source={ICON_DATA.find(el => el.id === todayDiary?.iconId)?.iconBig}
            />
          </View>
        </TouchableWithoutFeedback>
        <DiaryTextBox ref={textBoxRef} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>
      </ScrollView>

      <KeyboardToolbar
        className="h-52"
        button={KeyboardAccessoryButton}
        theme={KeyboardAccessoryTheme}
        showArrows={false}
      />
      {/* <KeyboardStickyView>
        <KeyboardAccessory onPress={save} />
      </KeyboardStickyView> */}
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
    backgroundColor: common.white,
    flex: 1,
    paddingHorizontal: getScaleSize(20),
  },
});

export default WriteDiary;
