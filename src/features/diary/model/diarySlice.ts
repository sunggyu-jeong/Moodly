import type { Diary } from '@entities/diary/model/diary.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type EmotionIconData, ICON_DATA } from '@shared/constants/Icons';
import dayjs from 'dayjs';

import { createKstDay } from '../../../shared';

interface DiaryState {
  selectedDiary: Diary | null;
  selectedIcon: EmotionIconData | null;
  currentDiary: Partial<Diary> | null;
  selectedMonth: string;
  selectedWeek: string;
  isModifyMode: boolean;
  selectedDay: string | null;
}

const initialState: DiaryState = {
  selectedDiary: null,
  selectedIcon: ICON_DATA[0],
  currentDiary: null,
  selectedMonth: dayjs().toString(),
  selectedWeek: dayjs().toString(),
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
    setCurrentDiary: (state, action: PayloadAction<Partial<Diary>>) => {
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
      const currentMonth = createKstDay(state.selectedMonth);
      const newMonth = currentMonth.add(delta, 'month');
      const firstOfMonth = newMonth.startOf('month');

      state.selectedMonth = firstOfMonth.format('YYYY-MM-DD');
      state.selectedWeek = firstOfMonth.startOf('week').format('YYYY-MM-DD');
      state.selectedDay = null;
    },
    moveWeek: (state, action: PayloadAction<'left' | 'right'>) => {
      const delta = action.payload === 'left' ? -1 : 1;
      const newWeek = dayjs(state.selectedWeek).add(delta, 'week');
      state.selectedWeek = newWeek.toString();
      state.selectedMonth = newWeek.startOf('month').toString();
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
