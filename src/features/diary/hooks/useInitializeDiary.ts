import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { ICON_DATA } from '@shared/constants';
import { useAppDispatch, useAppSelector, useRealm } from '@shared/hooks';

import { setShowToastView } from '@processes/overlay/model/overlay.slice';
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
  const isLogin = useAppSelector(state => state.authSlice.isLogin);

  const initialize = useCallback(async () => {
    try {
      let realm: Realm | undefined;
      if (!isLogin) {
        realm = await openRealm();
      }
      await dispatch(searchDiaryForDayThunk({ realm, recordDate: new Date(), isLogin })).unwrap();
      await dispatch(
        searchDiaryCountThunk({
          realm: realm,
          isLogin,
        })
      ).unwrap();
    } catch (e) {
      dispatch(setShowToastView({ visibility: true, message: e as string }));
    } finally {
      if (!isLogin) {
        closeRealm();
      }
    }
  }, [openRealm, dispatch, closeRealm, isLogin]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setSelectedIcon(ICON_DATA[0]));
      dispatch(setSelectedDiary({}));
      dispatch(setTodayDiary(null));
      initialize();
    }, [dispatch, initialize])
  );
}
