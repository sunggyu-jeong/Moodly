import overlaySlice from '@/processes/overlay/model/overlaySlice';
import diarySlice from '@/redux/slice/diarySlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducers = combineReducers({
  overlaySlice: overlaySlice,
  diarySlice: diarySlice,
});

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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;

export default store;
