import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import DiaryCardListOrga from "../components/organisms/DiaryCardList.orga";
import { ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks";
import dayjs from "dayjs";
import { setSelectedMonth } from "../redux/slice/diarySlice";
import DiaryMonth from "../components/molecules/DiaryMonth.mol";
import ToastAnimated from "../components/molecules/ToastAnimated.mol";

const DiaryListPage = () => {
  const selectedMonth = useAppSelector((state) => state.diarySlice.selectedMonth);
  const showToastView = useAppSelector((state) => state.commonSlice.showToastView);
  const currentMonth = dayjs();
  const dispatch = useAppDispatch();  

  const handleChangeMonth = (direction: "left" | "right") => { 
    dispatch(setSelectedMonth(dayjs(selectedMonth).add(direction === "left" ? -1 : 1, "month").toISOString()));
  }

  return (
    <>
      {
        showToastView &&
        <ToastAnimated text="일기가 삭제되었어요!" />
      }
      <NavigationBarOrga 
        showBackButton={false} 
        centerComponent={
          <DiaryMonth
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