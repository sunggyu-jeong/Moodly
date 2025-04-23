import dayjs from 'dayjs';
import { ScrollView } from 'react-native';
import DiaryMonth from '../components/molecules/DiaryMonth.mol';
import DiaryCardList from '../components/organisms/DiaryCardList.org';
import NavigationBar from '../components/organisms/NavigationBar.org';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setSelectedMonth } from '../redux/slice/diarySlice';

const DiaryList = () => {
  const selectedMonth = useAppSelector((state) => state.diarySlice.selectedMonth);
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
      <ScrollView
        className="bg-white"
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        <DiaryCardList />
      </ScrollView>
    </>
  );
};

export default DiaryList;
