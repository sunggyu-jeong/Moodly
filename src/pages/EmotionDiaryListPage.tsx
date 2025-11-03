import { DiaryCalendarMode, DiaryPageMode } from '@/entities/calendar';
import {
  useDiaryPagerVM,
  selectCalendarMode,
  usePagerController,
  CalendarPage,
  EmotionDiaryMonthPager,
} from '@/features/calendar';
import { EmotionDiaryMonthSelector, setCalendarMode } from '@/features/diary';
import { useAppSelector, useAppDispatch, DiaryToggle, colors } from '@/shared';
import { DIARY_ICONS } from '@/shared/assets/images/diary';
import { NavigationBar } from '@/widgets/navigation-bar';
import { Image, View } from 'moti';
import { useEffect, useMemo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native/types';

export const EmotionDiaryListPage = () => {
  const { diaryMode, pages, monthLabel, goLeft, goRight, toggleDiaryMode, reset } =
    useDiaryPagerVM();
  const calendarMode = useAppSelector(selectCalendarMode);
  const dispatch = useAppDispatch();
  const { flatListRef, onScroll, onMomentumScrollEnd, scrollToMiddle } =
    usePagerController<CalendarPage>({
      onLeft: goLeft,
      onRight: goRight,
    });

  useEffect(() => {
    scrollToMiddle(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftComponents = useMemo(
    () => [
      {
        item: (
          <EmotionDiaryMonthSelector
            monthLabel={monthLabel}
            onPressLeft={goLeft}
            onPressRight={goRight}
          />
        ),
        disabled: true,
      },
    ],
    [goLeft, goRight, monthLabel],
  );

  const toggleCalendarMode = useCallback(() => {
    const nextMode =
      calendarMode === DiaryCalendarMode.monthDayMode
        ? DiaryCalendarMode.weekDayMode
        : DiaryCalendarMode.monthDayMode;

    dispatch(setCalendarMode(nextMode));
  }, [calendarMode, dispatch]);

  const actionButtons = useMemo(
    () => [
      ...(diaryMode === DiaryPageMode.calendarMode
        ? [
            {
              item: (
                <DiaryToggle
                  isOn={calendarMode === DiaryCalendarMode.monthDayMode}
                  texts={['주간', '월간']}
                  onToggle={toggleCalendarMode}
                />
              ),
              disabled: true,
            },
          ]
        : []),
      {
        item: (
          <TouchableOpacity
            onPress={toggleDiaryMode}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={
                diaryMode === DiaryPageMode.calendarMode
                  ? DIARY_ICONS.iconDiaryCalendar
                  : DIARY_ICONS.iconDiaryList
              }
              style={styles.image}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        ),
      },
    ],
    [calendarMode, diaryMode, toggleCalendarMode, toggleDiaryMode],
  );

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />
      <View style={styles.container}>
        <EmotionDiaryMonthPager
          data={pages}
          diaryMode={diaryMode}
          calendarMode={calendarMode}
          flatListRef={flatListRef}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default EmotionDiaryListPage;
