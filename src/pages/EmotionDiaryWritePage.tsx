import { DiarySaveButton } from '@/features/diary';
import { common, getScaleSize, H2, ICON_DATA, isNotEmpty, useAppSelector } from '@/shared';
import { NaviDismiss, NavigationBar } from '@/widgets/navigation-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import InputAccessoryView from 'react-native-input-accessory-view';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const EmotionDiaryWritePage = () => {
  const currentDiary = useAppSelector(state => state.diarySlice.currentDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const scrollRef = useRef<ScrollView>(null);

  const [text, setText] = useState('');

  useEffect(() => {
    setText(isNotEmpty(selectedDiary) ? (selectedDiary?.description ?? '') : '');
  }, [selectedDiary]);

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <H2 weight="semibold">왜 이 감정을 느꼈나요?</H2>
            <Image
              source={ICON_DATA.find(el => el.id === currentDiary?.iconId)?.iconBig}
              style={styles.emotionImage}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              multiline
              maxLength={1000}
              value={text}
              onChangeText={setText}
              scrollEnabled={false}
              placeholder="그 감정을 느낀 순간의 생각을 적어보세요"
              placeholderTextColor="#999999"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <InputAccessoryView
        spaceHeight={40 + (Platform.OS === 'android' ? 40 : 0)}
        extraHeight={0}
        renderView={() => DiarySaveButton(text)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: common.white,
    paddingHorizontal: getScaleSize(20),
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: common.white,
  },
  emotionImage: {
    width: getScaleSize(190),
    height: getScaleSize(190),
    marginTop: getScaleSize(9),
    marginBottom: getScaleSize(32),
  },
  inputWrapper: {
    flex: 1,
  },
  textInput: {
    minHeight: getScaleSize(128),
    paddingBottom: getScaleSize(40),
    fontSize: 16,
    color: '#000000',
  },
});

export default EmotionDiaryWritePage;
