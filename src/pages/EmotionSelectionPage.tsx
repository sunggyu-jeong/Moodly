import type { Diary } from '@/entities/diary/model/diary.types';
import { setCurrentDiary, setSelectedIcon } from '@/features/diary/model/diarySlice';
import { EmotionDisplaySelected, EmotionSelectionList } from '@/features/emotion';
import {
  ActionButton,
  getScaleSize,
  H2,
  ICON_DATA,
  isNotEmpty,
  navigate,
  useAppDispatch,
  useAppSelector,
} from '@/shared';
import { NaviDismiss, NavigationBar } from '@/widgets/navigation-bar';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const EmotionSelectionPage = () => {
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector(state => state.diarySlice.selectedIcon);
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);

  const handleSelectEmotion = () => {
    if (!selectedEmotion) return;
    const emotion: Partial<Diary> = { iconId: selectedEmotion.id };
    dispatch(setCurrentDiary(emotion));
    navigate('DiaryStack', { screen: 'EmotionDiaryWritePage' });
  };

  useEffect(() => {
    if (isModifyMode && isNotEmpty(selectedDiary)) {
      const foundIcon = ICON_DATA.find(el => el.id === selectedDiary.iconId);
      if (foundIcon) {
        dispatch(setSelectedIcon(foundIcon));
        const emotion: Partial<Diary> = { iconId: selectedDiary.iconId };
        dispatch(setCurrentDiary(emotion));
      }
    }
  }, [selectedDiary, dispatch, isModifyMode]);

  return (
    <>
      <NavigationBar
        showBackButton={false}
        actionButtons={actionButtons}
      />
      <SafeAreaView style={styles.container}>
        <H2
          weight="semibold"
          style={styles.title}
        >
          오늘 느낀 감정을 선택해주세요
        </H2>
        <EmotionDisplaySelected />
        <View style={{ flex: 1 }} />
        <EmotionSelectionList emotionList={ICON_DATA} />
        <View style={styles.buttonContainer}>
          <ActionButton onPress={handleSelectEmotion}>선택 완료</ActionButton>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: getScaleSize(28),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: getScaleSize(20),
    marginBottom: getScaleSize(54),
  },
});

export default EmotionSelectionPage;
