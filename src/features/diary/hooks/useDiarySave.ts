// useDiarySave.ts

import { useAppDispatch, useAppSelector, useRealm } from '@shared/hooks';
import { isNotEmpty, navigate } from '@shared/lib';

import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import { addDiaryThunk, modifyDiaryThunk, setSelectedDiary } from '../model/diary.slice';

export function useDiarySave(text: string) {
  const dispatch = useAppDispatch();
  const todayDiary = useAppSelector(state => state.diarySlice.todayDiary);
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const isLogin = useAppSelector(state => state.authSlice.isLogin);
  const { openRealm, closeRealm } = useRealm();

  const save = async () => {
    try {
      let realm: Realm | undefined;
      if (!isLogin) {
        realm = await openRealm();
      }

      if (!isNotEmpty(text)) return;

      const diary = { ...todayDiary, description: text };
      const thunk = isNotEmpty(selectedDiary)
        ? modifyDiaryThunk({
            realm,
            emotionId: selectedDiary.emotionId ?? -1,
            data: diary,
            isLogin,
          })
        : addDiaryThunk({ realm, data: diary, isLogin });

      const result = await dispatch(thunk);
      diary.emotionId = result.payload as number;
      if (!isLogin) {
        closeRealm();
      }
      dispatch(setSelectedDiary(diary));
      navigate('DiaryStack', { screen: 'Complete' });
    } catch (error) {
      console.error('Diary save failed:', error);
      dispatch(setShowToastView({ visibility: true, message: '일기 저장 요청이 실패했어요.' }));
    } finally {
      if (!isLogin) {
        closeRealm();
      }
    }
  };

  return save;
}
