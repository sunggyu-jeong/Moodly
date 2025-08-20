import {
  DiaryCalendarMode,
  type DiaryCalendarModeType,
  DiaryPageMode,
  type DiaryPageModeType,
} from '@entities/calendar/diary.type';
import type { Diary } from '@entities/diary/model/diary.types';
import { generateMonthGrid, generateWeekGrid } from '@shared/lib/date.util';
import WeekdayHeader from '@shared/ui/elements/WeekdayHeader';
import dayjs from 'dayjs';
import { AnimatePresence, MotiView } from 'moti';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { CalendarBar } from '@/features/calendar';

import DiarySkeleton from './skeleton/DiaryCardSkeleton';

interface DiaryListHeaderProps {
  showSkeleton: boolean;
  diaryMode: DiaryPageModeType;
  selectedMonth: string;
  monthData?: Diary[];
  calendarMode?: DiaryCalendarModeType;
}
const EmotionDiaryListHeader = ({
  showSkeleton,
  diaryMode,
  selectedMonth,
  monthData,
  calendarMode,
}: DiaryListHeaderProps) => {
  const monthlyDates = useMemo(
    () =>
      calendarMode === DiaryCalendarMode.monthDayMode
        ? generateMonthGrid({ targetDate: dayjs(selectedMonth) })
        : generateWeekGrid({ targetDate: dayjs(selectedMonth) }),
    [calendarMode, selectedMonth],
  );
  return (
    <AnimatePresence>
      {showSkeleton && (
        <MotiView
          key="skeleton"
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <DiarySkeleton />
        </MotiView>
      )}
      {!showSkeleton && diaryMode === DiaryPageMode.calendarMode && (
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key="calendar"
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 20 }}
            transition={{ type: 'timing', duration: 250 }}
            exitTransition={{ type: 'timing', duration: 0 }}
            className="relative mb-8"
          >
            <WeekdayHeader />
            <CalendarBar
              key={selectedMonth}
              monthlyDates={monthlyDates}
              entries={monthData}
            />
            <View className="-mx-5 mt-8 h-[1px] bg-gray-200" />
          </MotiView>
        </AnimatePresence>
      )}
    </AnimatePresence>
  );
};

export default React.memo(EmotionDiaryListHeader);
