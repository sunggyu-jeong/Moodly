import { useCallback, useMemo, useRef } from 'react';
import {
  Image,
  Keyboard,
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

import { useKeyboardAccessoryAnimation } from '../../hooks/useKeyboardAccessoryAnimation';
import DiaryTextBox, { DiaryTextBoxHandle } from '../components/DiaryTextBox';

const WriteDiary = () => {
  const textBoxRef = useRef<DiaryTextBoxHandle | null>(null);
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const actionButtons = useMemo<NaviActionButtonProps[]>(
    () => [{ item: <NaviDismiss />, disabled: false }],
    []
  );
  const accessoryAnimatedStyle = useKeyboardAccessoryAnimation();

  const handleSave = useCallback(async () => {
    const realm = await openRealm();
    const text = textBoxRef.current?.getText();

    // 텍스트 및 Realm 체크
    if (!isNotEmpty(text) || !isNotEmpty(realm)) return;

    const diary = { ...todayDiary, description: text };

    // 수정 또는 추가 Thunk 결정
    const thunk = isNotEmpty(selectedDiary)
      ? modifyDiaryThunk({
          realm,
          emotionId: selectedDiary?.emotionId ?? -1,
          data: diary,
        })
      : addDiaryThunk({ realm, data: diary });

    // 실행 및 결과 처리
    const result = await dispatch(thunk);
    const emotionId = result.payload as number | undefined;
    diary.emotionId = emotionId;

    await closeRealm();
    dispatch(setSelectedDiary(diary));
    navigate('DiaryStack', { screen: 'Complete' });
  }, [openRealm, closeRealm, dispatch, textBoxRef, todayDiary, selectedDiary]);

  return (
    <>
      <NavigationBar actionButtons={actionButtons} />
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <ScrollView
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
              onFocus={e => {
                // Removed scrollRef usage
              }}
            />

            <View className="flex-1" />
          </ScrollView>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.accessory, accessoryAnimatedStyle]}>
          <KeyboardAccessory onPress={handleSave} />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  accessory: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  container: {
    backgroundColor: colors.common.white,
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
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
  scroll: {
    flex: 1,
  },
});

export default WriteDiary;
