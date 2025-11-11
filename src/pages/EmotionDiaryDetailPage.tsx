import { RouteProp, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useDeleteDiaryMutation } from '@/entities/diary/api';
import { MODAL_CONFIRM_ACTION_KEY } from '@/entities/overlay/model/types';
import { resetDiary, setSelectedDay } from '@/features/diary/model/diarySlice';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { ICON_DATA } from '@/shared/constants/icons';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { getScaleSize } from '@/shared/hooks/useScale';
import { DropDownEventIdentifier } from '@/shared/keys/dropdownKeys';
import { dismissModalToScreen, goBack } from '@/shared/lib/navigation.util';
import { isIphone } from '@/shared/lib/user.util';
import { isNotEmpty } from '@/shared/lib/value.util';
import {
  resetModalPopup,
  setOverlayEventHandler,
  setShowDropdownView,
} from '@/shared/model/overlaySlice';
import { common } from '@/shared/styles/colors';
import { NaviActionButtonProps } from '@/shared/ui/elements/NaviActionButton';
import NaviDismiss from '@/shared/ui/elements/navigation/NaviDismiss';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import NaviMore from '@/shared/ui/elements/NaviMore';
import { Body1 } from '@/shared/ui/typography/Body1';

type DiaryDetailOrigin = 'RootStack' | 'DiaryStack' | string;

type DiaryDetailRouteParams = {
  origin: DiaryDetailOrigin;
};

type DiaryDetailRoute = RouteProp<
  { EmotionDiaryDetail: DiaryDetailRouteParams },
  'EmotionDiaryDetail'
>;

const DROPDOWN_ITEMS = [
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

const LEFT_COMPONENTS = [{ item: <NaviDismiss />, disabled: false }];

const DROPDOWN_OFFSET = {
  TOP_SPACING: 5,
  ANDROID_STATUS_BAR: 70,
};

const EmotionDiaryDetailPage = () => {
  const route = useRoute<DiaryDetailRoute>();
  const dispatch = useAppDispatch();
  const dropdownButtonRef = useRef<View>(null);

  const selectedDiary = useAppSelector(state => state.diarySlice.selectedDiary);
  const overlayEventHandler = useAppSelector(state => state.overlaySlice.overlayEventHandler);
  const [deleteDiary, { isLoading: isDeleting }] = useDeleteDiaryMutation();

  const isFromRootStack = route.params?.origin === 'RootStack';
  const isFromDiaryStack = route.params?.origin === 'DiaryStack';
  const emotionIcon = useMemo(
    () => ICON_DATA.find(item => item.id === selectedDiary?.iconId)?.iconBig,
    [selectedDiary?.iconId],
  );

  const openDropdown = useCallback(() => {
    if (!dropdownButtonRef.current) {
      return;
    }

    dropdownButtonRef.current.measureInWindow((x, y, _width, height) => {
      const yOffset = isIphone() ? 0 : DROPDOWN_OFFSET.ANDROID_STATUS_BAR;

      dispatch(
        setShowDropdownView({
          visibility: true,
          dropdownList: DROPDOWN_ITEMS,
          pos: {
            x,
            y: y + height + DROPDOWN_OFFSET.TOP_SPACING + yOffset,
          },
        }),
      );
    });
  }, [dispatch]);

  const handleRemoveDiary = useCallback(async () => {
    if (!selectedDiary?.emotionId) {
      console.warn('삭제할 다이어리 ID가 없습니다');
      dispatch(resetModalPopup());
      return;
    }

    try {
      await deleteDiary({ id: String(selectedDiary.emotionId) }).unwrap();
      if (!isFromRootStack) {
        dismissModalToScreen();
      }

      dispatch(setSelectedDay(null));
      goBack();
    } catch (error) {
      console.error('다이어리 삭제 실패:', error);
    } finally {
      dispatch(setOverlayEventHandler(null));
      dispatch(resetModalPopup());
    }
  }, [deleteDiary, dispatch, isFromRootStack, selectedDiary?.emotionId]);

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

  const actionButtons: NaviActionButtonProps[] = useMemo(
    () => [
      {
        item: (
          <TouchableOpacity
            ref={dropdownButtonRef}
            onPress={openDropdown}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            <NaviMore />
          </TouchableOpacity>
        ),
        disabled: isDeleting,
      },
    ],
    [openDropdown, isDeleting],
  );

  const leftComponents = useMemo(
    () => (isFromDiaryStack ? LEFT_COMPONENTS : null),
    [isFromDiaryStack],
  );

  if (!selectedDiary) {
    return null;
  }

  return (
    <>
      <NavigationBar
        showBackButton={isFromRootStack}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {emotionIcon && (
          <Image
            source={emotionIcon}
            style={styles.emotionImage}
            resizeMode="contain"
          />
        )}

        {isNotEmpty(selectedDiary.description) && (
          <Body1
            weight="regular"
            style={styles.diaryText}
          >
            {selectedDiary.description}
          </Body1>
        )}
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
