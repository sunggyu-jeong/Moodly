import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isNotEmpty, navigate } from '@shared/lib';
import { KeyboardAccessoryButton } from '@shared/ui/elements/KeyboardAccessory';
import { useEffect } from 'react';

import { useDiaryMutation } from '../hooks/useDiaryMutation';
import { setSelectedDiary } from '../model/diary.slice';

export function DiarySaveButton(text: string) {
  const dispatch = useAppDispatch();
  const currentDiary = useAppSelector(state => state.diarySlice.currentDiary);
  const { save, isLoading, result } = useDiaryMutation(text);

  useEffect(() => {
    if (isNotEmpty(result)) {
      const diary = {
        ...currentDiary,
        description: text,
        emotionId: result,
      };
      dispatch(setSelectedDiary(diary));
      navigate('DiaryStack', { screen: 'Complete' });
    }
  }, [result, dispatch, text, currentDiary]);

  return <KeyboardAccessoryButton onPress={save} />;
}
