// useDiarySave.ts

import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { allValuesNull, isNotEmpty, navigate } from '@shared/lib';

import { useCallback, useEffect } from 'react';
import { useCreateDiaryMutation, useUpdateDiaryMutation } from '../../../shared/api/diary/diaryApi';
import { setSelectedDiary } from '../model/diary.slice';

export function useDiarySave(text: string) {
  const dispatch = useAppDispatch();
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const [createDiary, { data: createDiaryResult, isLoading: isCreateDiaryLoading }] =
    useCreateDiaryMutation();
  const [updateDiary, { data: updateDiaryResult, isLoading: isUpdateDiaryLoading }] =
    useUpdateDiaryMutation();

  const next = useCallback(() => {
    const diary = {
      ...todayDiary,
      description: text,
      emotionId: createDiaryResult || updateDiaryResult,
    };
    dispatch(setSelectedDiary(diary));
    navigate('DiaryStack', { screen: 'Complete' });
  }, [todayDiary, text, createDiaryResult, updateDiaryResult, dispatch]);

  useEffect(() => {
    if (!allValuesNull(createDiaryResult) || !allValuesNull(updateDiaryResult)) {
      next();
    }
  }, [createDiaryResult, updateDiaryResult, next]);

  const save = useCallback(async () => {
    try {
      if (!isNotEmpty(text)) return;

      const diary = { ...todayDiary, description: text };
      if (isNotEmpty(selectedDiary)) {
        await updateDiary({ emotionId: selectedDiary.emotionId ?? -1, updates: diary });
      } else {
        await createDiary(diary);
      }
    } catch (error) {
      console.error('Diary save failed:', error);
    }
  }, [text, todayDiary, selectedDiary, createDiary, updateDiary]);

  return { save, isCreateDiaryLoading, isUpdateDiaryLoading };
}
