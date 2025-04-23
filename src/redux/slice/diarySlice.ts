import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import Realm from 'realm';
import { Emotions } from '../../components/molecules/EmotionIcon.mol';
import { AsyncOperationState, createInitialAsyncState } from '../../constant/ApiStatus';
import { ICON_DATA } from '../../constant/Icons';
import { EmotionDiaryDTO } from '../../scheme';
import {
  createDiary,
  deleteDiary,
  hasDiaryForDay,
  selectDiaryById,
  selectDiaryByMonth,
  selectDiaryCount,
  updateDiary,
} from '../../services';
import { createServiceThunk } from '../../services/ServiceThunk';
import { addAsyncThunkCase } from '../../utils';

const searchDiaryCountThunk = createServiceThunk<number, { realm: Realm }>(
  'diary/searchDiaryCount',
  async ({ realm }) => {
    return selectDiaryCount(realm);
  }
);

const searchDiaryByIdThunk = createServiceThunk<
  EmotionDiaryDTO | null,
  { realm: Realm; emotionId: number }
>('diary/searchDiaryById', async ({ realm, emotionId }) => {
  return selectDiaryById(realm, emotionId);
});

const searchDiaryByMonthThunk = createServiceThunk<
  EmotionDiaryDTO[],
  { realm: Realm; recordDate: Date }
>('diary/searchDiaryByMonth', async ({ realm, recordDate }) => {
  return selectDiaryByMonth(realm, recordDate);
});

const addDiaryThunk = createServiceThunk<void, { realm: Realm; data: EmotionDiaryDTO }>(
  'diary/addDiary',
  async ({ realm, data }) => {
    createDiary(realm, data);
  }
);

const modifyDiaryThunk = createServiceThunk<
  void,
  { realm: Realm; emotionId: number; data: EmotionDiaryDTO }
>('diary/modifyDiary', async ({ realm, emotionId, data }) => {
  updateDiary(realm, emotionId, data);
});

const removeDiaryThunk = createServiceThunk<void, { realm: Realm; emotionId: number }>(
  'diary/removeDiary',
  async ({ realm, emotionId }) => {
    deleteDiary(realm, emotionId);
  }
);

const searchDiaryForDayThunk = createServiceThunk<
  boolean,
  { realm: Realm; recordDate: Date }
>('diary/isDiaryExist', async ({ realm, recordDate }) => {
  return hasDiaryForDay(realm, recordDate);
});

interface DiaryState {
  diaryCount: AsyncOperationState<number>;
  searchById: AsyncOperationState<EmotionDiaryDTO>;
  searchByMonth: AsyncOperationState<EmotionDiaryDTO[]>;
  addDiary: AsyncOperationState<number>;
  modifyDiary: AsyncOperationState<void>;
  removeDiary: AsyncOperationState<void>;
  selectedDiary: EmotionDiaryDTO | null;
  selectedIcon: Emotions | null;
  todayDiary: EmotionDiaryDTO | null;
  selectedMonth: string;
  isDiaryExist: AsyncOperationState<boolean>;
}

const initialState: DiaryState = {
  diaryCount: createInitialAsyncState<number>(),
  searchById: createInitialAsyncState<EmotionDiaryDTO>(),
  searchByMonth: createInitialAsyncState<EmotionDiaryDTO[]>(),
  addDiary: createInitialAsyncState<number>(),
  modifyDiary: createInitialAsyncState<void>(),
  removeDiary: createInitialAsyncState<void>(),
  isDiaryExist: createInitialAsyncState<boolean>(),
  selectedDiary: null,
  selectedIcon: ICON_DATA[0],
  todayDiary: null,
  selectedMonth: dayjs().toISOString(),
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
  },
  extraReducers: (builder) => {
    addAsyncThunkCase<number, DiaryState>({
      builder,
      thunk: searchDiaryCountThunk,
      key: 'diaryCount',
      defaultErrorMessage:
        '검색어 갯수 조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요',
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
    addAsyncThunkCase<void, DiaryState>({
      builder,
      thunk: addDiaryThunk,
      key: 'addDiary',
      defaultErrorMessage: '등록 요청이 실패했습니다. 잠시 후 다시 시도해주세요.',
    });
    addAsyncThunkCase<void, DiaryState>({
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

export const { setSelectedIcon, setTodayDiary, setSelectedMonth, setSelectedDiary } =
  diarySlice.actions;

export default diarySlice.reducer;
