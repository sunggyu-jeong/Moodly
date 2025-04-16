import NaviMore from "../components/atoms/NaviMore.atom";
import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { Image, ScrollView, Text } from "react-native";
import { NaviActionButtonAtomProps } from "../components/atoms/NaviActionButton.atom";
import { useAppDispatch, useAppSelector, useScale } from "../hooks";
import { useEffect, useState } from "react";
import { resetToRoot } from "../utils";
import { setSelectedDiary, setSelectedEmotion } from "../redux/slice/diarySlice";
import { ICON_DATA } from "../constant/Icons";

const DiaryDetailPage = () => {
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);
  const dispatch = useAppDispatch();
  const { getScaleSize } = useScale();
  

  const actionButtons: NaviActionButtonAtomProps[] = [{
    item: <NaviMore />,
    disabled: false,
    onPress: () => {
    },
  }]

  useEffect(() => {
    return () => {
      dispatch(setSelectedEmotion(null));
      dispatch(setSelectedDiary({}));
      resetToRoot();
    }
  }, [])

  return (
    <>
      <NavigationBarOrga showBackButton={true} actionButtons={actionButtons} />
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerStyle={{
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        
        <Image 
          source={ICON_DATA.find((item) => item.id === selectedDiary?.iconId)?.icon} 
          className="mt-[37px]"
          style={{ width: getScaleSize(137), height: getScaleSize(137) }}
        />
        <Text
          className="font-pretendard font-medium text-center tracking-[-0.5px] mx-6 leading-[30px]"
          style={{ marginTop: getScaleSize(34), fontSize: getScaleSize(18) }}>
            {selectedDiary.description}
        </Text>
      </ScrollView>
    </>    
  )
}

export default DiaryDetailPage;