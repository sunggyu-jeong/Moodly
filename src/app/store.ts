import { combineReducers, configureStore, type UnknownAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { rtkErrorMiddleware } from '@/app/middleware/rtkErrorMiddleware';
import diaryReducer from '@/features/diary/model/diarySlice';
import settingReducer from '@/features/setting/model/settingSlice';
import { appApi } from '@/shared/api/AppApi';
import overlayReducer from '@/shared/model/overlaySlice';

const reducers = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  overlay: overlayReducer,
  diary: diaryReducer,
  setting: settingReducer,
});

const rootReducer = (state: RootState | undefined, action: UnknownAction): RootState => {
  if (action.type === 'RESET_STORE') {
    return reducers(undefined, action) as RootState;
  }
  return reducers(state, action) as RootState;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta'],
        ignoredPaths: [],
      },
    })
      .concat(appApi.middleware)
      .concat(rtkErrorMiddleware),
  devTools: __DEV__,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
