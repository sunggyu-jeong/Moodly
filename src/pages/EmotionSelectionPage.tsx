import type { Diary } from '@entities/diary/model/diary.types';
import { setCurrentDiary, setSelectedIcon } from '@features/diary/model/diarySlice';
import { EmotionDisplaySelected, EmotionSelectionList } from '@features/emotion';
import {
  ActionButton,
  getScaleSize,
  H2,
  ICON_DATA,
  isNotEmpty,
  navigate,
  useAppDispatch,
  useAppSelector,
} from '@shared';
import { NaviDismiss, NavigationBar } from '@widgets/navigation-bar';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const EmotionSelectionPage = () => {
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector(state => state.diarySlice.selectedIcon);
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);

  const handleSelectEmotion = () => {
    const emotion: Partial<Diary> = {
      iconId: selectedEmotion?.id,
    };
    dispatch(setCurrentDiary(emotion));
    navigate('DiaryStack', { screen: 'EmotionDiaryWritePage' });
  };

  useEffect(() => {
    // 수정일 때 사용
    if (isModifyMode && isNotEmpty(selectedDiary)) {
      dispatch(setSelectedIcon(ICON_DATA.find(el => el.id === selectedDiary.iconId)));
      const emotion: Partial<Diary> = {
        iconId: selectedDiary?.iconId,
      };
      dispatch(setCurrentDiary(emotion));
    }
  }, [selectedDiary, dispatch, isModifyMode]);

  return (
    <>
      <NavigationBar
        showBackButton={false}
        actionButtons={actionButtons}
      />
      <SafeAreaView className="bg-common-white items-center flex-1 justify-between">
        <H2
          weight="semibold"
          style={styles.textStyle}
        >
          오늘 느낀 감정을 선택해주세요
        </H2>
        <EmotionDisplaySelected />
        <EmotionSelectionList emotionList={ICON_DATA} />

        <View
          className="w-full px-5"
          style={styles.buttonStyle}
        >
          <ActionButton onPress={handleSelectEmotion}>선택 완료</ActionButton>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    marginBottom: getScaleSize(54),
  },
  textStyle: {
    marginTop: getScaleSize(28),
  },
});

export default EmotionSelectionPage;
