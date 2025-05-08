// src/screens/WriteDiary.tsx
import { useCallback, useMemo, useRef } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import {
  addDiaryThunk,
  modifyDiaryThunk,
  setSelectedDiary,
} from '@/features/diary/model/diary.slice';
import { ICON_DATA } from '@/shared/constants';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '@/shared/hooks';
import { isNotEmpty, navigate } from '@/shared/lib';
import colors from '@/shared/styles/colors';
import KeyboardAccessory from '@/shared/ui/elements/KeyboardAccessory';
import { NaviActionButtonProps } from '@/shared/ui/elements/NaviActionButton';
import { H2 } from '@/shared/ui/typography/H2';
import NaviDismiss from '@/widgets/navigation-bar/ui/NaviDismiss';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

import { useCursorAwareScroll } from '../../hooks/useCursorAwareScroll';
import { useKeyboardAccessoryAnimation } from '../../hooks/useKeyboardAccessoryAnimation';
import DiaryTextBox, { DiaryTextBoxHandle } from '../components/DiaryTextBox';

const WriteDiary = () => {
  const dispatch = useAppDispatch();
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const { openRealm, closeRealm } = useRealm();
  const actionButtons = useMemo<NaviActionButtonProps[]>(
    () => [{ item: <NaviDismiss />, disabled: false }],
    []
  );
  const accessoryAnimatedStyle = useKeyboardAccessoryAnimation();
  const {
    scrollRef,
    onFocus: handleInputFocus,
    onSelectionChange,
    onContentSizeChange,
  } = useCursorAwareScroll({
    accessoryHeight: getScaleSize(40),
    multiplier: 1.19,
    scrollConfig: { duration: 200 },
  });
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);

  const handleSave = useCallback(async () => {
    const realm = await openRealm();
    const text = textBoxRef.current?.getText();
    if (!isNotEmpty(text) || !isNotEmpty(realm)) return;

    const diary = { ...todayDiary, description: text };
    const thunk = isNotEmpty(selectedDiary)
      ? modifyDiaryThunk({ realm, emotionId: selectedDiary.emotionId ?? -1, data: diary })
      : addDiaryThunk({ realm, data: diary });

    const result = await dispatch(thunk);
    diary.emotionId = result.payload as number;
    await closeRealm();
    dispatch(setSelectedDiary(diary));
    navigate('DiaryStack', { screen: 'Complete' });
  }, [openRealm, closeRealm, dispatch, todayDiary, selectedDiary]);

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        className="bg-transparent"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={getScaleSize(40)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <H2 weight="semibold">왜 이 감정을 느꼈나요?</H2>
            <Image
              style={styles.emotionImage}
              source={ICON_DATA.find(el => el.id === todayDiary?.iconId)?.iconBig}
            />

            <DiaryTextBox
              ref={textBoxRef}
              initialText={isNotEmpty(selectedDiary) ? selectedDiary.description : ''}
              onFocus={handleInputFocus(textBoxRef)}
              onSelectionChange={onSelectionChange}
              onContentSizeChange={onContentSizeChange}
            />

            <View className="flex-1" />
          </ScrollView>
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.accessory, accessoryAnimatedStyle]}>
          <KeyboardAccessory onPress={handleSave} />
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  accessory: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  contentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: getScaleSize(32),
    paddingHorizontal: getScaleSize(24),
    paddingTop: getScaleSize(28),
  },
  emotionImage: {
    height: getScaleSize(190),
    marginBottom: getScaleSize(32),
    marginTop: getScaleSize(9),
    width: getScaleSize(190),
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scroll: {
    backgroundColor: colors.common.white,
    flex: 1,
  },
});

export default WriteDiary;
