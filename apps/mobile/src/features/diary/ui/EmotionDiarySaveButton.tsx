import dayjs from 'dayjs';
import { Keyboard } from 'react-native';

import { useLazyGetDiaryStreakQuery } from '@/entities/ai-report/api';
import { fromRow } from '@/entities/diary/model/mapper';
import { setSelectedDiary } from '@/features/diary/model/diarySlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { navigate } from '@/shared/lib/navigation.util';
import { setShowLoadingView } from '@/shared/model/overlaySlice';
import { KeyboardAccessoryButton } from '@/shared/ui/elements/KeyboardAccessory';

import { useDiaryMutation } from '../hooks/useDiaryMutation';

export function DiarySaveButton(text: string) {
  const dispatch = useAppDispatch();
  const currentDiary = useAppSelector(state => state.diary.currentDiary);

  const [triggerStreak] = useLazyGetDiaryStreakQuery();

  const { save } = useDiaryMutation(text);

  const handlePress = async () => {
    try {
      Keyboard.dismiss();
      dispatch(setShowLoadingView(true));
      const result = await save();

      if (result) {
        const diary = {
          ...currentDiary,
          ...fromRow(result),
          description: text,
        };
        dispatch(setSelectedDiary(diary));

        await triggerStreak().unwrap();

        const isToday = currentDiary
          ? dayjs(currentDiary.recordDate).isSame(dayjs(), 'day')
          : dayjs().isSame(dayjs(), 'day');

        if (isToday) {
          navigate('DiaryStack', { screen: 'WeeklyReportProgress' });
        } else {
          navigate('DiaryStack', { screen: 'Complete' });
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      dispatch(setShowLoadingView(false));
    }
  };

  return <KeyboardAccessoryButton onPress={handlePress} />;
}
