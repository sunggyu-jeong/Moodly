import { RouteProp, useRoute } from '@react-navigation/native';
import { useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IMAGES } from '../assets/images';
import { NaviActionButtonProps } from '../components/atoms/NaviActionButton.atm';
import NaviMore from '../components/atoms/NaviMore.atm';
import {
  DropDownEventIdentifier,
  DropDownItemProps,
} from '../components/molecules/DropDownItem.mol';
import NaviDismiss from '../components/molecules/NaviDismiss.mol';
import NavigationBar from '../components/organisms/NavigationBar.org';
import { ICON_DATA } from '../constant/Icons';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '../hooks';
import { setShowDropdownView, setShowToastView } from '../redux/slice/commonSlice';
import { removeDiaryThunk } from '../redux/slice/diarySlice';
import { dismissModalToScreen, goBack, isNotEmpty } from '../utils';

type DiaryDetailRouteParams = {
  params: {
    origin: string;
  };
};

const DiaryDetail = () => {
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<DiaryDetailRouteParams, 'params'>>();
  const { openRealm, closeRealm } = useRealm();
  const dropdownButtonRef = useRef<View>(null);

  const leftComponents: NaviActionButtonProps[] = [
    {
      item: <NaviDismiss />,
      disabled: false,
    },
  ];

  const actionButtons: NaviActionButtonProps[] = [
    {
      item: (
        <TouchableOpacity
          ref={dropdownButtonRef}
          onPress={openDropdown}
        >
          <NaviMore />
        </TouchableOpacity>
      ),
      disabled: false,
    },
  ];

  const props: DropDownItemProps[] = [
    {
      text: '수정하기',
      source: IMAGES.iconModify,
      eventIdentifier: DropDownEventIdentifier.MODIFY_DIARY,
    },
    {
      text: '삭제하기',
      source: IMAGES.iconDelete,
      eventIdentifier: DropDownEventIdentifier.DELETE_DIARY,
    },
  ];

  function openDropdown() {
    dropdownButtonRef.current?.measureInWindow((x, y, width, height) => {
      dispatch(
        setShowDropdownView({
          visibility: true,
          dropdownList: props,
          pos: { x, y: y + height + 5 },
        })
      );
    });
  }

  const handleRemoveDiary = async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm) && isNotEmpty(selectedDiary.emotionId)) {
      try {
        await dispatch(removeDiaryThunk({ realm, emotionId: selectedDiary.emotionId }));
        closeRealm();
        if (route.params.origin == 'RootStack') {
          goBack();
        } else {
          dismissModalToScreen();
        }
        dispatch(setShowToastView({ visibility: true, message: '일기가 삭제되었어요!' }));
      } catch (error) {
        console.log('>>>>>>>>>>>', error);
      }
    }
  };

  return (
    <>
      {/* <PopupContainer 
        title="일기를 삭제할까요?" 
        message="삭제한 일기는 복구가 어려워요." 
        cancelText="취소" 
        confirmText="확인"
        onConfirm={handleRemoveDiary}
      /> */}
      <NavigationBar
        showBackButton={route.params.origin == 'RootStack'}
        leftComponents={route.params.origin == 'DiaryStack' ? leftComponents : null}
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
          style={{ marginTop: getScaleSize(34), fontSize: getScaleSize(18) }}
        >
          {selectedDiary.description}
        </Text>
      </ScrollView>
    </>
  );
};

export default DiaryDetail;
