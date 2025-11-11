import { AnimatePresence, MotiView } from 'moti';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  DiaryCalendarMode,
  type DiaryCalendarModeType,
  DiaryPageMode,
  type DiaryPageModeType,
} from '@/entities/calendar/type';
import type { Diary } from '@/entities/diary/model/types';
import CalendarBar from '@/features/calendar/ui/CalendarBar';
import { generateMonthGrid, generateWeekGrid } from '@/shared/lib/date.util';
import { now } from '@/shared/lib/day.util';
import WeekdayHeader from '@/shared/ui/elements/WeekdayHeader';

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
        ? generateMonthGrid({ targetDate: now(selectedMonth) })
        : generateWeekGrid({ targetDate: now(selectedMonth) }),
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
            style={styles.StyledCalendarWrapper}
          >
            <WeekdayHeader />
            <CalendarBar
              key={selectedMonth}
              monthlyDates={monthlyDates}
              entries={monthData}
            />
            <View style={styles.StyledDivider} />
          </MotiView>
        </AnimatePresence>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  StyledCalendarWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  StyledDivider: {
    marginHorizontal: -20,
    marginTop: 32,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});

export default memo(EmotionDiaryListHeader);
