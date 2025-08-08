import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { EmotionDiaryDTO } from '@entities/diary';
import { EmotionIconData, ICON_DATA } from '@shared/constants/Icons';

interface DiaryState {
  selectedDiary: EmotionDiaryDTO | null;
  selectedIcon: EmotionIconData | null;
  currentDiary: EmotionDiaryDTO | null;
  selectedMonth: string;
  selectedWeek: string;
  isModifyMode: boolean;
  selectedDay: string | null;
}

const initialState: DiaryState = {
  selectedDiary: null,
  selectedIcon: ICON_DATA[0],
  currentDiary: null,
  selectedMonth: dayjs().toISOString(),
  selectedWeek: dayjs().toISOString(),
  isModifyMode: false,
  selectedDay: null,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState: initialState,
  reducers: {
    setSelectedIcon: (state, action) => {
      state.selectedIcon = action.payload;
    },
    setCurrentDiary: (state, action: PayloadAction<Partial<EmotionDiaryDTO>>) => {
      state.currentDiary = {
        ...(state.currentDiary ?? {}),
        ...action.payload,
      };
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
    resetDiary: state => {
      state.isModifyMode = false;
      state.selectedIcon = ICON_DATA[0];
      state.selectedDiary = null;
      state.currentDiary = null;
    },
    moveMonth: (state, action: PayloadAction<'left' | 'right'>) => {
      const delta = action.payload === 'left' ? -1 : 1;
      const newMonth = dayjs(state.selectedMonth).add(delta, 'month');
      const firstOfMonth = newMonth.startOf('month');
      state.selectedMonth = firstOfMonth.toISOString();
      state.selectedWeek = dayjs(firstOfMonth).startOf('week').toISOString();
      state.selectedDay = null;
      console.log('!@>$>!@$>!@$>!$>', firstOfMonth.toISOString());
    },
    moveWeek: (state, action: PayloadAction<'left' | 'right'>) => {
      const delta = action.payload === 'left' ? -1 : 1;
      const newWeek = dayjs(state.selectedWeek).add(delta, 'week');
      state.selectedWeek = newWeek.toISOString();
      state.selectedMonth = newWeek.startOf('month').toISOString();
      console.log('!@>$>!@$>!@$>!$>', newWeek.startOf('month').toISOString());
      state.selectedDay = null;
    },
  },
});

export const {
  setSelectedIcon,
  setCurrentDiary,
  setSelectedMonth,
  setSelectedDiary,
  setModifyMode,
  setSelectedDay,
  resetDiary,
  moveMonth,
  moveWeek,
} = diarySlice.actions;

export default diarySlice.reducer;
