import NavigationBarOrga from "../components/organisms/NavigationBar.orga";
import { Image, ScrollView, Text } from "react-native";
import { NaviActionButtonAtomProps } from "../components/atoms/NaviActionButton.atom";
import { useAppDispatch, useAppSelector, useRealm, useScale } from "../hooks";
import { useEffect } from "react";
import { dismissModalToScreen, isNotEmpty, resetToRoot } from "../utils";
import { removeDiaryThunk, setSelectedDiary, setSelectedEmotion } from "../redux/slice/diarySlice";
import { ICON_DATA } from "../constant/Icons";
import NaviDismiss from "../components/atoms/NaviDismiss.atom";
import { useRoute, RouteProp } from "@react-navigation/native";
import NaviMore from "../components/atoms/NaviMore.atom";
import PopupContainer from "../components/organisms/PopupContainer.orga";
import { setShowModalPopup } from "../redux/slice/commonSlice";

type DiaryDetailRouteParams = {
  params: {
    origin: string;
  };
};

const DiaryDetailPage = () => {
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);
  const dispatch = useAppDispatch();
  const { getScaleSize } = useScale();
  const route = useRoute<RouteProp<DiaryDetailRouteParams, 'params'>>();
  const { openRealm, closeRealm } = useRealm();
  // console.log('진입 경로:', route.params.origin);

  const leftComponents: NaviActionButtonAtomProps[] = [{
    item: <NaviDismiss />,
    disabled: false,
  }]

  const actionButtons: NaviActionButtonAtomProps[] = [{
    item: <NaviMore />,
    disabled: false,
    onPress: () => {
      dispatch(setShowModalPopup(true));
    }
  }]

  useEffect(() => {
    return () => {
      dispatch(setSelectedEmotion(null));
      dispatch(setSelectedDiary({}));
      resetToRoot();
    }
  }, [])

  const handleRemoveDiary = async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm) && isNotEmpty(selectedDiary.emotionId)) {
      try {
        await dispatch(removeDiaryThunk({realm, emotionId: selectedDiary.emotionId}));
        closeRealm();
        dismissModalToScreen();
      } catch(error) {
        console.log(">>>>>>>>>>>", error);
      }
    }
  }

  return (
    <>
      <PopupContainer 
        title="일기를 삭제할까요?" 
        message="삭제한 일기는 복구가 어려워요." 
        cancelText="취소" 
        confirmText="확인"
        onConfirm={handleRemoveDiary}
      />
      <NavigationBarOrga 
        showBackButton={route.params.origin == "RootStack"} 
        leftComponents={route.params.origin == "diaryStack" ? leftComponents : null} 
        actionButtons={actionButtons} 
      />
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