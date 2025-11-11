import * as amplitude from '@amplitude/analytics-react-native';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { useCreateDiaryMutation, useUpdateDiaryMutation } from '@/entities/diary/api';
import { useAppSelector } from '@/shared/hooks/useHooks';
import { formatDate, now } from '@/shared/lib/day.util';
import { getUserId } from '@/shared/lib/user.util';
import { isEmpty } from '@/shared/lib/value.util';

export function useDiaryMutation(text: string) {
  const currentDiary = useAppSelector(state => state.diarySlice.currentDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const isModifyMode = useAppSelector(state => state.diarySlice.isModifyMode);
  const [create, { data: createRes, isLoading: createLoading }] = useCreateDiaryMutation();
  const [update, { data: updateRes, isLoading: updateLoading }] = useUpdateDiaryMutation();

  const save = useCallback(async () => {
    if (isEmpty(text)) {
      return;
    }
    const userId = await getUserId();

    if (isModifyMode) {
      if (isEmpty(selectedDiary?.emotionId)) return;

      await update({
        emotionId: selectedDiary.emotionId,
        iconId: currentDiary?.iconId,
        userId,
        description: text,
      });
    } else {
      await create({
        userId,
        iconId: currentDiary?.iconId ?? 0,
        recordDate: currentDiary?.recordDate ?? formatDate(now()),
        description: text,
      });
      amplitude.track('Diary_Entry_Completed', {
        entryLength: text.length,
        emotion: selectedDiary?.emotionId,
        userId: userId,
        platform: Platform.OS,
      });
    }
  }, [text, create, update, selectedDiary, currentDiary, isModifyMode]);

  return {
    save,
    isLoading: createLoading || updateLoading,
    result: createRes ?? updateRes,
  };
}
