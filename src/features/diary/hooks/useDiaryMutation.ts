import { useCreateDiaryMutation, useUpdateDiaryMutation } from '@shared/api/diary/diaryApi';
import { useAppSelector } from '@shared/hooks';
import { isEmpty, isNotEmpty } from '@shared/lib';
import dayjs from 'dayjs';
import { useCallback } from 'react';

export function useDiaryMutation(text: string) {
  const currentDiary = useAppSelector(state => state.diarySlice.currentDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const [create, { data: createRes, isLoading: createLoading }] = useCreateDiaryMutation();
  const [update, { data: updateRes, isLoading: updateLoading }] = useUpdateDiaryMutation();

  const save = useCallback(async () => {
    if (isEmpty(text)) return;
    const diary = { ...currentDiary, description: text };
    const baseDate = isNotEmpty(diary.createdAt) ? dayjs(diary.createdAt) : dayjs();

    const start = baseDate.startOf('month').format('YYYY-MM-DD');
    const end = baseDate.endOf('month').format('YYYY-MM-DD');
    const date = baseDate.format('YYYY-MM-DD');
    if (isModifyMode) {
      await update({
        emotionId: selectedDiary?.emotionId ?? -1,
        updates: diary,
        start: start,
        end: end,
        date: date,
      });
    } else {
      await create(diary);
    }
  }, [text, create, update, selectedDiary, currentDiary, isModifyMode]);

  return {
    save,
    isLoading: createLoading || updateLoading,
    result: createRes ?? updateRes,
  };
}
