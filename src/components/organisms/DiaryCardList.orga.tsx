import { TouchableOpacity, View } from "react-native";
import { IMAGES } from "../../assets/images";
import DiaryCardHeader from "../molecules/DiaryCardHeader.mol";
import DiaryCardContent from "../molecules/DiaryCardContent.mol";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useAppSelector, useRealm } from "../../hooks";
import { isNotEmpty, navigate } from "../../utils";
import { useAppDispatch } from "../../hooks";
import { searchDiaryByMonthThunk, setSelectedDiary } from "../../redux/slice/diarySlice";
import { EmotionDiaryDTO } from "../../scheme";

const DiaryCardListOrga = () => {
  const { openRealm, closeRealm } = useRealm();
  const dispatch = useAppDispatch();
  const selectedMonth = useAppSelector((state) => state.diarySlice.selectedMonth);
  const searchByMonth = useAppSelector((state) => state.diarySlice.searchByMonth);
  
  useFocusEffect(
    useCallback(() => {
      initialize();
    }, [selectedMonth])
  );

  const initialize = async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(searchDiaryByMonthThunk({realm, recordDate: new Date(selectedMonth)}));
      closeRealm();
    }
  }

  const handleDiaryDetail = (item: EmotionDiaryDTO) => {
    dispatch(setSelectedDiary(item));
    navigate("DiaryStack", { screen: "DiaryDetail" });
  }

  return (
    <View className="justify-start items-stretch w-full mt-[11.5px]">
      {
        isNotEmpty(searchByMonth?.data) && (
          searchByMonth?.data?.map((entry, index) => (
          <TouchableOpacity onPress={() => { handleDiaryDetail(entry)}} key={index}> 
            <View key={index} className="bg-[#F0F0F0] p-4 mb-4 rounded-[9px]">
              {
                isNotEmpty(searchByMonth?.data) && (
                  <DiaryCardHeader iconId={entry.iconId} recordDate={entry.recordDate} />
                )
              }
              <DiaryCardContent content={entry.description ?? ""} />
            </View>
          </TouchableOpacity>
          ))
        )
      }
    </View>
  );
};

export default DiaryCardListOrga;
