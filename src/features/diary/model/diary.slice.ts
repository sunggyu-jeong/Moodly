import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import Realm from 'realm';

import store from '@/app/store';
import { EmotionDiaryDTO } from '@/entities/diary';
import { AsyncOperationState, createInitialAsyncState } from '@/shared/constants/ApiStatus';
import { EmotionIconData, ICON_DATA } from '@/shared/constants/Icons';
import { addAsyncThunkCase } from '@/shared/lib';
import { createServiceThunk } from '@/shared/services/ServiceThunk';
import { DiaryDataSource } from '../service/DiaryDataSource';
import { createDiaryDataSource, DataSourceType } from '../service/DiaryDataSourceFactory';

interface DataSourceOutPutType {
  ds: DiaryDataSource;
  isLogin: boolean;
}
function chooseDataSource(): DataSourceOutPutType {
  const isLogin = store.getState().authSlice.isLogin;
  let identifier: DataSourceType;
  if (isLogin) {
    identifier = DataSourceType.SUPABASE;
  } else {
    identifier = DataSourceType.REALM;
  }
  return { ds: createDiaryDataSource(identifier), isLogin: isLogin };
}

const searchDiaryCountThunk = createServiceThunk<
  number,
  { realm: Realm | undefined; isLogin: boolean }
>('diary/searchDiaryCount', async ({ realm }) => {
  const { ds } = chooseDataSource();
  return ds.searchCount(realm);
});

const searchDiaryByIdThunk = createServiceThunk<
  EmotionDiaryDTO | null,
  { realm: Realm | undefined; emotionId: number; isLogin: boolean }
>('diary/searchDiaryById', async ({ realm, emotionId, isLogin }) => {
  const { ds } = chooseDataSource();
  return ds.searchById(emotionId, realm);
});

const searchDiaryByMonthThunk = createServiceThunk<
  EmotionDiaryDTO[],
  { realm: Realm | undefined; recordDate: Date; isLogin: boolean }
>('diary/searchDiaryByMonth', async ({ realm, recordDate, isLogin }) => {
  const { ds } = chooseDataSource();
  return ds.searchByMonth(recordDate, realm);
});

const addDiaryThunk = createServiceThunk<
  number,
  { realm: Realm | undefined; data: EmotionDiaryDTO; isLogin: boolean }
>('diary/addDiary', async ({ realm, data, isLogin }) => {
  const { ds } = chooseDataSource();
  return ds.add(data, realm);
});

const modifyDiaryThunk = createServiceThunk<
  number,
  { realm: Realm | undefined; emotionId: number; data: EmotionDiaryDTO; isLogin: boolean }
>('diary/modifyDiary', async ({ realm, emotionId, data, isLogin }) => {
  const { ds } = chooseDataSource();
  return ds.modify(emotionId, data, realm);
});

const removeDiaryThunk = createServiceThunk<
  void,
  { realm: Realm | undefined; emotionId: number; isLogin: boolean }
>('diary/removeDiary', async ({ realm, emotionId, isLogin }) => {
  const { ds } = chooseDataSource();
  return ds.remove(emotionId, realm);
});

const searchDiaryForDayThunk = createServiceThunk<
  boolean,
  { realm: Realm | undefined; recordDate: Date; isLogin: boolean }
>('diary/isDiaryExist', async ({ realm, recordDate, isLogin }) => {
  const { ds } = chooseDataSource();
  return ds.isExist(recordDate, realm);
});

interface DiaryState {
  diaryCount: AsyncOperationState<number>;
  searchById: AsyncOperationState<EmotionDiaryDTO>;
  searchByMonth: AsyncOperationState<EmotionDiaryDTO[]>;
  addDiary: AsyncOperationState<number>;
  modifyDiary: AsyncOperationState<number>;
  removeDiary: AsyncOperationState<void>;
  selectedDiary: EmotionDiaryDTO | null;
  selectedIcon: EmotionIconData | null;
  todayDiary: EmotionDiaryDTO | null;
  selectedMonth: string;
  isDiaryExist: AsyncOperationState<boolean>;
  isModifyMode: boolean;
}

const initialState: DiaryState = {
  diaryCount: createInitialAsyncState<number>(),
  searchById: createInitialAsyncState<EmotionDiaryDTO>(),
  searchByMonth: createInitialAsyncState<EmotionDiaryDTO[]>(),
  addDiary: createInitialAsyncState<number>(),
  modifyDiary: createInitialAsyncState<number>(),
  removeDiary: createInitialAsyncState<void>(),
  isDiaryExist: createInitialAsyncState<boolean>(),
  selectedDiary: null,
  selectedIcon: ICON_DATA[0],
  todayDiary: null,
  selectedMonth: dayjs().toISOString(),
  isModifyMode: false,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState: initialState,
  reducers: {
    setSelectedIcon: (state, action) => {
      state.selectedIcon = action.payload;
    },
    setTodayDiary: (state, action) => {
      state.todayDiary = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setSelectedDiary: (state, action) => {
      state.selectedDiary = action.payload;
    },
    setModifyMode: (state, action) => {
      state.isModifyMode = action.payload;
    },
  },
  extraReducers: builder => {
    addAsyncThunkCase<number, DiaryState>({
      builder,
      thunk: searchDiaryCountThunk,
      key: 'diaryCount',
      defaultErrorMessage: '검색어 갯수 조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요',
    });
    addAsyncThunkCase<EmotionDiaryDTO | null, DiaryState>({
      builder,
      thunk: searchDiaryByIdThunk,
      key: 'searchById',
      defaultErrorMessage: '조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요',
    });
    addAsyncThunkCase<EmotionDiaryDTO[], DiaryState>({
      builder,
      thunk: searchDiaryByMonthThunk,
      key: 'searchByMonth',
      defaultErrorMessage: '조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
    addAsyncThunkCase<number, DiaryState>({
      builder,
      thunk: addDiaryThunk,
      key: 'addDiary',
      defaultErrorMessage: '등록 요청이 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
    addAsyncThunkCase<number, DiaryState>({
      builder,
      thunk: modifyDiaryThunk,
      key: 'modifyDiary',
      defaultErrorMessage: '수정 요청이 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
    addAsyncThunkCase<void, DiaryState>({
      builder,
      thunk: removeDiaryThunk,
      key: 'removeDiary',
      defaultErrorMessage: '삭제 요청이 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
    addAsyncThunkCase<boolean, DiaryState>({
      builder,
      thunk: searchDiaryForDayThunk,
      key: 'isDiaryExist',
      defaultErrorMessage: '조회 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
  },
});

export {
  addDiaryThunk,
  modifyDiaryThunk,
  removeDiaryThunk,
  searchDiaryByIdThunk,
  searchDiaryByMonthThunk,
  searchDiaryCountThunk,
  searchDiaryForDayThunk,
};

export const { setSelectedIcon, setTodayDiary, setSelectedMonth, setSelectedDiary, setModifyMode } =
  diarySlice.actions;

export default diarySlice.reducer;
