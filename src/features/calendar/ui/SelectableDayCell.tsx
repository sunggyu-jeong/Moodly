import { Diary } from '@entities/diary/model/diary.types';
import { setCurrentDiary, setSelectedDay } from '@features/diary/model/diarySlice';
import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import { DayCell, ICON_DATA, isEmpty, navigate, useAppDispatch, useAppSelector } from '@shared';
import { COMMON_ICONS } from '@shared/assets/images/common';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useMemo } from 'react';

interface SelectableDayCellProps {
  date: Dayjs;
  iconId?: number | null;
}

const SelectableDayCell = ({ date, iconId }: SelectableDayCellProps) => {
  const dispatch = useAppDispatch();
  const selectedDayStr = useAppSelector(state => state.diarySlice.selectedDay);
  const selectedDay = dayjs(selectedDayStr);
  const isFuture = date.isAfter(dayjs(), 'day');
  const isSelected = date.isSame(selectedDay, 'day');

  const iconSource = useMemo(() => {
    if (isEmpty(iconId)) {
      return COMMON_ICONS.iconAddDiary;
    }
    const found = ICON_DATA.find(i => i.id === iconId);
    return found?.iconSelected ?? null;
  }, [iconId]);

  const showFutureToast = useCallback(() => {
    dispatch(
      setShowToastView({
        visibility: true,
        message: '미래 날짜는 기록할 수 없어요!',
      }),
    );
  }, [dispatch]);

  const startEmotionSelection = useCallback(() => {
    const emotion: Partial<Diary> = {
      recordDate: date.toString(),
    };
    dispatch(setCurrentDiary(emotion));
    navigate('DiaryStack', { screen: 'EmotionSelectionPage' });
  }, [dispatch, date]);

  const selectDay = useCallback(() => {
    dispatch(setSelectedDay(date.toString()));
  }, [dispatch, date]);

  const onPress = useCallback(() => {
    if (isFuture) {
      showFutureToast();
      return;
    }

    if (!iconId) {
      startEmotionSelection();
      return;
    }

    selectDay();
  }, [showFutureToast, startEmotionSelection, selectDay, isFuture, iconId]);

  return (
    <DayCell
      date={date}
      isSelected={isSelected}
      isFuture={isFuture}
      iconSource={iconSource}
      onPress={onPress}
    />
  );
};

export default React.memo(SelectableDayCell);
