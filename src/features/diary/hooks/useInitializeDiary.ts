import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { ICON_DATA } from '@/shared/constants';
import { useAppDispatch, useRealm } from '@/shared/hooks';
import { isNotEmpty } from '@/shared/lib';

import {
  searchDiaryCountThunk,
  searchDiaryForDayThunk,
  setSelectedDiary,
  setSelectedIcon,
  setTodayDiary,
} from '../model/diary.slice';

export function useInitializeDiary() {
  const dispatch = useAppDispatch();
  const { openRealm, closeRealm } = useRealm();

  const initialize = useCallback(async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(searchDiaryForDayThunk({ realm, recordDate: new Date() }));
      await dispatch(searchDiaryCountThunk({ realm }));
      closeRealm();
    }
  }, [openRealm, dispatch, closeRealm]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setSelectedIcon(ICON_DATA[0]));
      dispatch(setSelectedDiary({}));
      dispatch(setTodayDiary(null));
      initialize();
    }, [dispatch, initialize])
  );
}
