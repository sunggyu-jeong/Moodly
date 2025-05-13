import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { EmotionDiaryDTO } from '@/entities/diary';
import { setSelectedIcon, setTodayDiary } from '@/features/diary/model/diary.slice';
import EmotionList from '@/features/emotion/ui/EmotionList';
import SelectedEmotion from '@/features/emotion/ui/SelectedEmotion';
import { ICON_DATA } from '@/shared/constants/Icons';
import { getScaleSize, useAppDispatch, useAppSelector } from '@/shared/hooks';
import { isNotEmpty, navigate } from '@/shared/lib';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { H2 } from '@/shared/ui/typography/H2';
import NaviDismiss from '@/widgets/navigation-bar/ui/NaviDismiss';
import NavigationBar from '@/widgets/navigation-bar/ui/NavigationBar';

const actionButtons = [{ item: <NaviDismiss />, disabled: false }];

const SelectEmotion = () => {
  const dispatch = useAppDispatch();
  const selectedEmotion = useAppSelector(state => state.diarySlice.selectedIcon);
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);

  const handleSelectEmotion = () => {
    const emotion: EmotionDiaryDTO = {
      iconId: selectedEmotion?.id,
    };
    dispatch(setTodayDiary(emotion));
    navigate('DiaryStack', { screen: 'WriteDiary' });
  };

  useEffect(() => {
    // 수정일 때 사용
    if (isModifyMode && isNotEmpty(selectedDiary)) {
      dispatch(setSelectedIcon(ICON_DATA.find(el => el.id === selectedDiary.iconId)));
      const emotion: EmotionDiaryDTO = {
        iconId: selectedDiary?.iconId,
      };
      dispatch(setTodayDiary(emotion));
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
        <SelectedEmotion />
        <EmotionList emotionList={ICON_DATA} />

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

export default SelectEmotion;
