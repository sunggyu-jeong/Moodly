import { setShowToastView } from '@processes/overlay/model/overlaySlice';
import { DayCell, ICON_DATA, isEmpty, useAppDispatch } from '@shared';
import { COMMON_ICONS } from '@shared/assets/images/common';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useCallback, useMemo } from 'react';

interface SelectableDayCellProps {
  date: Dayjs;
  iconId?: number | null;
  isSelected: boolean;
  onSelectDay: (date: Dayjs) => void;
  onStartEmotionSelection: (date: Dayjs) => void;
}

const SelectableDayCell = ({
  date,
  iconId,
  isSelected,
  onSelectDay,
  onStartEmotionSelection,
}: SelectableDayCellProps) => {
  const dispatch = useAppDispatch(); // Toast 같은 부가 기능은 유지
  const isFuture = date.isAfter(dayjs(), 'day');

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
        message: '미래 날짜는 작성할 수 없어요!',
      }),
    );
  }, [dispatch]);

  const onPress = useCallback(() => {
    if (isFuture) {
      showFutureToast();
      return;
    }

    if (!iconId) {
      onStartEmotionSelection(date);
      return;
    }

    onSelectDay(date);
  }, [isFuture, iconId, date, showFutureToast, onStartEmotionSelection, onSelectDay]);

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

export default memo(SelectableDayCell);
