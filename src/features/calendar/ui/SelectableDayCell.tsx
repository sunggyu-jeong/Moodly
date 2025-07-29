import { COMMON_ICONS } from '@shared/assets/images/common';
import { ICON_DATA } from '@shared/constants';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isEmpty, navigate } from '@shared/lib';
import DayCell from '@shared/ui/elements/DayCell';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { EmotionDiaryDTO } from '../../../entities/diary';
import { setCurrentDiary, setSelectedDay } from '../../diary/model/diary.slice';

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
    if (isEmpty(iconId)) return COMMON_ICONS.iconAddDiary;
    const found = ICON_DATA.find(i => i.id === iconId);
    return found?.iconSelected ?? null;
  }, [iconId]);

  const onPress = useCallback(() => {
    if (!iconId) {
      const emotion: Partial<EmotionDiaryDTO> = {
        recordDate: date.toISOString(),
      };
      dispatch(setCurrentDiary(emotion));
      navigate('DiaryStack', { screen: 'EmotionSelectionPage' });
      return;
    }
    dispatch(setSelectedDay(date.toISOString()));
  }, [dispatch, date, iconId]);

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
