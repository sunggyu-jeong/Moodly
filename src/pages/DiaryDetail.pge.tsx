import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
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
import { MODAL_CONFIRM_ACTION_KEY } from '../manager/OverlayManager';
import {
  setOverlayEventHandler,
  setShowDropdownView,
  setShowModalPopup,
  setShowToastView,
} from '../redux/slice/commonSlice';
import { removeDiaryThunk } from '../redux/slice/diarySlice';
import { dismissModalToScreen, goBack, isNotEmpty } from '../utils';

type DiaryDetailRouteParams = {
  params: {
    origin: string;
  };
};

const DiaryDetail = () => {
  const selectedDiary = useAppSelector((state) => state.diarySlice.selectedDiary);
  const overlayEventHandler = useAppSelector(
    (state) => state.commonSlice.overlayEventHandler
  );
  const showModalPopup = useAppSelector((state) => state.commonSlice.showModalPopup);
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
  useEffect(() => {
    if (
      isNotEmpty(overlayEventHandler) &&
      overlayEventHandler === MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY
    ) {
      handleRemoveDiary();
    }
  }, [overlayEventHandler]);

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
    try {
      const realm = await openRealm();
      if (!isNotEmpty(realm) || !isNotEmpty(selectedDiary?.emotionId)) {
        throw new Error('선택된 일기가 없거나 Realm을 열 수 없습니다.');
      }
      await dispatch(removeDiaryThunk({ realm, emotionId: selectedDiary.emotionId }));
      if (route.params.origin === 'RootStack') {
        goBack();
      } else {
        dismissModalToScreen();
      }
      dispatch(setShowToastView({ visibility: true, message: '일기가 삭제되었어요!' }));
    } catch (error) {
      console.error('handleRemoveDiary error:', error);
      dispatch(
        setShowToastView({
          visibility: true,
          message: '일기를 삭제하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        })
      );
    } finally {
      closeRealm();
      dispatch(setOverlayEventHandler(null));
      dispatch(
        setShowModalPopup({
          visibility: false,
          title: showModalPopup?.title ?? '',
          message: showModalPopup?.message ?? '',
          confirmText: showModalPopup?.confirmText,
          cancelText: showModalPopup?.cancelText,
          confirmActionKey: showModalPopup?.confirmActionKey ?? '',
        })
      );
    }
  };

  return (
    <>
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
          className="font-pretendard font-medium text-start tracking-[-0.5px] px-6 leading-[30px] w-full"
          style={{ marginTop: getScaleSize(34), fontSize: getScaleSize(18) }}
        >
          {selectedDiary?.description}
        </Text>
      </ScrollView>
    </>
  );
};

export default DiaryDetail;
