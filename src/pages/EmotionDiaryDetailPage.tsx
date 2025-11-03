import { useDeleteDiaryMutation } from '@/entities/diary/api';
import { setSelectedDay, resetDiary } from '@/features/diary';
import { MODAL_CONFIRM_ACTION_KEY } from '@/processes/key';
import {
  setShowDropdownView,
  setOverlayEventHandler,
  resetModalPopup,
} from '@/processes/overlay/model/overlaySlice';
import {
  useAppSelector,
  useAppDispatch,
  NaviActionButtonProps,
  NaviMore,
  isNotEmpty,
  dismissModalToScreen,
  goBack,
  ICON_DATA,
  Body1,
  common,
  getScaleSize,
} from '@/shared';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { isIphone } from '@/shared/lib/user.util';
import { DropDownEventIdentifier } from '@/widgets/dropdown';
import { NaviDismiss, NavigationBar } from '@/widgets/navigation-bar';
import { ScrollView, Image } from 'moti';
import { useRef, useCallback, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native/types';

type DiaryDetailRouteParams = {
  params: {
    origin: string;
  };
};

const dropdownItems = [
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
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<DiaryDetailRouteParams, 'params'>>();
  const dropdownButtonRef = useRef<View>(null);
  const [deleteDiary] = useDeleteDiaryMutation();

  const openDropdown = useCallback(() => {
    dropdownButtonRef.current?.measureInWindow((x, y, width, height) => {
      dispatch(
        setShowDropdownView({
          visibility: true,
          dropdownList: dropdownItems,
          pos: { x, y: y + height + 5 + (isIphone() ? 0 : 70) },
        }),
      );
    });
  }, [dispatch]);

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
    [openDropdown],
  );

  const handleRemoveDiary = useCallback(async () => {
    try {
      if (isNotEmpty(selectedDiary?.emotionId)) {
        await deleteDiary({ id: String(selectedDiary.emotionId) });
        if (route.params.origin !== 'RootStack') {
          dismissModalToScreen();
        }
        dispatch(setSelectedDay(null));
        goBack();
      }
    } catch (error) {
      console.error('다이어리 삭제 요청 실패:', error);
    } finally {
      dispatch(setOverlayEventHandler(null));
      dispatch(resetModalPopup());
    }
  }, [deleteDiary, dispatch, route.params.origin, selectedDiary?.emotionId]);

  useEffect(() => {
    if (overlayEventHandler === MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY) {
      handleRemoveDiary();
    }
  }, [overlayEventHandler, handleRemoveDiary]);

  useEffect(() => {
    return () => {
      dispatch(resetDiary());
    };
  }, [dispatch]);

  return (
    <>
      <NavigationBar
        showBackButton={route.params.origin === 'RootStack'}
        leftComponents={route.params.origin === 'DiaryStack' ? leftComponents : null}
        actionButtons={actionButtons}
      />

      <ScrollView
        style={styles.container}
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
  container: {
    flex: 1,
    backgroundColor: common.white,
  },
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
    width: getScaleSize(190),
    height: getScaleSize(190),
  },
});

export default EmotionDiaryDetailPage;
