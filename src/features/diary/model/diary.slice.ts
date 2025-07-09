import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { EmotionDiaryDTO } from '@entities/diary';
import { AsyncOperationState, createInitialAsyncState } from '@shared/constants/ApiStatus';
import { EmotionIconData, ICON_DATA } from '@shared/constants/Icons';

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
});

export const { setSelectedIcon, setTodayDiary, setSelectedMonth, setSelectedDiary, setModifyMode } =
  diarySlice.actions;

export default diarySlice.reducer;
