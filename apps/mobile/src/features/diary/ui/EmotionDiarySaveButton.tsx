import dayjs from 'dayjs';
import { useEffect } from 'react';

import { fromRow } from '@/entities/diary/model/mapper';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { navigate } from '@/shared/lib/navigation.util';
import { isNotEmpty } from '@/shared/lib/value.util';
import { KeyboardAccessoryButton } from '@/shared/ui/elements/KeyboardAccessory';

import { useDiaryMutation } from '../hooks/useDiaryMutation';
import { setSelectedDiary } from '../model/diarySlice';

export function DiarySaveButton(text: string) {
  const dispatch = useAppDispatch();
  const currentDiary = useAppSelector(state => state.diary.currentDiary);
  const { save, result } = useDiaryMutation(text);

  useEffect(() => {
    if (isNotEmpty(result)) {
      const diary = {
        ...currentDiary,
        ...fromRow(result),
        description: text,
      };
      dispatch(setSelectedDiary(diary));
      const isToday =
        currentDiary !== null && dayjs(currentDiary.recordDate).isSame(dayjs(), 'day');

      if (isToday) {
        navigate('DiaryStack', {
          screen: 'WeeklyReportProgress',
        });
      } else {
        navigate('DiaryStack', { screen: 'Complete' });
      }
    }
  }, [result, dispatch, text, currentDiary]);

  return <KeyboardAccessoryButton onPress={save} />;
}
