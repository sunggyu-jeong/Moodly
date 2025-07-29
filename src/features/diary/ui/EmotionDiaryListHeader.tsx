import { DiaryPageMode, DiaryPageModeType } from '@entities/calendar/diary.type';
import { EmotionDiaryDTO } from '@entities/diary';
import { generateMonthGrid } from '@shared/lib/date.util';
import WeekdayHeader from '@shared/ui/elements/WeekdayHeader';
import dayjs from 'dayjs';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';
import { Layout } from 'react-native-reanimated';
import CalendarBar from '../../calendar/ui/CalendarBar';
import DiarySkeleton from './skeleton/DiaryCardSkeleton';

interface DiaryListHeaderProps {
  showSkeleton: boolean;
  diaryMode: DiaryPageModeType;
  selectedMonth: string;
  monthData?: EmotionDiaryDTO[];
}
const EmotionDiaryListHeader = ({
  showSkeleton,
  diaryMode,
  selectedMonth,
  monthData,
}: DiaryListHeaderProps) => (
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
          layout={Layout.springify().damping(16).stiffness(120).mass(0.8)}
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 20 }}
          transition={{ type: 'timing', duration: 250 }}
          exitTransition={{ type: 'timing', duration: 0 }}
          className="relative mb-8"
        >
          <WeekdayHeader />
          <CalendarBar
            monthlyDates={generateMonthGrid({ targetDate: dayjs(selectedMonth) })}
            entries={monthData}
          />
          <View className="w-full left-0 right-0 h-1 bg-gray-200 mt-8" />
        </MotiView>
      </AnimatePresence>
    )}
  </AnimatePresence>
);

export default React.memo(EmotionDiaryListHeader);
