import * as amplitude from '@amplitude/analytics-react-native';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { useAppDispatch } from '@/app/store';
import { useCreateDiaryMutation, useUpdateDiaryMutation } from '@/entities/diary/api';
import { useAppSelector } from '@/shared/hooks/useHooks';
import { formatDate, now } from '@/shared/lib/day.util';
import { getUserId } from '@/shared/lib/user.util';
import { isEmpty } from '@/shared/lib/value.util';
import { setShowToastView } from '@/shared/model/overlaySlice';

export function useDiaryMutation(text: string) {
  const currentDiary = useAppSelector(state => state.diary.currentDiary);
  const selectedDiary = useAppSelector(state => state.diary.selectedDiary);
  const isModifyMode = useAppSelector(state => state.diary.isModifyMode);
  const [create, { data: createRes, isLoading: createLoading }] = useCreateDiaryMutation();
  const [update, { data: updateRes, isLoading: updateLoading }] = useUpdateDiaryMutation();
  const dispatch = useAppDispatch();

  const save = useCallback(async () => {
    if (isEmpty(text)) {
      dispatch(setShowToastView({ visibility: true, message: '일기 내용을 입력해주세요.' }));
      return;
    }
    let resultData;
    const userId = await getUserId();

    if (isModifyMode) {
      if (isEmpty(selectedDiary?.emotionId)) return;

      resultData = await update({
        emotionId: selectedDiary.emotionId,
        iconId: currentDiary?.iconId,
        userId,
        description: text,
      }).unwrap();
    } else {
      resultData = await create({
        userId,
        iconId: currentDiary?.iconId ?? 0,
        recordDate: currentDiary?.recordDate ?? formatDate(now()),
        description: text,
      }).unwrap();
      amplitude.track('Diary_Entry_Completed', {
        entryLength: text.length,
        emotion: selectedDiary?.emotionId,
        userId: userId,
        platform: Platform.OS,
      });
    }
    return resultData;
  }, [text, create, update, selectedDiary, currentDiary, isModifyMode, dispatch]);

  return {
    save,
    isLoading: createLoading || updateLoading,
    result: createRes ?? updateRes,
  };
}
