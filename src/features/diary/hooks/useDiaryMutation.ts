import { useCreateDiaryMutation, useUpdateDiaryMutation } from '@shared/api/diary/diaryApi';
import { useAppSelector } from '@shared/hooks';
import { isEmpty } from '@shared/lib';
import { useCallback } from 'react';

export function useDiaryMutation(text: string) {
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const [create, { data: createRes, isLoading: createLoading }] = useCreateDiaryMutation();
  const [update, { data: updateRes, isLoading: updateLoading }] = useUpdateDiaryMutation();

  const save = useCallback(async () => {
    if (isEmpty(text)) return;
    const diary = { ...todayDiary, description: text };
    if (isModifyMode) {
      await update({ emotionId: selectedDiary?.emotionId ?? -1, updates: diary });
    } else {
      await create(diary);
    }
  }, [text, create, update, selectedDiary, todayDiary, isModifyMode]);

  return {
    save,
    isLoading: createLoading || updateLoading,
    result: createRes ?? updateRes,
  };
}
