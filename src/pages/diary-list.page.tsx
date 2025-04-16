import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import DiaryCardListOrga from "../components/organisms/DiaryCardList.orga";
import { ScrollView } from "react-native";
import DiaryMonthAtom from "../components/atoms/DiaryMonth.atom";
import { useAppDispatch, useAppSelector } from "../hooks";
import dayjs from "dayjs";
import { setSelectedMonth } from "../redux/slice/diarySlice";

const DiaryListPage = () => {
  const selectedMonth = useAppSelector((state) => state.diarySlice.selectedMonth);
  const currentMonth = dayjs();
  const dispatch = useAppDispatch();

  const handleChangeMonth = (direction: "left" | "right") => { 
    dispatch(setSelectedMonth(dayjs(selectedMonth).add(direction === "left" ? -1 : 1, "month").toISOString()));
  }

  return (
    <>
      <NavigationBarOrga 
        showBackButton={false} 
        centerComponent={
          <DiaryMonthAtom 
            monthLabel={(dayjs(selectedMonth).month() + 1) < 10
              ? dayjs(selectedMonth).format("M월")
              : dayjs(selectedMonth).format("MM월")} 
            onPressLeft={() => {handleChangeMonth("left")}}
            onPressRight={() => {handleChangeMonth("right")}}
            rightDisabled={currentMonth.isSame(dayjs(selectedMonth), "month") ? true : false}
          />
        } 
      />
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        <DiaryCardListOrga />
      </ScrollView>
    </>
  )
}

export default DiaryListPage;