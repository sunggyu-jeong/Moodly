import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import DiaryMonth from '../components/molecules/DiaryMonth';
import DiaryCardList from '../features/diary/ui/DiaryCardList';
import DiaryEmptyMent from '../features/diary/ui/DiaryEmptyMent';
import { useAppDispatch, useAppSelector, useRealm } from '../hooks';
import { searchDiaryByMonthThunk, setSelectedMonth } from '../redux/slice/diarySlice';
import { isEmpty, isNotEmpty } from '../utils';
import NavigationBar from '../widgets/navigation-bar/ui/NavigationBar';

const DiaryList = () => {
  const { openRealm, closeRealm } = useRealm();
  const selectedMonth = useAppSelector((state) => state.diarySlice.selectedMonth);
  const searchByMonth = useAppSelector((state) => state.diarySlice.searchByMonth);
  const currentMonth = dayjs();
  const dispatch = useAppDispatch();

  const handleChangeMonth = (direction: 'left' | 'right') => {
    dispatch(
      setSelectedMonth(
        dayjs(selectedMonth)
          .add(direction === 'left' ? -1 : 1, 'month')
          .toISOString()
      )
    );
  };
  useFocusEffect(
    useCallback(() => {
      initialize();
    }, [selectedMonth])
  );

  const initialize = async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(
        searchDiaryByMonthThunk({ realm, recordDate: new Date(selectedMonth) })
      );
      closeRealm();
    }
  };

  return (
    <>
      <NavigationBar
        showBackButton={false}
        centerComponent={
          <DiaryMonth
            monthLabel={
              dayjs(selectedMonth).month() + 1 < 10
                ? dayjs(selectedMonth).format('M월')
                : dayjs(selectedMonth).format('MM월')
            }
            onPressLeft={() => {
              handleChangeMonth('left');
            }}
            onPressRight={() => {
              handleChangeMonth('right');
            }}
            rightDisabled={
              currentMonth.isSame(dayjs(selectedMonth), 'month') ? true : false
            }
          />
        }
      />
      {isNotEmpty(searchByMonth?.data) && (
        <ScrollView
          className="bg-white"
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <DiaryCardList />
        </ScrollView>
      )}

      {isEmpty(searchByMonth?.data) && <DiaryEmptyMent />}
    </>
  );
};

export default DiaryList;
