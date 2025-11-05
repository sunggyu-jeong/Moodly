import diarySlice from '@/features/diary/model/diarySlice';
import settingSlice from '@/features/setting/model/settingSlice';
import progressSlice from '@/features/update-progress/updateProgress/model/progressSlice';
import overlaySlice from '@/shared/model/overlaySlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { appApi } from '@/shared/api/AppApi';
import { listenerMiddleware } from '@/app/middleware/ListenerMiddleware';

const reducers = combineReducers({
  // RTK Query의 API 인스턴스 리듀서
  [appApi.reducerPath]: appApi.reducer,

  // 앱 기능별 리듀서
  overlaySlice,
  diarySlice,
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
    getDefaultMiddleware().concat(appApi.middleware).concat(listenerMiddleware.middleware),
});

export default store;
