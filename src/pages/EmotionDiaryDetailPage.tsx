import { RouteProp, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { removeDiaryThunk } from '@features/diary/model/diary.slice.ts';
import { MODAL_CONFIRM_ACTION_KEY } from '@processes/key';

import {
  setOverlayEventHandler,
  setShowDropdownView,
  setShowModalPopup,
  setShowToastView,
} from '@processes/overlay/model/overlay.slice';
import { COMMON_ICONS } from '@shared/assets/images/common';
import { ICON_DATA } from '@shared/constants/Icons.ts';
import { getScaleSize, useAppDispatch, useAppSelector, useRealm } from '@shared/hooks';
import { dismissModalToScreen, goBack, isNotEmpty } from '@shared/lib';
import { NaviActionButtonProps } from '@shared/ui/elements/NaviActionButton.tsx';
import NaviMore from '@shared/ui/elements/NaviMore.tsx';
import { Body1 } from '@shared/ui/typography/Body1.tsx';
import { DropDownEventIdentifier } from '@widgets/dropdown/ui/DropDownItem.tsx';
import NaviDismiss from '@widgets/navigation-bar/ui/NaviDismiss.tsx';
import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';

import type Realm from 'realm';

type DiaryDetailRouteParams = {
  params: {
    origin: string;
  };
};

const props = [
  {
    text: '수정하기',
    source: COMMON_ICONS.iconEdit,
    eventIdentifier: DropDownEventIdentifier.MODIFY_DIARY,
  },
  {
    text: '삭제하기',
    source: COMMON_ICONS.iconDelete,
    eventIdentifier: DropDownEventIdentifier.DELETE_DIARY,
  },
];

const leftComponents = [{ item: <NaviDismiss />, disabled: false }];

const EmotionDiaryDetailPage = () => {
  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const overlayEventHandler = useAppSelector(state => state.overlaySlice.overlayEventHandler);
  const showModalPopup = useAppSelector(state => state.overlaySlice.showModalPopup);
  const isLogin = useAppSelector(state => state.authSlice.isLogin);
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<DiaryDetailRouteParams, 'params'>>();
  const { openRealm, closeRealm } = useRealm();
  const dropdownButtonRef = useRef<View>(null);
  const openDropdown = useCallback(() => {
    dropdownButtonRef.current?.measureInWindow((x, y, width, height) => {
      dispatch(
        setShowDropdownView({
          visibility: true,
          dropdownList: props,
          pos: { x, y: y + height + 5 + Platform.OS === 'ios' ? 0 : 70 },
        })
      );
    });
  }, [dropdownButtonRef, dispatch]);

  const actionButtons: NaviActionButtonProps[] = useMemo(
    () => [
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
    ],
    [openDropdown]
  );

  const handleRemoveDiary = useCallback(async () => {
    try {
      let realm: Realm | undefined;
      if (!isLogin) {
        realm = await openRealm();
      }
      if (!isNotEmpty(selectedDiary?.emotionId)) {
        throw new Error('선택된 일기가 없습니다.');
      }
      await dispatch(
        removeDiaryThunk({ realm, emotionId: selectedDiary.emotionId, isLogin })
      ).unwrap();
      if (route.params.origin === 'RootStack') {
        goBack();
      } else {
        dismissModalToScreen();
        goBack();
      }
      dispatch(setShowToastView({ visibility: true, message: '일기가 삭제되었어요!' }));
    } catch (error) {
      console.error('handleRemoveDiary error:', error);
      dispatch(
        setShowToastView({
          visibility: true,
          message: error as string,
        })
      );
    } finally {
      if (!isLogin) {
        closeRealm();
      }
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
  }, [
    openRealm,
    selectedDiary,
    dispatch,
    route.params.origin,
    closeRealm,
    showModalPopup,
    isLogin,
  ]);

  useEffect(() => {
    if (
      isNotEmpty(overlayEventHandler) &&
      overlayEventHandler === MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY
    ) {
      handleRemoveDiary();
    }
  }, [overlayEventHandler, handleRemoveDiary]);

  return (
    <>
      <NavigationBar
        showBackButton={route.params.origin == 'RootStack'}
        leftComponents={route.params.origin == 'DiaryStack' ? leftComponents : null}
        actionButtons={actionButtons}
      />

      <ScrollView
        className="flex-1 bg-common-white"
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={ICON_DATA.find(item => item.id === selectedDiary?.iconId)?.iconBig}
          style={styles.emotionImage}
        />
        <Body1
          weight="regular"
          style={styles.diaryText}
        >
          {selectedDiary?.description}
        </Body1>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'flex-start',
    padding: 20,
  },
  diaryText: {
    marginTop: 20,
    textAlign: 'left',
    width: '100%',
  },
  emotionImage: {
    alignSelf: 'center',
    height: getScaleSize(190),
    width: getScaleSize(190),
  },
});

export default EmotionDiaryDetailPage;
