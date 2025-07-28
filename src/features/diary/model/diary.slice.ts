import { createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

import { EmotionDiaryDTO } from '@entities/diary';
import { EmotionIconData, ICON_DATA } from '@shared/constants/Icons';

interface DiaryState {
  selectedDiary: EmotionDiaryDTO | null;
  selectedIcon: EmotionIconData | null;
  todayDiary: EmotionDiaryDTO | null;
  selectedMonth: string;
  isModifyMode: boolean;
  selectedDay: string;
}

const initialState: DiaryState = {
  selectedDiary: null,
  selectedIcon: ICON_DATA[0],
  todayDiary: null,
  selectedMonth: dayjs().toISOString(),
  isModifyMode: false,
  selectedDay: dayjs().toISOString(),
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
    setSelectedDay: (state, action) => {
      state.selectedDay = action.payload;
    },
  },
});

export const {
  setSelectedIcon,
  setTodayDiary,
  setSelectedMonth,
  setSelectedDiary,
  setModifyMode,
  setSelectedDay,
} = diarySlice.actions;

export default diarySlice.reducer;
