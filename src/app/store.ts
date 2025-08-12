import diarySlice from '@features/diary/model/diary.slice';
import settingSlice from '@features/setting/model/setting.slice';
import progressSlice from '@features/updateProgress/model/progress.slice';
import overlaySlice from '@processes/overlay/model/overlay.slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@shared/api/base';

import { listenerMiddleware } from './middleware/ListenerMiddleware';

const reducers = combineReducers({
  // RTK Query의 API 인스턴스 리듀서
  [baseApi.reducerPath]: baseApi.reducer,

  // 앱 기능별 리듀서
  overlaySlice,
  diarySlice,
  progressSlice,
  settingSlice,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducers>;
type RootAction = Parameters<typeof reducers>[1];

const rootReducer = (state: RootState | undefined, action: RootAction): RootState => {
  if (action.type === 'RESET_STORE') {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(listenerMiddleware.middleware),
});

export default store;
