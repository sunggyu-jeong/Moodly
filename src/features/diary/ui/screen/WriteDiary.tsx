// src/screens/WriteDiary.tsx
import { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
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

import { useCursorAwareScroll } from '../../../../shared/hooks/useCursorAwareScroll';
import { common } from '../../../../shared/styles/colors';
import { useDiarySave } from '../../hooks/useDiarySave';
import { DiaryTextBoxHandle } from '../components/DiaryTextBox';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const WriteDiary = () => {
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const save = useDiarySave(textBoxRef);
  const { isVisible } = useKeyboardState();
  const scrollRef = useRef<ScrollView>(null);
  const { inputRef, onTextLayout, onSelectionChange } = useCursorAwareScroll(scrollRef);
  const [text, setText] = useState('');
  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.keyboardAvoiding}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center justify-center bg-common-white">
            <H2 weight="semibold">왜 이 감정을 느꼈나요?</H2>
            <Image
              style={styles.emotionImage}
              source={ICON_DATA.find(el => el.id === todayDiary?.iconId)?.iconBig}
            />
          </View>

          <View className="flex-1">
            <TextInput
              ref={inputRef}
              multiline
              value={text}
              onChangeText={setText}
              onTextLayout={onTextLayout}
              onSelectionChange={onSelectionChange}
              scrollEnabled={false} /* TextInput 내부 스크롤 OFF */
              // style={styles.textInput}
              placeholder="그 감정을 느낀 순간의 생각을 적어보세요"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
